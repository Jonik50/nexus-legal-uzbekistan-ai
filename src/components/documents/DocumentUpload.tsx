
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

      // Read the file content
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          try {
            // Call the analyze-document function
            const { error } = await supabase.functions.invoke('analyze-document', {
              body: {
                documentId: document.id,
                documentText: text
              }
            });

            if (error) throw error;
            toast.success('Document uploaded and analysis started');
          } catch (error: any) {
            console.error('Analysis error:', error);
            toast.error('Error analyzing document');
          }
        }
      };
      reader.readAsText(file);

    } catch (error: any) {
      toast.error(error.message || 'Error uploading document');
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
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}
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
        accept=".pdf,.doc,.docx"
      />
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          {isDragging ? 'Drop your file here' : 'Drag and drop your file here, or'}
        </p>
        <Button
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={isUploading || !user}
        >
          {isUploading ? 'Uploading...' : 'Choose File'}
        </Button>
      </div>
    </div>
  );
};
