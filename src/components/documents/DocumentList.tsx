
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentTable } from "./DocumentTable";
import { Document } from "./types";

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

  return <DocumentTable documents={documents} loading={loading} />;
};
