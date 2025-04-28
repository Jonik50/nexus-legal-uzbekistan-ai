
import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Edit } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  risk_level: string | null;
}

interface DocumentTableProps {
  documents: Document[];
  loading: boolean;
}

export const DocumentTable = ({ documents, loading }: DocumentTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskBadge = (risk: string | null) => {
    if (!risk) return null;
    
    switch (risk) {
      case 'high':
        return <Badge variant="destructive">{risk}</Badge>;
      case 'medium':
        return <Badge variant="secondary">{risk}</Badge>;
      case 'low':
        return <Badge variant="outline">{risk}</Badge>;
      default:
        return <Badge>{risk}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
        <p className="text-neutral-gray">No documents uploaded yet.</p>
        <p className="text-sm mt-2">Upload your first document to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
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
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell>{doc.type}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(doc.status)}>
                  {doc.status}
                </Badge>
              </TableCell>
              <TableCell>{getRiskBadge(doc.risk_level)}</TableCell>
              <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 w-8 p-0"
                    disabled={doc.status !== 'analyzed'}
                    title="View Analysis"
                  >
                    <FileText size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    title="Download"
                  >
                    <Download size={16} />
                  </Button>
                  {doc.status !== 'analyzed' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0"
                      title="Analyze Manually"
                    >
                      <Edit size={16} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
