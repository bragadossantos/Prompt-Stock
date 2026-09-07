export interface PromptResult {
  id: number;
  result_text: string | null;
  result_image_url: string | null;
  ai_tool: string | null;
  ai_model: string | null;
  notes: string | null;
}

export interface PromptTag {
  id: number;
  name: string;
  slug: string;
}

export interface PromptMetrics {
  view_count: number;
  copy_count: number;
  usage_count: number;
  favorite_count: number;
  average_rating: number;
  reviews_count: number;
}

export interface PromptUserInteractions {
  is_favorited: boolean;
  is_saved: boolean;
  is_purchased?: boolean;
}

export interface Prompt {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  prompt_preview: string;
  prompt_content: string | null;
  is_locked: boolean;
  source_type: "official" | "creator";
  prompt_type: "free" | "premium" | "package" | "subscription";
  ai_tool: string;
  ai_model: string | null;
  price: number;
  currency: string;
  status: string;
  is_featured: boolean;
  cover_image_url: string | null;
  metrics: PromptMetrics;
  user_interactions: PromptUserInteractions;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  sub_category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  author: {
    name: string;
    role: string;
    avatar_url: string | null;
  };
  results: PromptResult[];
  tags: PromptTag[];
  published_at: string | null;
  created_at: string;
}

export interface PromptsResponse {
  success: boolean;
  data: Prompt[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
