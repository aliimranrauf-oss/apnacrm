export type CustomerSource = "WhatsApp" | "Instagram" | "Other";

export type CustomerStatus =
  | "New Lead"
  | "Interested"
  | "Ordered"
  | "Completed"
  | "Lost";

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  source: CustomerSource;
  status: CustomerStatus;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  newLeads: number;
  followUpsToday: number;
  completed: number;
}
