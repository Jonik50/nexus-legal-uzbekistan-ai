
export interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  risk_level: string | null;
  file_path: string;
  user_id: string;
}
