import { Leaf } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-lg bg-primary flex items-center justify-center`}>
          <Leaf
            className={`${size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"} text-primary-foreground`}
          />
        </div>
        <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-sm -z-10" />
      </div>
      {showText && (
        <span className={`${textClasses[size]} font-bold text-foreground`}>
          Carbon<span className="text-primary">Credit</span>
        </span>
      )}
    </div>
  )
}
