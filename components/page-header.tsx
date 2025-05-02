import type React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, icon, className }: PageHeaderProps) {
  return (
    <div className={cn("text-center space-y-4", className)}>
      {icon && <div className="flex justify-center">{icon}</div>}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>}
    </div>
  )
}
