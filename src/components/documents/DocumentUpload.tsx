
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          file_path: filePath,
          type: file.type,
          status: 'pending',
        });

      if (dbError) throw dbError;

      toast.success('Document uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error uploading document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx"
      />
      <Button
        onClick={() => document.getElementById('file-upload')?.click()}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </div>
  );
};
