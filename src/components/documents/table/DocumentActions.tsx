
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Document } from "../types";

interface DocumentActionsProps {
  document: Document;
  onPreview: (document: Document) => void;
  onDelete: (document: Document) => void;
}

export const DocumentActions = ({ document, onPreview, onDelete }: DocumentActionsProps) => {
  return (
    <div className="flex justify-end gap-2 opacity-80 transition-opacity group-hover:opacity-100">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="default"
              className="h-8 w-8 p-0 bg-primary/90 hover:bg-primary"
              disabled={document.status !== 'analyzed'}
              onClick={() => onPreview(document)}
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
              onClick={() => onDelete(document)}
            >
              <Trash size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Document</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
