import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Trash, Eye, Clock, AlertTriangle, Check, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentPreview } from "./DocumentPreview";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { Document } from "./types";

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
        .createSignedUrl(document.file_path, 3600); // 1 hour expiry

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
      // Delete from storage
      const { error: storageError } = await supabase
        .storage
        .from('documents')
        .remove([selectedDoc.file_path]);

      if (storageError) throw storageError;

      // Delete from database
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'analyzed':
        return {
          color: 'bg-green-500',
          icon: Check,
          tooltip: 'Analysis complete'
        };
      case 'pending':
        return {
          color: 'bg-yellow-500',
          icon: Clock,
          tooltip: 'Analysis in progress'
        };
      default:
        return {
          color: 'bg-gray-500',
          icon: AlertTriangle,
          tooltip: 'Status unknown'
        };
    }
  };

  const getRiskBadge = (risk: string | null) => {
    if (!risk) return null;
    
    const configs: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", tooltip: string }> = {
      high: {
        variant: 'destructive',
        tooltip: 'High risk - immediate attention required'
      },
      medium: {
        variant: 'secondary',
        tooltip: 'Medium risk - review recommended'
      },
      low: {
        variant: 'outline',
        tooltip: 'Low risk - standard review'
      }
    };
    
    const config = configs[risk] || {
      variant: 'outline' as const,
      tooltip: 'Risk level undefined'
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={config.variant}>{risk}</Badge>
          </TooltipTrigger>
          <TooltipContent>{config.tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {[...Array(2)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-8" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/50 p-12 text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-darkPurple mb-2">No documents uploaded</h3>
        <p className="text-sm text-neutral-coolGray mb-6 max-w-sm">
          Upload your first document to start analyzing your legal documents with AI
        </p>
        <Button variant="default" className="font-medium">
          Upload Document
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const statusConfig = getStatusConfig(doc.status);
              
              return (
                <TableRow 
                  key={doc.id} 
                  className="group transition-colors hover:bg-neutral-softGray/50"
                >
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell className="text-neutral-coolGray">{doc.type}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge 
                            className={`inline-flex items-center gap-1 ${statusConfig.color} transition-colors`}
                          >
                            <statusConfig.icon className="h-3 w-3" />
                            {doc.status}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>{statusConfig.tooltip}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{getRiskBadge(doc.risk_level)}</TableCell>
                  <TableCell className="text-neutral-coolGray">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-80 transition-opacity group-hover:opacity-100">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="default"
                              className="h-8 w-8 p-0 bg-primary/90 hover:bg-primary"
                              disabled={doc.status !== 'analyzed'}
                              onClick={() => {
                                setSelectedDoc(doc);
                                setIsPreviewOpen(true);
                                handlePreview(doc);
                              }}
                            >
                              <Eye size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Preview Document</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedDoc(doc);
                                setIsDeleteOpen(true);
                              }}
                            >
                              <Trash size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Document</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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
