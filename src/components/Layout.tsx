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
      <div className="min-h-screen flex flex-col md:flex-row w-full">
        {/* Sidebar: hidden on mobile, shown on md+ */}
        <div className="hidden md:block">
          {showSidebar && <AppSidebar />}
        </div>
        <main className="flex-1 flex flex-col">
          <Header onMenuClick={() => setShowSidebar((v) => !v)} />
          <div className="flex-1">
            {/* Hamburger for mobile */}
            <div
              className="md:hidden fixed top-4 left-4 z-50 cursor-pointer bg-white/80 rounded-full p-2 shadow-lg hover:bg-accent/80 transition flex items-center justify-center"
              onClick={() => setShowSidebar((v) => !v)}
              style={{ width: 40, height: 40, display: showSidebar ? "none" : "flex" }}
            >
              <Menu className="h-6 w-6 text-accent" />
            </div>
            {/* Mobile sidebar overlay */}
            {showSidebar && (
              <div className="fixed inset-0 z-50 bg-black/60 md:hidden" onClick={() => setShowSidebar(false)}>
                <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
                  <AppSidebar />
                </div>
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;