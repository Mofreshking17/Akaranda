import { requireProfile } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <Sidebar role={profile.role} fullName={profile.full_name} email={profile.email} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
