import { NextResponse } from "next/server";
import { getAllProducts, getProductsByTag } from "@/modules/products";
import { productFilterSchema } from "@/lib/validations";
import { isValidLocale, type Locale } from "@/i18n/config";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const result = productFilterSchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const locale = searchParams.get("locale");
    const resolvedLocale = locale && isValidLocale(locale) ? (locale as Locale) : undefined;
    const { tag, featured, limit } = result.data;
    let products = tag
      ? await getProductsByTag(tag, resolvedLocale)
      : await getAllProducts(resolvedLocale);

    if (featured === "true") {
      products = products.filter((product) => product.featured);
    }

    if (limit) {
      products = products.slice(0, limit);
    }

    return NextResponse.json({ products, count: products.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
