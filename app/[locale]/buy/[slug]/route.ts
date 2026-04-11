import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale } from "@/i18n/config";
import { buildProductWhatsAppMessage, buildWhatsAppLink } from "@/lib/utils";
import { getCustomerSessionFromRequest, recordBuyerIntent } from "@/services/customer-auth";
import { getProductBySlug } from "@/services/products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale: rawLocale, slug } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const source = request.nextUrl.searchParams.get("source")?.trim() || "storefront";
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return NextResponse.redirect(new URL(`/${locale}/products`, request.url));
  }

  const session = await getCustomerSessionFromRequest(request);

  if (!session) {
    await recordBuyerIntent({
      productId: product.id,
      locale,
      channel: "whatsapp",
      source: `${source}:auth-required`,
      note: "Customer must authenticate before redirecting to checkout channel.",
    });

    const loginUrl = new URL(`/${locale}/account/login`, request.url);
    const nextPath = `/${locale}/buy/${slug}?source=${encodeURIComponent(source)}`;
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  await recordBuyerIntent({
    customerUserId: session.user.id,
    productId: product.id,
    locale,
    channel: "whatsapp",
    source,
    note: "Customer redirected to WhatsApp checkout.",
  });

  const message = [
    buildProductWhatsAppMessage(product.name, product.price),
    `Customer: ${session.user.fullName} (${session.user.email})`,
  ].join("\n");

  return NextResponse.redirect(buildWhatsAppLink(message));
}
