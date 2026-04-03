export { default } from "./SiteContentStudio";
/*

function PanelInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="uppercase tracking-[0.16em] text-muted">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
      />
    </label>
  );
}
function PanelTextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="uppercase tracking-[0.16em] text-muted">{label}</span>
      <textarea
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
      />
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brown px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-dark disabled:cursor-not-allowed disabled:bg-muted"
    >
      {pending ? "Saving..." : "Save changes"}
    </button>
  );
}

function PreviewOnlyCard({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
      <div className="pointer-events-none">{children}</div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brown/10 bg-white px-5 py-3">
        <span className="rounded-full bg-cream px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-brown">
          {label}
        </span>
        <p className="text-xs text-text/70">{note}</p>
      </div>
    </section>
  );
}

function EditableElement({
  fieldId,
  selectedField,
  onSelect,
  label,
  className = "",
  badgeAlign = "left",
  children,
}: {
  fieldId: EditableFieldId;
  selectedField: EditableFieldId;
  onSelect: (field: EditableFieldId) => void;
  label: string;
  className?: string;
  badgeAlign?: "left" | "right";
  children: ReactNode;
}) {
  const isSelected = selectedField === fieldId;

  return (
    <button
      type="button"
      onClick={() => onSelect(fieldId)}
      className={`group relative rounded-[18px] text-left focus:outline-none ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[-6px] rounded-[22px] border transition-all ${
          isSelected
            ? "border-brown/40 bg-brown/5"
            : "border-transparent group-hover:border-brown/25"
        }`}
      />
      <span
        className={`pointer-events-none absolute -top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-brown shadow-sm transition-opacity ${
          badgeAlign === "right" ? "right-0" : "left-0"
        } ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        {label}
      </span>
      <span className="relative block">{children}</span>
    </button>
  );
}

function AssetPicker({
  title,
  helper,
  assets,
  selectedUrl,
  selectedAlt,
  onSelectAsset,
  onClearSelection,
  onUrlChange,
  onAltChange,
}: {
  title: string;
  helper: string;
  assets: MediaLibraryAsset[];
  selectedUrl?: string;
  selectedAlt?: string;
  onSelectAsset: (asset: MediaLibraryAsset) => void;
  onClearSelection: () => void;
  onUrlChange: (value: string) => void;
  onAltChange: (value: string) => void;
}) {
  const selectedAsset = assets.find((asset) => asset.url === selectedUrl);

  return (
    <div className="rounded-[24px] border border-brown/10 bg-cream/35 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.2em] text-muted">
            {title}
          </p>
          <p className="mt-2 text-sm text-text/75">{helper}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedAsset ? (
            <span className="rounded-full bg-olive/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-olive">
              {selectedAsset.label || "Library asset selected"}
            </span>
          ) : null}
          <button
            type="button"
            onClick={onClearSelection}
            className="rounded-full border border-brown/20 px-3 py-2 text-xs uppercase tracking-[0.14em] text-brown transition-colors hover:bg-brown/5"
          >
            Clear image
          </button>
        </div>
      </div>

      {assets.length > 0 ? (
        <div className="mt-4 grid max-h-[270px] gap-3 overflow-auto pr-1 sm:grid-cols-2">
          {assets.map((asset) => {
            const isSelected = asset.url === selectedUrl;

            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelectAsset(asset)}
                className={`overflow-hidden rounded-[18px] border text-left transition-all ${
                  isSelected
                    ? "border-brown bg-white shadow-sm"
                    : "border-brown/10 bg-white hover:border-brown/25"
                }`}
              >
                <img
                  src={asset.url}
                  alt={asset.altText || asset.label || "Media asset"}
                  className="aspect-video w-full object-cover"
                />
                <div className="space-y-2 p-3">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-dark">
                    {asset.label || "Untitled asset"}
                  </p>
                  <p className="text-xs text-text/70">
                    {asset.altText || asset.url}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 rounded-[18px] border border-dashed border-brown/20 bg-white px-4 py-5 text-sm text-text/70">
          Your library is empty right now. You can still paste a direct image URL below.
        </div>
      )}

      <div className="mt-4 grid gap-4">
        <PanelInput
          label="Image URL"
          type="url"
          value={selectedUrl}
          onChange={onUrlChange}
          placeholder="https://..."
        />
        <PanelInput
          label="Alt text"
          value={selectedAlt}
          onChange={onAltChange}
          placeholder="Describe the image for accessibility"
        />
      </div>
    </div>
  );
}

function EditorPreviewNavbar({
  locale,
  dictionary,
  draft,
  selectedField,
  onSelectField,
}: {
  locale: Locale;
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  const navLinks = [
    dictionary.navbar.links.products,
    dictionary.navbar.links.about,
    dictionary.navbar.links.contact,
  ];

  return (
    <nav className="flex items-center justify-between gap-4 border-b border-brown/[0.15] bg-cream px-[2.5rem] py-[1.2rem]">
      <EditableElement
        fieldId={draft.logoMode === "image" ? "logoImage" : "logoText"}
        selectedField={selectedField}
        onSelect={onSelectField}
        label={draft.logoMode === "image" ? "Logo image" : "Logo text"}
        className="max-w-[240px]"
      >
        {draft.logoMode === "image" && draft.logoImageUrl ? (
          <img
            src={draft.logoImageUrl}
            alt={draft.logoAltText || draft.brandName}
            className="h-10 w-auto object-contain"
          />
        ) : (
          <span className="font-serif text-[22px] font-medium tracking-[2px] text-brown">
            {draft.logoText || "Ventolivo"}
          </span>
        )}
      </EditableElement>

      <div className="flex items-center gap-[1.3rem]">
        {navLinks.map((label) => (
          <span
            key={label}
            className="text-[12px] uppercase tracking-[1.5px] text-muted"
          >
            {label}
          </span>
        ))}
        <span className="rounded-full border border-brown/15 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-brown">
          {locale.toUpperCase()}
        </span>
      </div>

      <EditableElement
        fieldId="navbarCtaLabel"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="Header CTA"
        className="shrink-0"
        badgeAlign="right"
      >
        <span className="inline-flex bg-brown px-[1.4rem] py-[0.6rem] text-[12px] tracking-[1px] text-white">
          {draft.navbarCtaLabel || dictionary.navbar.cta}
        </span>
      </EditableElement>
    </nav>
  );
}

function EditorPreviewHero({
  dictionary,
  draft,
  selectedField,
  onSelectField,
}: {
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  const subtitle = draft.heroSubtitle || dictionary.hero.subtitle;
  const badgeValue = draft.heroBadgeValue || dictionary.hero.badge.value;
  const badgeLabel = draft.heroBadgeLabel || dictionary.hero.badge.label;

  return (
    <section className="grid min-h-[480px] grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center bg-warm px-[3rem] py-[4rem]">
        <EditableElement
          fieldId="heroSubtitle"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="Hero subtitle"
          className="mb-[1.2rem] w-fit"
        >
          <span className="text-[11px] uppercase tracking-[2px] text-olive">
            {subtitle}
          </span>
        </EditableElement>

        <h1 className="mb-[1.5rem] font-serif text-[52px] leading-[1.1] text-dark">
          <EditableElement
            fieldId="heroTitleLine1"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Hero line 1"
            className="mb-1 w-fit"
          >
            <span>{draft.heroTitleLine1 || dictionary.hero.title.line1}</span>
          </EditableElement>
          <EditableElement
            fieldId="heroTitleLine2"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Hero line 2"
            className="mb-1 w-fit"
          >
            <em className="italic text-brown">
              {draft.heroTitleLine2 || dictionary.hero.title.line2}
            </em>
          </EditableElement>
          <EditableElement
            fieldId="heroTitleLine3"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Hero line 3"
            className="w-fit"
          >
            <span>{draft.heroTitleLine3 || dictionary.hero.title.line3}</span>
          </EditableElement>
        </h1>

        <EditableElement
          fieldId="heroDescription"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="Hero description"
          className="mb-[2rem] max-w-[360px]"
        >
          <p className="text-[14px] leading-[1.8] text-muted">
            {draft.heroDescription || dictionary.hero.description}
          </p>
        </EditableElement>

        <div className="flex items-center gap-[1rem]">
          <span className="bg-brown px-[2rem] py-[0.8rem] text-[13px] tracking-[1px] text-white">
            {dictionary.hero.shopNow}
          </span>
          <span className="border border-brown px-[2rem] py-[0.8rem] text-[13px] tracking-[1px] text-brown">
            {dictionary.hero.ourStory}
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden bg-[#D4C5B2]">
        <EditableElement
          fieldId="heroImage"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="Hero image"
          className="block h-full w-full"
        >
          {draft.heroImageUrl ? (
            <img
              src={draft.heroImageUrl}
              alt={draft.heroImageAlt || draft.brandName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="relative flex h-full min-h-[320px] items-center justify-center">
              <div className="relative" style={{ width: 200, height: 120 }}>
                <div
                  className="absolute h-[70px] w-[70px] rounded-[2px] bg-brown/[0.7]"
                  style={{ top: -20, left: 0, transform: "rotate(-8deg)" }}
                />
                <div
                  className="absolute h-[70px] w-[70px] rounded-[2px] bg-[#8B7355]"
                  style={{ top: 25, left: 50 }}
                />
                <div
                  className="absolute h-[70px] w-[70px] rounded-[2px] bg-[#C5B49A]"
                  style={{ top: -5, left: 100, transform: "rotate(5deg)" }}
                />
              </div>
            </div>
          )}
        </EditableElement>

        <div className="absolute bottom-[2rem] right-[2rem] bg-cream px-[1.2rem] py-[0.8rem] text-center">
          <EditableElement
            fieldId="heroBadgeValue"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Badge value"
            className="w-full"
            badgeAlign="right"
          >
            <div className="font-serif text-[28px] text-brown">{badgeValue}</div>
          </EditableElement>
          <EditableElement
            fieldId="heroBadgeLabel"
            selectedField={selectedField}
            onSelect={onSelectField}
            label="Badge label"
            className="mt-1 w-full"
            badgeAlign="right"
          >
            <div className="text-[10px] uppercase tracking-[1px] text-muted">
              {badgeLabel}
            </div>
          </EditableElement>
        </div>
      </div>
    </section>
  );
}

function EditorPreviewCTA({
  dictionary,
  draft,
  selectedField,
  onSelectField,
}: {
  dictionary: Dictionary;
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  return (
    <section className="mt-[3rem] bg-dark px-[2.5rem] py-[4rem] text-center">
      <h2 className="mb-[1rem] font-serif text-[42px] leading-[1.2] text-cream">
        <EditableElement
          fieldId="ctaTitleLine1"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="CTA line 1"
          className="mx-auto mb-1 w-fit"
        >
          <span>{draft.ctaTitleLine1 || dictionary.cta.title.line1}</span>
        </EditableElement>
        <EditableElement
          fieldId="ctaTitleLine2"
          selectedField={selectedField}
          onSelect={onSelectField}
          label="CTA line 2"
          className="mx-auto w-fit"
        >
          <em className="italic text-[#C5B49A]">
            {draft.ctaTitleLine2 || dictionary.cta.title.line2}
          </em>
        </EditableElement>
      </h2>

      <EditableElement
        fieldId="ctaDescription"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="CTA description"
        className="mx-auto mb-[2rem] max-w-[420px]"
      >
        <p className="text-[13px] tracking-[1px] text-white/[0.5]">
          {draft.ctaDescription || dictionary.cta.description}
        </p>
      </EditableElement>

      <EditableElement
        fieldId="ctaButtonLabel"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="CTA button"
        className="mx-auto w-fit"
      >
        <span className="inline-flex items-center gap-[10px] bg-[#25D366] px-[2.2rem] py-[0.9rem] text-[13px] tracking-[1px] text-white">
          {draft.ctaButtonLabel || dictionary.cta.button}
        </span>
      </EditableElement>
    </section>
  );
}

function EditorPreviewFooter({
  draft,
  selectedField,
  onSelectField,
}: {
  draft: SiteContentSettings;
  selectedField: EditableFieldId;
  onSelectField: (field: EditableFieldId) => void;
}) {
  const brandName = draft.brandName || siteConfig.name;

  return (
    <footer className="flex items-center justify-between gap-6 border-t border-brown/[0.15] bg-white px-[2.5rem] py-[2rem]">
      <EditableElement
        fieldId="brandName"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="Brand name"
        className="w-fit"
      >
        <span className="font-serif text-[18px] text-brown">{brandName}</span>
      </EditableElement>

      <EditableElement
        fieldId="footerCopyrightText"
        selectedField={selectedField}
        onSelect={onSelectField}
        label="Footer copyright"
        className="max-w-[440px]"
      >
        <p className="text-[12px] text-muted">
          &copy; {new Date().getFullYear()} {brandName}.{" "}
          {draft.footerCopyrightText}
        </p>
      </EditableElement>

      <nav className="flex gap-[1rem]">
        {socialLinks.map((link) => (
          <span
            key={link.label}
            className="text-[11px] uppercase tracking-[1px] text-muted"
          >
            {link.label}
          </span>
        ))}
      </nav>
    </footer>
  );
}

export default function SiteContentForm({
  locale,
  action,
  settings,
  dictionary,
  mediaLibrary,
  featuredProducts,
}: SiteContentFormProps) {
  const [selectedField, setSelectedField] =
    useState<EditableFieldId>("heroTitleLine1");
  const [draft, setDraft] = useState<SiteContentSettings>(settings);
  const selectedMeta = editableFields[selectedField];
  const relatedFields = Object.values(editableFields).filter(
    (field) =>
      field.section === selectedMeta.section && field.id !== selectedField,
  );
  const imageAssets = mediaLibrary.filter((asset) => asset.kind === "image");

  function updateField<Key extends keyof SiteContentSettings>(
    key: Key,
    value: SiteContentSettings[Key],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  }

  function renderFieldEditor() {
    switch (selectedField) {
      case "brandName":
        return (
          <PanelInput
            label="Brand name"
            value={draft.brandName}
            onChange={(value) => updateField("brandName", value)}
          />
        );
      case "logoText":
        return (
          <div className="grid gap-5">
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">
                Logo mode
              </span>
              <select
                value={draft.logoMode}
                onChange={(event) =>
                  updateField(
                    "logoMode",
                    event.target.value === "image" ? "image" : "text",
                  )
                }
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              >
                <option value="text">Text logo</option>
                <option value="image">Image logo</option>
              </select>
            </label>
            <PanelInput
              label="Logo text"
              value={draft.logoText}
              onChange={(value) => updateField("logoText", value)}
            />
          </div>
        );
      case "logoImage":
        return (
          <div className="grid gap-5">
            <label className="flex flex-col gap-2 text-sm">
              <span className="uppercase tracking-[0.16em] text-muted">
                Logo mode
              </span>
              <select
                value={draft.logoMode}
                onChange={(event) =>
                  updateField(
                    "logoMode",
                    event.target.value === "image" ? "image" : "text",
                  )
                }
                className="border border-brown/20 bg-white px-4 py-3 outline-none transition-colors focus:border-brown"
              >
                <option value="text">Text logo</option>
                <option value="image">Image logo</option>
              </select>
            </label>
            <AssetPicker
              title="Logo image"
              helper="Pick an image from the shared library or paste a direct URL."
              assets={imageAssets}
              selectedUrl={draft.logoImageUrl}
              selectedAlt={draft.logoAltText}
              onSelectAsset={(asset) => {
                updateField("logoImageUrl", asset.url);
                updateField(
                  "logoAltText",
                  asset.altText || draft.brandName || draft.logoAltText || "",
                );
              }}
              onClearSelection={() => {
                updateField("logoImageUrl", "");
                updateField("logoAltText", "");
              }}
              onUrlChange={(value) => updateField("logoImageUrl", value)}
              onAltChange={(value) => updateField("logoAltText", value)}
            />
          </div>
        );
      case "navbarCtaLabel":
        return (
          <PanelInput
            label="Header CTA label"
            value={draft.navbarCtaLabel}
            onChange={(value) => updateField("navbarCtaLabel", value)}
          />
        );
      case "heroSubtitle":
        return (
          <PanelInput
            label="Hero subtitle"
            value={draft.heroSubtitle}
            onChange={(value) => updateField("heroSubtitle", value)}
          />
        );
      case "heroTitleLine1":
        return (
          <PanelInput
            label="Hero title line 1"
            value={draft.heroTitleLine1}
            onChange={(value) => updateField("heroTitleLine1", value)}
          />
        );
      case "heroTitleLine2":
        return (
          <PanelInput
            label="Hero title line 2"
            value={draft.heroTitleLine2}
            onChange={(value) => updateField("heroTitleLine2", value)}
          />
        );
      case "heroTitleLine3":
        return (
          <PanelInput
            label="Hero title line 3"
            value={draft.heroTitleLine3}
            onChange={(value) => updateField("heroTitleLine3", value)}
          />
        );
      case "heroDescription":
        return (
          <PanelTextArea
            label="Hero description"
            value={draft.heroDescription}
            onChange={(value) => updateField("heroDescription", value)}
          />
        );
      case "heroBadgeValue":
        return (
          <PanelInput
            label="Hero badge value"
            value={draft.heroBadgeValue}
            onChange={(value) => updateField("heroBadgeValue", value)}
          />
        );
      case "heroBadgeLabel":
        return (
          <PanelInput
            label="Hero badge label"
            value={draft.heroBadgeLabel}
            onChange={(value) => updateField("heroBadgeLabel", value)}
          />
        );
      case "heroImage":
        return (
          <AssetPicker
            title="Hero image"
            helper="Replace the main hero image directly from the preview."
            assets={imageAssets}
            selectedUrl={draft.heroImageUrl}
            selectedAlt={draft.heroImageAlt}
            onSelectAsset={(asset) => {
              updateField("heroImageUrl", asset.url);
              updateField(
                "heroImageAlt",
                asset.altText || draft.brandName || draft.heroImageAlt || "",
              );
            }}
            onClearSelection={() => {
              updateField("heroImageUrl", "");
              updateField("heroImageAlt", "");
            }}
            onUrlChange={(value) => updateField("heroImageUrl", value)}
            onAltChange={(value) => updateField("heroImageAlt", value)}
          />
        );
      case "ctaTitleLine1":
        return (
          <PanelInput
            label="CTA title line 1"
            value={draft.ctaTitleLine1}
            onChange={(value) => updateField("ctaTitleLine1", value)}
          />
        );
      case "ctaTitleLine2":
        return (
          <PanelInput
            label="CTA title line 2"
            value={draft.ctaTitleLine2}
            onChange={(value) => updateField("ctaTitleLine2", value)}
          />
        );
      case "ctaDescription":
        return (
          <PanelTextArea
            label="CTA description"
            value={draft.ctaDescription}
            onChange={(value) => updateField("ctaDescription", value)}
          />
        );
      case "ctaButtonLabel":
        return (
          <PanelInput
            label="CTA button label"
            value={draft.ctaButtonLabel}
            onChange={(value) => updateField("ctaButtonLabel", value)}
          />
        );
      case "footerCopyrightText":
        return (
          <PanelInput
            label="Footer copyright text"
            value={draft.footerCopyrightText}
            onChange={(value) => updateField("footerCopyrightText", value)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <form
      action={action}
      className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_430px]"
    >
      <input type="hidden" name="locale" value={locale} />
      {(
        Object.entries(draft) as Array<
          [keyof SiteContentSettings, SiteContentSettings[keyof SiteContentSettings]]
        >
      ).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value ?? ""} />
      ))}

      <section className="rounded-[32px] border border-brown/15 bg-white/80 p-5 shadow-sm backdrop-blur xl:sticky xl:top-8 xl:self-start">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
              Live preview
            </p>
            <h2 className="mt-2 font-serif text-3xl text-dark">
              Click the exact thing you want to edit
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text/75">
              Hover the preview and click the exact text, button, or image you
              want to change. The right panel will jump straight to that field.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/media`}
            className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
          >
            Open full library
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-brown/10 bg-[#f5ede2]">
          <div className="flex items-center gap-2 border-b border-brown/10 bg-[#efe1ce] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#d96b5f]" />
            <span className="h-3 w-3 rounded-full bg-[#d9a65f]" />
            <span className="h-3 w-3 rounded-full bg-[#84b36a]" />
            <span className="ml-3 text-xs uppercase tracking-[0.18em] text-brown/80">
              Ventolivo storefront preview
            </span>
          </div>

          <div className="max-h-[calc(100vh-260px)] overflow-auto bg-[#fbf7f1] p-4">
            <div className="mx-auto flex max-w-[940px] flex-col gap-4">
              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <EditorPreviewNavbar
                  locale={locale}
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <EditorPreviewHero
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>

              <PreviewOnlyCard
                label="Preview only"
                note="Supporting sections stay visible for context, but this phase focuses on exact-click editing for the header, hero, CTA, and footer."
              >
                <>
                  <div className="pointer-events-none">
                    <StripBanner dict={dictionary} />
                  </div>
                  <div className="pointer-events-none">
                    <FeaturedProducts
                      products={featuredProducts}
                      title={dictionary.featuredProducts.title}
                      viewAllLabel={dictionary.featuredProducts.viewAll}
                      orderLabel={dictionary.products.card.orderVia}
                      locale={locale}
                    />
                  </div>
                  <div className="pointer-events-none">
                    <AboutSection dict={dictionary} />
                  </div>
                  <div className="pointer-events-none">
                    <FeaturesGrid dict={dictionary} />
                  </div>
                </>
              </PreviewOnlyCard>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <EditorPreviewCTA
                  dictionary={dictionary}
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>

              <section className="overflow-hidden rounded-[30px] border border-brown/10 bg-white shadow-sm">
                <EditorPreviewFooter
                  draft={draft}
                  selectedField={selectedField}
                  onSelectField={setSelectedField}
                />
              </section>
            </div>
          </div>
        </div>
      </section>

      <aside className="flex flex-col gap-6">
        <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
                Focused field
              </p>
              <h2 className="mt-2 font-serif text-3xl text-dark">
                {selectedMeta.title}
              </h2>
              <p className="mt-2 text-sm text-text/75">
                {selectedMeta.description}
              </p>
            </div>
            <SubmitButton />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              Area: {sectionLabels[selectedMeta.section]}
            </span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              Locale: {locale}
            </span>
          </div>

          {relatedFields.length > 0 ? (
            <div className="mt-6">
              <p className="text-[12px] uppercase tracking-[0.18em] text-muted">
                Nearby items
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedFields.map((field) => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setSelectedField(field.id)}
                    className="rounded-full border border-brown/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown transition-colors hover:bg-brown/5"
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
          {renderFieldEditor()}
        </section>

        <section className="rounded-[32px] border border-brown/15 bg-white p-6 shadow-sm">
          <p className="text-[12px] uppercase tracking-[0.24em] text-muted">
            Workflow
          </p>
          <h3 className="mt-2 font-serif text-2xl text-dark">
            The preview is now field-aware
          </h3>
          <p className="mt-3 text-sm text-text/75">
            Instead of selecting a whole section first, the editor now follows
            the user&apos;s click. The library still stays reusable in the
            backend, but the editing flow is now much closer to what people
            expect from visual CMS tools.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              {imageAssets.length} reusable images
            </span>
            <span className="rounded-full bg-cream px-4 py-2 text-xs uppercase tracking-[0.16em] text-brown">
              Exact-click editing enabled
            </span>
          </div>
        </section>
      </aside>
    </form>
  );
}
*/
