export type UserRole = "guest" | "user" | "creator" | "admin";

export interface User {
  uuid: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended" | "pending";
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
  errors?: Record<string, string[]>;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
}
