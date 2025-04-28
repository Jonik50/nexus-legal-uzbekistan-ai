
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
  return (
    <TableRow className="group transition-colors hover:bg-neutral-softGray/50">
      <TableCell className="font-medium">{document.name}</TableCell>
      <TableCell className="text-neutral-coolGray">{document.type}</TableCell>
      <TableCell>
        <DocumentStatusBadge status={document.status} />
      </TableCell>
      <TableCell>
        <DocumentRiskBadge risk={document.risk_level} />
      </TableCell>
      <TableCell className="text-neutral-coolGray">
        {new Date(document.created_at).toLocaleDateString()}
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
