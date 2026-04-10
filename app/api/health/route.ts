import { NextResponse } from "next/server";
import { getApplicationHealth } from "@/lib/health";
import { getRequestLogContext, withRequestId } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const health = await getApplicationHealth();
  const { requestId } = getRequestLogContext(request);

  return withRequestId(
    NextResponse.json(health, {
      status: health.status === "ok" ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }),
    requestId,
  );
}
