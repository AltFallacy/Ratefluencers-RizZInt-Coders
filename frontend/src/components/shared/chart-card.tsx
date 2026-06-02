import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  children,
  className,
  action,
}: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-900 p-5",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-zinc-100">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}
