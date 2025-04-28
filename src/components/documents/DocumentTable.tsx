
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
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handlePreview = async (document: Document) => {
    try {
      setSelectedDoc(document);
      setIsPreviewOpen(true);
      
      // Get the file URL for preview
      const { data: { signedUrl }, error } = await supabase
        .storage
        .from('legal_documents')
        .createSignedUrl(document.file_path, 3600);

      if (error) throw error;
      setPreviewUrl(signedUrl);

      // For text files, fetch the content for preview
      if (document.type === 'text/plain' || 
          document.type === 'application/txt' ||
          document.file_path.endsWith('.txt')) {
        const { data, error: downloadError } = await supabase
          .storage
          .from('legal_documents')
          .download(document.file_path);
        
        if (downloadError) throw downloadError;
        
        const text = await data.text();
        setPreviewContent(text);
      }
    } catch (error: any) {
      toast.error("Error loading document preview");
      console.error("Preview error:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedDoc) return;

    try {
      // Delete the file from storage
      const { error: storageError } = await supabase
        .storage
        .from('legal_documents')
        .remove([selectedDoc.file_path]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
        // Continue with database deletion even if storage deletion fails
      }

      // Delete the document record from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', selectedDoc.id);

      if (dbError) throw dbError;

      toast.success("Document deleted successfully");
      setIsDeleteOpen(false);
      setSelectedDoc(null);
    } catch (error: any) {
      toast.error("Error deleting document: " + error.message);
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
              <tr key={`skeleton-row-${index}`} className="border-b transition-colors hover:bg-neutral-softGray/50">
                <td className="p-4 font-medium">
                  <Skeleton className="h-4 w-[250px]" />
                </td>
                <td className="p-4 text-neutral-coolGray">
                  <Skeleton className="h-4 w-[100px]" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-6 w-[120px]" />
                </td>
                <td className="p-4">
                  <Skeleton className="h-6 w-[80px]" />
                </td>
                <td className="p-4 text-neutral-coolGray">
                  <Skeleton className="h-4 w-[100px]" />
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </td>
              </tr>
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
              setPreviewContent(null);
            }}
            documentUrl={previewUrl ?? undefined}
            documentContent={previewContent}
            documentName={selectedDoc.name as string}
            documentType={typeof selectedDoc.type === 'string' ? selectedDoc.type : 'unknown'}
          />

          <DeleteConfirmation
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedDoc(null);
            }}
            onConfirm={handleDelete}
            documentName={selectedDoc.name as string}
          />
        </>
      )}
    </>
  );
};
