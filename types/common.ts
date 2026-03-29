export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface SEOData {
  title: string;
  description: string;
  path: string;
  image?: string;
}
