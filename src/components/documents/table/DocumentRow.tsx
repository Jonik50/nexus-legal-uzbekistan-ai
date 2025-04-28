
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Document } from "../types";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { DocumentRiskBadge } from "./DocumentRiskBadge";
import { DocumentActions } from "./DocumentActions";

interface DocumentRowProps {
  document: Document;
  onPreview: (document: Document) => void;
  onDelete: (document: Document) => void;
}

export const DocumentRow = ({ document, onPreview, onDelete }: DocumentRowProps) => {
  // Format created_at date safely, handling ReactNode possibilities
  const formatDate = (dateValue: string | React.ReactNode): string => {
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toLocaleDateString();
    }
    return 'Invalid date';
  };

  return (
    <TableRow className="group transition-colors hover:bg-neutral-softGray/50">
      <TableCell className="font-medium">{document.name}</TableCell>
      <TableCell className="text-neutral-coolGray">{document.type}</TableCell>
      <TableCell>
        <DocumentStatusBadge status={typeof document.status === 'string' ? document.status : 'unknown'} />
      </TableCell>
      <TableCell>
        <DocumentRiskBadge risk={typeof document.risk_level === 'string' ? document.risk_level : null} />
      </TableCell>
      <TableCell className="text-neutral-coolGray">
        {formatDate(document.created_at)}
      </TableCell>
      <TableCell className="text-right">
        <DocumentActions
          document={document}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};
