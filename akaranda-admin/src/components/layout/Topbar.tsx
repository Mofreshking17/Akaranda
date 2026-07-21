import { signOut } from "@/app/login/actions";
import ThemeToggle from "./ThemeToggle";
import MobileMenuButton from "./MobileMenuButton";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-30 flex items-center justify-between gap-2 px-3 md:px-6">
      <div className="flex items-center gap-1.5 min-w-0">
        <MobileMenuButton />
        <h1 className="font-display text-lg md:text-xl text-foreground truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <ThemeToggle />
        <form action={signOut}>
          <button type="submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
