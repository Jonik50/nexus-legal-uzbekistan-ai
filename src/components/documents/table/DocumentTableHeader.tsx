
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

export const DocumentTableHeader = () => {
  return (
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
  );
};
