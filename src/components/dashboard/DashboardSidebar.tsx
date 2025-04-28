
import { 
  FileText, 
  FileArchive, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    { icon: FileText, label: "Documents", active: true, href: "/dashboard" },
    { icon: FileArchive, label: "Templates", href: "/templates" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
  ];

  return (
    <div className={cn(
      "bg-neutral-softGray border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-lg font-bold text-neutral-darkPurple">Legal Nexus</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-3 rounded-md transition-colors",
                item.active 
                  ? "bg-primary text-white" 
                  : "text-neutral-darkPurple hover:bg-gray-200",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
