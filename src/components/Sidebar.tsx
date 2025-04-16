
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BrainCircuit, Home, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    title: "Create Quiz",
    path: "/create",
    icon: Plus,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <SidebarContainer className="hidden md:block">
      <SidebarContent className="pt-8">
        <div className="flex items-center gap-3 px-4 pb-6">
          <BrainCircuit className="h-7 w-7 text-quiz-primary" />
          <span className="font-bold text-xl">Quiz Whiz</span>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path} 
                        className={cn(
                          "flex gap-3 items-center px-4 py-2.5 rounded-md w-full",
                          isActive ? "bg-quiz-light text-quiz-primary font-medium" : "hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
