import { signOut } from "@/app/login/actions";
import ThemeToggle from "./ThemeToggle";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-30 flex items-center justify-between px-6">
      <h1 className="font-display text-xl text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <form action={signOut}>
          <button type="submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
