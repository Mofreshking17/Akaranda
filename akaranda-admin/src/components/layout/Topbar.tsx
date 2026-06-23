import { signOut } from "@/app/login/actions";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-lg font-medium text-neutral-900">{title}</h1>
      <form action={signOut}>
        <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          Sign Out
        </button>
      </form>
    </header>
  );
}
