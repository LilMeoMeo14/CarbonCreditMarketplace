"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
    title: string
    description?: string
}

export function Header({ title, description }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="flex items-center justify-between h-16 px-6">
                <div>
                    <h1 className="text-xl font-semibold">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
