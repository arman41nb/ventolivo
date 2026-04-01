"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/products";
import { adminLoginSchema, productAdminSchema } from "@/lib/validations";
import { env } from "@/lib/env";
import { locales } from "@/i18n/config";
import {
  clearAdminSessionCookie,
  setAdminSessionCookie,
} from "@/modules/admin-auth/session";

function getStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getProductInput(formData: FormData) {
  const result = productAdminSchema.safeParse({
    name: getStringValue(formData, "name"),
    slug: getStringValue(formData, "slug"),
    tag: getStringValue(formData, "tag"),
    price: getStringValue(formData, "price"),
    color: getStringValue(formData, "color"),
    description: getStringValue(formData, "description"),
    ingredients: getStringValue(formData, "ingredients"),
    weight: getStringValue(formData, "weight"),
    featured: formData.get("featured") === "on",
  });

  if (!result.success) {
    throw new Error("Invalid product form data");
  }

  const translations = Object.fromEntries(
    ["name", "tag", "description"].map((field) => [
      field,
      Object.fromEntries(
        locales
          .map((locale) => [
            locale,
            getStringValue(formData, `translations.${field}.${locale}`),
          ])
          .filter(([, value]) => value.trim().length > 0),
      ),
    ]),
  );

  return {
    name: result.data.name,
    slug: result.data.slug,
    tag: result.data.tag,
    price: result.data.price,
    color: result.data.color,
    description: result.data.description,
    ingredients: result.data.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    weight: result.data.weight || undefined,
    featured: result.data.featured,
    translations,
  };
}

function revalidateProductPages() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/products`);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/admin/products`);
  }
}

function getSafeNextPath(next: string, locale: string) {
  return next.startsWith(`/${locale}/admin`) ? next : `/${locale}/admin`;
}

function getAdminProductsPath(
  locale: string,
  params?: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();

  return query
    ? `/${locale}/admin/products?${query}`
    : `/${locale}/admin/products`;
}

function isUniqueSlugError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function loginAdminAction(formData: FormData) {
  const result = adminLoginSchema.safeParse({
    username: getStringValue(formData, "username"),
    password: getStringValue(formData, "password"),
    next: getStringValue(formData, "next"),
  });

  if (!result.success) {
    redirect(`/en/admin/login?error=invalid`);
  }

  const locale = getStringValue(formData, "locale") || "en";

  if (
    result.data.username !== env.ADMIN_USERNAME ||
    result.data.password !== env.ADMIN_PASSWORD
  ) {
    redirect(`/${locale}/admin/login?error=credentials`);
  }

  await setAdminSessionCookie(result.data.username);
  redirect(getSafeNextPath(result.data.next, locale));
}

export async function logoutAdminAction(formData?: FormData) {
  const locale =
    (formData ? getStringValue(formData, "locale") : "") ||
    ((await cookies()).get("NEXT_LOCALE")?.value ?? "en");

  await clearAdminSessionCookie();
  redirect(`/${locale}/admin/login?status=logged-out`);
}

export async function createProductAction(formData: FormData) {
  const locale = getStringValue(formData, "locale");

  try {
    await createProduct(getProductInput(formData));
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect(getAdminProductsPath(locale, { error: "slug-conflict" }));
    }

    throw error;
  }

  revalidateProductPages();

  redirect(getAdminProductsPath(locale, { status: "created" }));
}

export async function updateProductAction(formData: FormData) {
  const locale = getStringValue(formData, "locale");
  const id = Number(getStringValue(formData, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product id");
  }

  try {
    await updateProduct(id, getProductInput(formData));
  } catch (error) {
    if (isUniqueSlugError(error)) {
      redirect(getAdminProductsPath(locale, { error: "slug-conflict" }));
    }

    throw error;
  }

  revalidateProductPages();

  redirect(getAdminProductsPath(locale, { status: "updated" }));
}

export async function deleteProductAction(formData: FormData) {
  const locale = getStringValue(formData, "locale");
  const id = Number(getStringValue(formData, "id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid product id");
  }

  await deleteProduct(id);
  revalidateProductPages();

  redirect(getAdminProductsPath(locale, { status: "deleted" }));
}
