import { Category } from "@/generated/prisma/enums";
import {
  CodeXml,
  Computer,
  BrainCircuit,
  UserSearch,
  ChartNoAxesCombined,
  Megaphone,
  Video,
  Music,
  Handshake,
  Headset,
} from "lucide-react";

export const categories = [
  {
    name: Category.DEVELOPMENT,
    label: "Development",
    icon: CodeXml,
  },
  {
    name: Category.UI_UX_DESIGN,
    label: "UI / UX Design",
    icon: Computer,
  },
  {
    name: Category.AI_SERVICES,
    label: "AI Services",
    icon: BrainCircuit,
  },
  {
    name: Category.HUMAN_RESEARCH,
    label: "Human Research",
    icon: UserSearch,
  },
  {
    name: Category.BUSINESS_ANALYSIS,
    label: "Business Analysis",
    icon: ChartNoAxesCombined,
  },
  {
    name: Category.DIGITAL_MARKETING,
    label: "Digital Marketing",
    icon: Megaphone,
  },
  {
    name: Category.VIDEO_AND_ANIMATION,
    label: "Video & Animation",
    icon: Video,
  },
  {
    name: Category.MUSIC_AND_AUDIO,
    label: "Music & Audio",
    icon: Music,
  },
  {
    name: Category.CONSULTING,
    label: "Consulting",
    icon: Handshake,
  },
  {
    name: Category.CUSTOMER_SUPPORT,
    label: "Customer Support",
    icon: Headset,
  },
];
