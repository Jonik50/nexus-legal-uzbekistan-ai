
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl?: string;
  documentContent?: string | null;
  documentName: string | React.ReactNode;
  documentType: string;
}

export const DocumentPreview = ({ 
  isOpen, 
  onClose, 
  documentUrl, 
  documentContent, 
  documentName,
  documentType 
}: DocumentPreviewProps) => {
  const isTextFile = documentType === 'text/plain' || 
                     documentType === 'application/txt' || 
                     (documentUrl && documentUrl.endsWith('.txt'));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {typeof documentName === 'string' ? documentName : 'Document Preview'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full w-full rounded-md border">
          {documentContent && isTextFile ? (
            <div className="p-6 font-mono text-sm whitespace-pre-wrap">
              {documentContent}
            </div>
          ) : documentUrl ? (
            <iframe
              src={documentUrl}
              className="w-full h-full min-h-[60vh]"
              title={`Preview of ${typeof documentName === 'string' ? documentName : 'document'}`}
            />
          ) : (
            <div className="p-4">
              <Skeleton className="w-full h-[60vh]" />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
