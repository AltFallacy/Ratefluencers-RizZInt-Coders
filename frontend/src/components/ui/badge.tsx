import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--accent)] text-white",
        secondary:
          "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
        destructive:
          "border-transparent bg-[var(--danger)] text-white",
        outline: "border-[var(--border-default)] text-[var(--text-primary)]",
        success:
          "bg-[var(--success-subtle)] text-[var(--success)] border-[var(--success)]/10",
        warning:
          "bg-[var(--warning-subtle)] text-[var(--warning)] border-[var(--warning)]/10",
        danger:
          "bg-[var(--danger-subtle)] text-[var(--danger)] border-[var(--danger)]/10",
        violet:
          "bg-[var(--accent-subtle)] text-[var(--accent-light)] border-[var(--accent)]/10",
        sky:
          "bg-[var(--info-subtle)] text-[var(--info)] border-[var(--info)]/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
