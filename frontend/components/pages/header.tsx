import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

import { ThemeToggle } from "../theme-toggle";


export const Header = () => {
  return (
    <header className="sticky top-0 flex h-14 items-center gap-4  border-b bg-background/95 backdrop-blur px-4  sm:px-6 z-50">
      <div className="flex items-center justify-between w-full"> 
        <div className="flex items-center space-x-4">
          <div className="flex flex-row"> 
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            LesAmis
          </h1>
        </div>

        <div className="flex items-center space-x-4">
        <ThemeToggle/>
          <Badge
            variant="outline"
            className="status-badge bg-green-50 text-green-600 border-green-200"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-subtle"></span>
            CAIXA ABERTO
          </Badge>
        
        </div>
      </div>
    </header>
  );
}
