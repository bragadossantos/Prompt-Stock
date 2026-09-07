import { Prompt } from "./prompt";

export type OrderStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "multicaixa_express" | "bank_transfer" | "test_gateway";

export interface OrderItem {
  id: number;
  order_id: number;
  prompt_id: number;
  creator_id: number | null;
  price: number;
  currency: string;
  creator_earnings: number;
  platform_fee: number;
  prompt?: Prompt;
}

export interface Order {
  id: number;
  uuid: string;
  order_number: string;
  user_id: number;
  subtotal: number;
  tax: number;
  discount: number;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_phone: string | null;
  payment_reference: string | null;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface PaymentInstructions {
  type: PaymentMethod;
  title: string;
  message: string;
  phone?: string;
  iban?: string;
  bank_name?: string;
  beneficiary?: string;
  reference?: string;
  amount: number;
  currency: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    order: {
      order_number: string;
      uuid: string;
      total_amount: number;
      currency: string;
      status: OrderStatus;
      payment_method: PaymentMethod;
      payment_reference: string;
      prompt: {
        id: number;
        title: string;
        slug: string;
        ai_tool: string;
      };
    };
    payment_instructions: PaymentInstructions;
  };
}
