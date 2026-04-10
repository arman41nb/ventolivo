import { NextResponse } from "next/server";
import { getRequestLogContext, logError, withRequestId } from "@/lib/logger";
import { getProductBySlug } from "@/services/products";
import { productQuerySchema } from "@/lib/validations";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const logContext = getRequestLogContext(request);

  try {
    const { slug } = await params;
    const result = productQuerySchema.safeParse({ slug });

    if (!result.success) {
      return withRequestId(
        NextResponse.json(
          { error: "Invalid slug format", details: result.error.flatten().fieldErrors },
          { status: 400 },
        ),
        logContext.requestId,
      );
    }

    const product = await getProductBySlug(result.data.slug);

    if (!product) {
      return withRequestId(
        NextResponse.json({ error: "Product not found" }, { status: 404 }),
        logContext.requestId,
      );
    }

    return withRequestId(NextResponse.json({ product }), logContext.requestId);
  } catch (error) {
    logError("api.products.detail", error, logContext);
    return withRequestId(
      NextResponse.json({ error: "Internal server error" }, { status: 500 }),
      logContext.requestId,
    );
  }
}
