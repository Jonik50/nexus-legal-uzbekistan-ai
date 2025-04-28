
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  risk_level: string | null;
}

export const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('document_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setDocuments(current =>
              current.map(doc =>
                doc.id === (payload.new as Document).id ? { ...doc, ...(payload.new as Document) } : doc
              )
            );
          } else if (payload.eventType === 'INSERT') {
            setDocuments(current => [...current, payload.new as Document]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
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
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">Status:</span>
              <Badge className={getStatusColor(doc.status)}>
                {doc.status}
              </Badge>
            </div>
            {doc.risk_level && (
              <div className="mt-2">
                <span className="text-sm text-gray-500">Risk Level: </span>
                <Badge variant={doc.risk_level === 'high' ? 'destructive' : 'secondary'}>
                  {doc.risk_level}
                </Badge>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
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
