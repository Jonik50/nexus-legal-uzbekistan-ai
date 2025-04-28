
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyDocumentState = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/50 p-12 text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <Upload className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-darkPurple mb-2">
        No documents uploaded
      </h3>
      <p className="text-sm text-neutral-coolGray mb-6 max-w-sm">
        Upload your first document to start analyzing your legal documents with AI
      </p>
      <Button variant="default" className="font-medium">
        Upload Document
      </Button>
    </div>
  );
};
