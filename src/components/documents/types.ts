
export interface Document {
  id: string;
  name: string | React.ReactNode;
  type: string | React.ReactNode;
  status: string | React.ReactNode;
  created_at: string | React.ReactNode;
  updated_at: string;
  risk_level: string | React.ReactNode | null;
  file_path: string;
  user_id: string;
}
