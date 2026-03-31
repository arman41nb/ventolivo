import { NextResponse } from "next/server";
import { getProductBySlug } from "@/services/products";
import { productQuerySchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const result = productQuerySchema.safeParse({ slug });

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid slug format", details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const product = await getProductBySlug(result.data.slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
