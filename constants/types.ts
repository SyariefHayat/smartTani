export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface Article {
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
}

export interface Milestone {
  year: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}
