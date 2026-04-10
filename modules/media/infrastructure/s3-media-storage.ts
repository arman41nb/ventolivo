import "server-only";

import { createHash, createHmac } from "node:crypto";
import { env } from "@/lib/env";
import {
  getMediaFileLabel,
  getStoredMediaFileName,
  type StoredMediaFile,
  type UploadableMediaFile,
} from "./media-file-helpers";

const EMPTY_PAYLOAD_SHA256 =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

function requireS3Config() {
  if (
    !env.MEDIA_S3_ENDPOINT ||
    !env.MEDIA_S3_BUCKET ||
    !env.MEDIA_S3_ACCESS_KEY_ID ||
    !env.MEDIA_S3_SECRET_ACCESS_KEY
  ) {
    throw new Error("S3 media storage is not fully configured.");
  }

  return {
    accessKeyId: env.MEDIA_S3_ACCESS_KEY_ID,
    bucket: env.MEDIA_S3_BUCKET,
    endpoint: env.MEDIA_S3_ENDPOINT,
    forcePathStyle: env.MEDIA_S3_FORCE_PATH_STYLE,
    keyPrefix: env.MEDIA_S3_KEY_PREFIX.replace(/^\/+|\/+$/g, ""),
    publicBaseUrl: env.MEDIA_S3_PUBLIC_BASE_URL,
    region: env.MEDIA_S3_REGION,
    secretAccessKey: env.MEDIA_S3_SECRET_ACCESS_KEY,
  };
}

function sha256Hex(value: string | Uint8Array) {
  return createHash("sha256").update(value).digest("hex");
}

function hmacSha256(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function toAmzDate(date: Date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, "");
}

function toDateStamp(date: Date) {
  return toAmzDate(date).slice(0, 8);
}

function encodeRfc3986(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function normalizePathSegments(value: string) {
  return value
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeRfc3986(segment))
    .join("/");
}

function buildBucketUrl() {
  const config = requireS3Config();
  const endpoint = new URL(config.endpoint);

  if (config.forcePathStyle) {
    endpoint.pathname = [endpoint.pathname.replace(/\/+$/, ""), config.bucket]
      .filter(Boolean)
      .join("/");
    return endpoint;
  }

  endpoint.hostname = `${config.bucket}.${endpoint.hostname}`;
  return endpoint;
}

export function buildS3ObjectKey(fileName: string) {
  const { keyPrefix } = requireS3Config();
  return [keyPrefix, fileName].filter(Boolean).join("/");
}

export function resolveS3PublicUrl(objectKey: string) {
  const config = requireS3Config();

  if (config.publicBaseUrl) {
    return new URL(normalizePathSegments(objectKey), `${config.publicBaseUrl.replace(/\/+$/, "")}/`)
      .toString();
  }

  return new URL(normalizePathSegments(objectKey), `${buildBucketUrl().toString().replace(/\/+$/, "")}/`)
    .toString();
}

export function getS3ObjectKeyFromUrl(resourceUrl: string) {
  const config = requireS3Config();
  const normalizedResourceUrl = resourceUrl.replace(/\/+$/, "");
  const candidateBaseUrls = [resolveS3PublicUrl(""), buildBucketUrl().toString().replace(/\/+$/, "")];

  if (config.publicBaseUrl) {
    candidateBaseUrls.unshift(config.publicBaseUrl.replace(/\/+$/, ""));
  }

  for (const baseUrl of candidateBaseUrls) {
    if (!baseUrl) {
      continue;
    }

    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

    if (normalizedResourceUrl.startsWith(normalizedBaseUrl)) {
      return decodeURIComponent(
        normalizedResourceUrl.slice(normalizedBaseUrl.length).replace(/^\/+/, ""),
      );
    }
  }

  throw new Error("Unable to resolve S3 object key from resource URL.");
}

function getCanonicalUri(objectKey = "") {
  const bucketUrl = buildBucketUrl();
  const basePath = bucketUrl.pathname.replace(/\/+$/, "");
  const objectPath = normalizePathSegments(objectKey);
  const normalizedPath = [basePath, objectPath].filter(Boolean).join("/");
  return `/${normalizedPath.replace(/^\/+/, "")}`;
}

