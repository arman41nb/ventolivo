"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mediaAssetSchema } from "@/lib/validations";
import { recordAdminAuditLog, requireAdminSession } from "@/modules/admin-auth";
import { createMediaAsset, deleteMediaAsset, updateMediaAsset } from "@/modules/media";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getAssetInput(formData: FormData) {
  const result = mediaAssetSchema.safeParse({
    kind: getStringValue(formData, "kind"),
    url: getStringValue(formData, "url"),
    altText: getStringValue(formData, "altText"),
    thumbnailUrl: getStringValue(formData, "thumbnailUrl"),
    label: getStringValue(formData, "label"),
  });

  if (!result.success) {
    throw new Error("Invalid media asset form data");
  }

  return result.data;
}

function revalidateAdminMedia(locale: string) {
  revalidatePath(`/${locale}/admin/media`);
  revalidatePath(`/${locale}/admin/products`);
  revalidatePath(`/${locale}/admin/products/new`);
}

export async function createMediaAssetAction(formData: FormData) {
  const session = await requireAdminSession();
  const locale = getStringValue(formData, "locale") || "en";
  const asset = await createMediaAsset(getAssetInput(formData));

  await recordAdminAuditLog({
    action: "media.created",
    adminUserId: session.user.id,
    actorLabel: session.user.username,
    targetType: "media",
    targetId: asset.id,
    metadata: `Created ${asset.kind} asset ${asset.url}.`,
  });

  revalidateAdminMedia(locale);
  redirect(`/${locale}/admin/media?status=created`);
}

export async function updateMediaAssetAction(formData: FormData) {
  const session = await requireAdminSession();
  const locale = getStringValue(formData, "locale") || "en";
  const id = getStringValue(formData, "id");
  const asset = await updateMediaAsset(id, getAssetInput(formData));

  await recordAdminAuditLog({
    action: "media.updated",
    adminUserId: session.user.id,
    actorLabel: session.user.username,
    targetType: "media",
    targetId: asset.id,
    metadata: `Updated ${asset.kind} asset ${asset.url}.`,
  });

  revalidateAdminMedia(locale);
  redirect(`/${locale}/admin/media?status=updated`);
}

export async function deleteMediaAssetAction(formData: FormData) {
  const session = await requireAdminSession();
  const locale = getStringValue(formData, "locale") || "en";
  const id = getStringValue(formData, "id");
  await deleteMediaAsset(id);

  await recordAdminAuditLog({
    action: "media.deleted",
    adminUserId: session.user.id,
    actorLabel: session.user.username,
    targetType: "media",
    targetId: id,
    metadata: "Deleted media asset from library.",
  });

  revalidateAdminMedia(locale);
  redirect(`/${locale}/admin/media?status=deleted`);
}
