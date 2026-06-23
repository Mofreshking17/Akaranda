import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-500">{label}</p>
          <p className="text-2xl font-semibold text-neutral-900 mt-1">{value}</p>
          {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
        </div>
        <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-neutral-600" />
        </div>
      </div>
    </div>
  );
}
