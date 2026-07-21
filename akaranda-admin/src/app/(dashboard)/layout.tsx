import { requireProfile } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-muted/40">
        <Sidebar role={profile.role} fullName={profile.full_name} email={profile.email} />
        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </SidebarProvider>
  );
}
