import { NextResponse } from "next/server";
import { z } from "zod";
import { locales, type Locale } from "@/i18n/config";
import { getAdminSession } from "@/modules/admin-auth/server";
import { autoTranslateProductFields } from "@/lib/libretranslate";

const localeSchema = z.enum(locales);

const translateProductSchema = z.object({
  sourceLocale: localeSchema,
  targetLocales: z.array(localeSchema).min(1),
  fields: z.object({
    name: z.string().trim().min(1),
    tag: z.string().trim().min(1),
    description: z.string().trim().min(1),
  }),
});

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = translateProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid translation request" },
        { status: 400 },
      );
    }

    const { translations, providers } = await autoTranslateProductFields({
      sourceLocale: result.data.sourceLocale as Locale,
      targetLocales: result.data.targetLocales as Locale[],
      fields: result.data.fields,
    });

    return NextResponse.json({ translations, providers });
  } catch (error) {
    console.error("Product auto-translation failed:", error);

    return NextResponse.json(
      { error: "Translation service is currently unavailable" },
      { status: 500 },
    );
  }
}
