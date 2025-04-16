
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 pt-8 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
