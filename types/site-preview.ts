import type { CSSProperties, ReactNode } from "react";

export type EditableFieldId =
  | "brandName"
  | "logoText"
  | "logoImage"
  | "navbarLinkProducts"
  | "navbarLinkAbout"
  | "navbarLinkContact"
  | "navbarCtaLabel"
  | "heroSubtitle"
  | "heroTitleLine1"
  | "heroTitleLine2"
  | "heroTitleLine3"
  | "heroDescription"
  | "heroPrimaryButtonLabel"
  | "heroSecondaryButtonLabel"
  | "heroBadgeValue"
  | "heroBadgeLabel"
  | "heroImage"
  | "heroAccentImage"
  | "storyEyebrow"
  | "storyTitle"
  | "storyLead"
  | "storyBody"
  | "storyClosing"
  | "storyRitualLabel"
  | "storyMomentsLabel"
  | "storyMomentsValue"
  | "storyDetailLabel"
  | "storyDetailText"
  | "storyStudyLabel"
  | "storyStudyText"
  | "stripBannerItem1"
  | "stripBannerItem2"
  | "stripBannerItem3"
  | "stripBannerItem4"
  | "featuredProductsTitle"
  | "featuredProductsViewAllLabel"
  | "aboutSubtitle"
  | "aboutTitleLine1"
  | "aboutTitleLine2"
  | "aboutDescription"
  | "aboutButtonLabel"
  | "aboutImage"
  | "feature1Title"
  | "feature1Text"
  | "feature2Title"
  | "feature2Text"
  | "feature3Title"
  | "feature3Text"
  | "ctaTitleLine1"
  | "ctaTitleLine2"
  | "ctaDescription"
  | "ctaButtonLabel"
  | "footerCopyrightText";

export interface StorefrontPreviewRenderInput {
  fieldId: EditableFieldId;
  label: string;
  children: ReactNode;
  className?: string;
  badgeAlign?: "left" | "right";
  contentClassName?: string;
  style?: CSSProperties;
}

export interface StorefrontPreviewBindings {
  renderEditable: (input: StorefrontPreviewRenderInput) => ReactNode;
}
