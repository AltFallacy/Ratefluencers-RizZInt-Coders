import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.ComponentProps<"div"> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

function Skeleton({
  className,
  width,
  height,
  borderRadius,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton rounded-md", className)}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      {...props}
    />
  )
}

export { Skeleton }
