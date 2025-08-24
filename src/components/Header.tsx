import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User, Bell } from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 border-b border-border/50 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button className="md:hidden p-2 rounded-full bg-white/80 shadow hover:bg-accent/80 transition" onClick={onMenuClick}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <SidebarTrigger className="hidden md:inline-flex" />
        <h1 className="text-lg font-semibold">Portfolio Builder</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}