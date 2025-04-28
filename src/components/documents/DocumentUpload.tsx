
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export const DocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get the current authenticated user
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    getUser();
  }, []);

  const handleUpload = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in to upload documents");
      return;
    }

    try {
      setIsUploading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('legal_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record in the database
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          file_path: filePath,
          type: file.type,
          status: 'pending',
          user_id: user.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success('Document uploaded successfully');

      // Read the file content for analysis
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          try {
            console.log('Calling analyze-document function for document ID:', document.id);
            
            // Call the analyze-document function
            const { error } = await supabase.functions.invoke('analyze-document', {
              body: {
                documentId: document.id,
                documentText: text
              }
            });

            if (error) {
              console.error('Analysis error:', error);
              toast.error('Error analyzing document: ' + error.message);
            } else {
              console.log('Document analysis started successfully');
              toast.success('Document analysis started');
            }
          } catch (error: any) {
            console.error('Analysis error:', error);
            toast.error('Error analyzing document: ' + (error.message || 'Unknown error'));
          }
        }
      };
      reader.readAsText(file);

    } catch (error: any) {
      toast.error(error.message || 'Error uploading document');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 ${
        isDragging
          ? 'border-2 border-dashed border-primary bg-primary/5'
          : 'border-2 border-dashed border-gray-200 bg-gradient-to-b from-white to-gray-50'
      } rounded-lg p-8 text-center shadow-sm hover:shadow-md`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt"
      />
      
      <div className="space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-darkPurple">
            {isDragging ? 'Drop your file here' : 'Upload your document'}
          </p>
          <p className="text-xs text-neutral-gray">
            PDF, DOC, DOCX or TXT (max 10MB)
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading || !user}
            className="relative overflow-hidden"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
