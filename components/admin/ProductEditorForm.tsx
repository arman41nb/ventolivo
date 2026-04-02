import ProductTranslationAssistant from "@/components/admin/ProductTranslationAssistant";
import type { Dictionary } from "@/i18n/types";
import {
  localeLabels,
  locales,
  type Locale,
} from "@/i18n/config";
import type { Product } from "@/types";

interface ProductEditorFormProps {
  locale: Locale;
  dictionary: Dictionary;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  product?: Product;
  disabled?: boolean;
}

export default function ProductEditorForm({
  locale,
  dictionary,
  submitLabel,
  action,
  product,
  disabled = false,
}: ProductEditorFormProps) {
  return (
    <form action={action} className="rounded-[28px] border border-brown/15 bg-white p-8 shadow-sm">
      <input type="hidden" name="locale" value={locale} />
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.name}
          </span>
          <input
            name="name"
            defaultValue={product?.name ?? ""}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.slug}
          </span>
          <input
            name="slug"
            defaultValue={product?.slug ?? ""}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.tag}
          </span>
          <input
            name="tag"
            defaultValue={product?.tag ?? ""}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.price}
          </span>
          <input
            name="price"
            type="number"
            min="0"
            defaultValue={product?.price ?? 0}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.color}
          </span>
          <input
            name="color"
            defaultValue={product?.color ?? "#7C8C5E"}
            required
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.16em] text-muted">
            {dictionary.admin.form.weight}
          </span>
          <input
            name="weight"
            defaultValue={product?.weight ?? ""}
            className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
          />
        </label>
      </div>
      <label className="mt-4 flex flex-col gap-2 text-sm">
        <span className="uppercase tracking-[0.16em] text-muted">
          {dictionary.admin.form.ingredients}
        </span>
        <input
          name="ingredients"
          defaultValue={product?.ingredients?.join(", ") ?? ""}
          placeholder={dictionary.admin.form.ingredientsPlaceholder}
          className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
        />
      </label>
      <label className="mt-4 flex flex-col gap-2 text-sm">
        <span className="uppercase tracking-[0.16em] text-muted">
          {dictionary.admin.form.description}
        </span>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          required
          rows={4}
          className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
        />
      </label>

      <div className="mt-6 rounded-[24px] border border-brown/10 bg-cream/30 p-5">
        <div className="flex flex-col gap-4">
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
            {dictionary.admin.inventory.translationsTitle}
          </p>
          <ProductTranslationAssistant
            currentLocale={locale}
            locales={locales}
            localeLabels={localeLabels}
            dictionary={dictionary.admin.translationAssistant}
          />
        </div>
        <div className="mt-4 grid gap-5">
          {locales.map((translationLocale) => (
            <div
              key={translationLocale}
              className="rounded-[20px] border border-brown/10 bg-white p-4"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-brown">
                {localeLabels[translationLocale]}
              </p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-muted">{dictionary.admin.form.name}</span>
                  <input
                    name={`translations.name.${translationLocale}`}
                    defaultValue={product?.translations?.name?.[translationLocale] ?? ""}
                    className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-muted">{dictionary.admin.form.tag}</span>
                  <input
                    name={`translations.tag.${translationLocale}`}
                    defaultValue={product?.translations?.tag?.[translationLocale] ?? ""}
                    className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                  />
                </label>
              </div>
              <label className="mt-4 flex flex-col gap-2 text-sm">
                <span className="text-muted">{dictionary.admin.form.description}</span>
                <textarea
                  name={`translations.description.${translationLocale}`}
                  defaultValue={
                    product?.translations?.description?.[translationLocale] ?? ""
                  }
                  rows={3}
                  className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <label className="mt-4 inline-flex items-center gap-3 text-sm text-dark">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={product?.featured ?? false}
          className="h-4 w-4 accent-brown"
        />
        {dictionary.admin.form.featured}
      </label>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={disabled}
          className="rounded-full bg-olive px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-muted"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
