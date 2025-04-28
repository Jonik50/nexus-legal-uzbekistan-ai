
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
}

export const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching documents');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardHeader>
            <CardTitle className="text-lg">{doc.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Type: {doc.type}</p>
            <p className="text-sm text-gray-500">
              Status: <span className="capitalize">{doc.status}</span>
            </p>
            <p className="text-sm text-gray-500">
              Uploaded: {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
      {documents.length === 0 && (
        <p className="col-span-full text-center text-gray-500">
          No documents uploaded yet.
        </p>
      )}
    </div>
  );
};