function getSigningKey(secretAccessKey: string, dateStamp: string, region: string) {
  const dateKey = hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const regionKey = hmacSha256(dateKey, region);
  const serviceKey = hmacSha256(regionKey, "s3");
  return hmacSha256(serviceKey, "aws4_request");
}

function buildCanonicalQueryString(searchParams: URLSearchParams) {
  return Array.from(searchParams.entries())
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${encodeRfc3986(key)}=${encodeRfc3986(value)}`)
    .join("&");
}

function buildSignedS3Request(input: {
  bodySha256: string;
  method: "DELETE" | "GET" | "PUT";
  objectKey?: string;
  query?: URLSearchParams;
}) {
  const config = requireS3Config();
  const bucketUrl = buildBucketUrl();
  const timestamp = new Date();
  const amzDate = toAmzDate(timestamp);
  const dateStamp = toDateStamp(timestamp);
  const query = input.query ?? new URLSearchParams();
  const canonicalUri = getCanonicalUri(input.objectKey);
  const canonicalHeaders = [
    `host:${bucketUrl.host}`,
    `x-amz-content-sha256:${input.bodySha256}`,
    `x-amz-date:${amzDate}`,
  ].join("\n");
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    input.method,
    canonicalUri,
    buildCanonicalQueryString(query),
    `${canonicalHeaders}\n`,
    signedHeaders,
    input.bodySha256,
  ].join("\n");
  const credentialScope = `${dateStamp}/${config.region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");
  const signature = createHmac(
    "sha256",
    getSigningKey(config.secretAccessKey, dateStamp, config.region),
  )
    .update(stringToSign)
    .digest("hex");
  const authorization = [
    `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(", ");
  const requestUrl = new URL(bucketUrl.toString());

  requestUrl.pathname = canonicalUri;
  requestUrl.search = query.toString();

  return {
    headers: {
      authorization,
      "x-amz-content-sha256": input.bodySha256,
      "x-amz-date": amzDate,
    },
    requestUrl,
  };
}

async function assertS3ResponseOk(response: Response, action: string) {
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${action} failed with ${response.status}: ${detail || response.statusText}`);
  }
}

export async function storeS3MediaFile(file: UploadableMediaFile): Promise<StoredMediaFile> {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const objectKey = buildS3ObjectKey(getStoredMediaFileName(file));
  const payloadSha256 = sha256Hex(fileBuffer);
  const signedRequest = buildSignedS3Request({
    bodySha256: payloadSha256,
    method: "PUT",
    objectKey,
  });

  const response = await fetch(signedRequest.requestUrl, {
    method: "PUT",
    headers: {
      ...signedRequest.headers,
      "content-length": `${fileBuffer.byteLength}`,
      "content-type": file.type || "application/octet-stream",
    },
    body: fileBuffer,
  });

  await assertS3ResponseOk(response, "Uploading media to S3");

  return {
    label: getMediaFileLabel(file.name),
    relativePath: resolveS3PublicUrl(objectKey),
  };
}

export async function removeS3StoredMediaFile(resourceUrl: string): Promise<void> {
  const objectKey = getS3ObjectKeyFromUrl(resourceUrl);
  const signedRequest = buildSignedS3Request({
    bodySha256: EMPTY_PAYLOAD_SHA256,
    method: "DELETE",
    objectKey,
  });

  const response = await fetch(signedRequest.requestUrl, {
    method: "DELETE",
    headers: signedRequest.headers,
  });

  await assertS3ResponseOk(response, "Deleting media from S3");
}

export async function probeS3MediaStorage(): Promise<void> {
  const signedRequest = buildSignedS3Request({
    bodySha256: EMPTY_PAYLOAD_SHA256,
    method: "GET",
    query: new URLSearchParams({
      "list-type": "2",
      "max-keys": "1",
    }),
  });

  const response = await fetch(signedRequest.requestUrl, {
    method: "GET",
    headers: signedRequest.headers,
  });

  await assertS3ResponseOk(response, "Probing S3 media storage");
}
