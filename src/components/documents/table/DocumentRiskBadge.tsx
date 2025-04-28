
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentRiskBadgeProps {
  risk: string | null;
}

export const DocumentRiskBadge = ({ risk }: DocumentRiskBadgeProps) => {
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
