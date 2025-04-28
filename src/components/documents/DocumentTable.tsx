
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentPreview } from "./DocumentPreview";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { Document } from "./types";
import { DocumentTableHeader } from "./table/DocumentTableHeader";
import { EmptyDocumentState } from "./table/EmptyDocumentState";
import { DocumentRow } from "./table/DocumentRow";

interface DocumentTableProps {
  documents: Document[];
  loading: boolean;
}

export const DocumentTable = ({ documents, loading }: DocumentTableProps) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handlePreview = async (document: Document) => {
    try {
      setSelectedDoc(document);
      setIsPreviewOpen(true);
      
      const { data: { signedUrl }, error } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600);

      if (error) throw error;
      setPreviewUrl(signedUrl);
    } catch (error: any) {
      toast.error("Error loading document preview");
      console.error("Preview error:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;

    try {
      const { error: storageError } = await supabase
        .storage
        .from('documents')
        .remove([selectedDoc.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', selectedDoc.id);

      if (dbError) throw dbError;

      toast.success("Document deleted successfully");
      setIsDeleteOpen(false);
      setSelectedDoc(null);
    } catch (error: any) {
      toast.error("Error deleting document");
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <DocumentTableHeader />
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <DocumentRow
                key={index}
                document={{
                  id: `skeleton-${index}`,
                  name: <Skeleton className="h-4 w-[250px]" />,
                  type: <Skeleton className="h-4 w-[100px]" />,
                  status: <Skeleton className="h-6 w-[120px]" />,
                  risk_level: <Skeleton className="h-6 w-[80px]" />,
                  created_at: <Skeleton className="h-4 w-[100px]" />,
                  file_path: '',
                  updated_at: '',
                  user_id: ''
                }}
                onPreview={() => {}}
                onDelete={() => {}}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (documents.length === 0) {
    return <EmptyDocumentState />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <DocumentTableHeader />
          <TableBody>
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                onPreview={handlePreview}
                onDelete={() => {
                  setSelectedDoc(doc);
                  setIsDeleteOpen(true);
                }}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedDoc && (
        <>
          <DocumentPreview
            isOpen={isPreviewOpen}
            onClose={() => {
              setIsPreviewOpen(false);
              setSelectedDoc(null);
              setPreviewUrl(null);
            }}
            documentUrl={previewUrl ?? undefined}
            documentName={selectedDoc.name}
          />

          <DeleteConfirmation
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedDoc(null);
            }}
            onConfirm={handleDelete}
            documentName={selectedDoc.name}
          />
        </>
      )}
    </>
  );
};
