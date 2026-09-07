import React from "react";
import {
  Palette,
  Code2,
  Target,
  Zap,
  TrendingUp,
  PenTool,
  BarChart3,
  GraduationCap,
  Layout,
  Video,
  Headphones,
  DollarSign,
  LifeBuoy,
  Share2,
  Scale,
  Layers,
  Sparkles,
  LucideIcon,
} from "lucide-react";

interface CategoryIconProps {
  nameOrSlug: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showContainer?: boolean;
}

const CATEGORY_MAP: Record<
  string,
  { icon: LucideIcon; color: string; bg: string; border: string }
> = {
  "image-generation": {
    icon: Palette,
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
    border: "border-accent-cyan/20",
  },
  "image generation": {
    icon: Palette,
    color: "text-accent-cyan",
    bg: "bg-accent-cyan/10",
    border: "border-accent-cyan/20",
  },
  programming: {
    icon: Code2,
    color: "text-accent-emerald",
    bg: "bg-accent-emerald/10",
    border: "border-accent-emerald/20",
  },
  marketing: {
    icon: Target,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  "office-productivity": {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  "office & productivity": {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  business: {
    icon: TrendingUp,
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20",
  },
  writing: {
    icon: PenTool,
    color: "text-accent-violet",
    bg: "bg-accent-violet/10",
    border: "border-accent-violet/20",
  },
  "data-analysis": {
    icon: BarChart3,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  "data analysis": {
    icon: BarChart3,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  education: {
    icon: GraduationCap,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  design: {
    icon: Layout,
    color: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
  },
  video: {
    icon: Video,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  audio: {
    icon: Headphones,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  sales: {
    icon: DollarSign,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
  },
  support: {
    icon: LifeBuoy,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  "social-media": {
    icon: Share2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  "social media": {
    icon: Share2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  legal: {
    icon: Scale,
    color: "text-amber-300",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
};

const DEFAULT_CONFIG = {
  icon: Layers,
  color: "text-brand-400",
  bg: "bg-brand-500/10",
  border: "border-brand-500/20",
};

export function CategoryIcon({
  nameOrSlug,
  size = "md",
  className = "",
  showContainer = false,
}: CategoryIconProps) {
  const normalizedKey = (nameOrSlug || "").toLowerCase().trim();
  const config = CATEGORY_MAP[normalizedKey] || DEFAULT_CONFIG;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const containerSizes = {
    sm: "w-7 h-7 p-1.5 rounded-lg",
    md: "w-10 h-10 p-2.5 rounded-xl",
    lg: "w-12 h-12 p-3 rounded-2xl",
    xl: "w-16 h-16 p-4 rounded-2xl",
  };

  if (!showContainer) {
    return <IconComponent className={`${sizeClasses[size]} ${config.color} ${className}`} />;
  }

  return (
    <div
      className={`inline-flex items-center justify-center border transition-all ${containerSizes[size]} ${config.bg} ${config.border} ${className}`}
    >
      <IconComponent className={`${sizeClasses[size]} ${config.color}`} />
    </div>
  );
}
