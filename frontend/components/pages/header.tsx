import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CircleUser } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { SidebarCheckout } from "../dashboard/checkout/Sidebar-Checkout";
import { ThemeToggle } from "../theme-toggle";
import StatusCaixaBadge from "../caixa/StatusCaixaBadge";

export const Header = () => {
  return (
    <header className="dashboard-header border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex fle-row">

            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-7" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
            LesAmis
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <StatusCaixaBadge />
            <SidebarCheckout/>
            {/* <ThemeToggle /> */}
          </div>
        </div>
      </div>
    </header>
  );
};
