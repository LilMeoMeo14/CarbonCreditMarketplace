"use client"

interface HeaderProps {
  title: string
  description?: string
}

export function BuyerHeader({ title, description }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
    </header>
  )
}
