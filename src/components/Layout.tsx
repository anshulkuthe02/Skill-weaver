import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

import { useState } from "react";
import { Menu } from "lucide-react";

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {showSidebar && <AppSidebar />}
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1">
            <div
              className="fixed top-4 left-4 z-50 cursor-pointer bg-white/80 rounded-full p-2 shadow-lg hover:bg-accent/80 transition"
              onClick={() => setShowSidebar((v) => !v)}
              style={{ width: 40, height: 40, display: showSidebar ? "none" : "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Menu className="h-6 w-6 text-accent" />
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;