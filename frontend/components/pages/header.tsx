import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

import { ThemeToggle } from "../theme-toggle";
import StatusCaixaBadge from "../caixa/StatusCaixaBadge";


export const Header = () => {
  return (
    <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
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
          <StatusCaixaBadge/>
        </div>
      </div>
    </header>
  );
}
