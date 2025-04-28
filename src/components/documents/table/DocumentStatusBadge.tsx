
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentStatusBadgeProps {
  status: string;
}

export const DocumentStatusBadge = ({ status }: DocumentStatusBadgeProps) => {
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

  const statusConfig = getStatusConfig(status);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className={`inline-flex items-center gap-1 ${statusConfig.color} transition-colors`}
          >
            <statusConfig.icon className="h-3 w-3" />
            {status}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>{statusConfig.tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
