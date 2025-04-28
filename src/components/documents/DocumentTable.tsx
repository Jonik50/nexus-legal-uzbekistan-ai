
import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Edit, Check, Clock, AlertTriangle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
        <div className="flex items-center gap-2 text-neutral-gray">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          Loading documents...
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <p className="text-neutral-gray">No documents uploaded yet</p>
        <p className="text-sm text-neutral-coolGray">Upload your first document to get started</p>
      </div>
    );
  }

  return (
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
              <TableRow key={doc.id} className="group">
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={`inline-flex items-center gap-1 ${statusConfig.color}`}>
                          <statusConfig.icon className="h-3 w-3" />
                          {doc.status}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>{statusConfig.tooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{getRiskBadge(doc.risk_level)}</TableCell>
                <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-80 transition-opacity group-hover:opacity-100">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="default"
                            className="h-8 w-8 p-0"
                            disabled={doc.status !== 'analyzed'}
                          >
                            <FileText size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Analysis</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                          >
                            <Download size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download Document</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {doc.status !== 'analyzed' && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                            >
                              <Edit size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Analyze Manually</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
