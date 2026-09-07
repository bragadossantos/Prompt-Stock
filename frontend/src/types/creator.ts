import { Prompt } from "./prompt";

export interface CreatorProfile {
  id: number;
  user_id: number;
  username: string;
  headline: string | null;
  bio: string | null;
  portfolio_url: string | null;
  multicaixa_phone: string | null;
  iban: string | null;
  total_sales: number;
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
}

export interface CreatorDashboardMetrics {
  total_prompts: number;
  published_prompts: number;
  pending_prompts: number;
  draft_prompts: number;
  rejected_prompts: number;
  total_views: number;
  total_copies: number;
  total_favorites: number;
  total_sales: number;
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
  currency: string;
}

export interface CreatorWithdrawal {
  id: number;
  amount: number;
  currency: string;
  payment_method: "multicaixa_express" | "bank_transfer";
  account_details: string;
  status: "pending" | "approved" | "rejected" | "completed";
  admin_notes: string | null;
  reference: string | null;
  requested_at: string;
  processed_at: string | null;
}

export interface CreatorDashboardData {
  profile: CreatorProfile | null;
  metrics: CreatorDashboardMetrics;
  recent_prompts: Prompt[];
  recent_withdrawals: CreatorWithdrawal[];
}

export interface PublicCreator {
  username: string;
  name: string;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  total_sales: number;
  prompts_count?: number;
  joined_at?: string;
}
