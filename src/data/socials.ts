import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface SocialLink {
  href: string;
  label: string;
  /** The icon component itself, so this stays a plain .ts data module. */
  icon: LucideIcon;
}

export const socialLinks: SocialLink[] = [
  {
    href: "https://github.com/Pheonix2507",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://instagram.com/chintu.003",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://linkedin.com/in/chintub2",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "mailto:chintub2507@gmail.com",
    label: "Email",
    icon: Mail,
  },
];
