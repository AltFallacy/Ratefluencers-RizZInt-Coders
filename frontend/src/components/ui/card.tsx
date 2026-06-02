import * as React from "react"
import { cn } from "@/lib/utils"

export type CardVariant = "default" | "elevated" | "glass" | "accent" | "flat";

interface CardProps extends React.ComponentProps<"div"> {
  variant?: CardVariant;
}

function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      className={cn(
        "group/card flex flex-col gap-4 rounded-2xl transition-all duration-200 outline-none",
        // Variant styling
        variant === "default" && "bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 hover:border-[var(--border-default)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
        variant === "elevated" && "bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-[var(--shadow-sm)] p-6 hover:shadow-[var(--shadow-lg)] hover:-translate-y-1",
        variant === "glass" && "bg-[var(--bg-glass)] backdrop-blur-md border border-[var(--border-subtle)] p-6 shadow-[var(--shadow-md)]",
        variant === "accent" && "bg-gradient-to-br from-[var(--accent-subtle)] to-transparent border border-[var(--accent-glow)] p-6 shadow-[var(--shadow-sm)]",
        variant === "flat" && "bg-[var(--bg-elevated)] border-none rounded-xl p-4",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h3
      data-slot="card-title"
      className={cn(
        "font-sans text-lg font-semibold tracking-tight text-[var(--text-primary)]",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-xs text-[var(--text-muted)]", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("text-[var(--text-secondary)] text-sm", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center pt-4 border-t border-[var(--border-subtle)]",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
