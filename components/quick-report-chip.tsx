import Link from "next/link"
import type { ReactNode } from "react"

interface QuickReportChipProps {
  icon: ReactNode
  label: string
  href: string
  description?: string
}

export default function QuickReportChip({ icon, label, href, description }: QuickReportChipProps) {
  return (
    <Link href={href}>
      <div className="flex items-center p-4 bg-white dark:bg-gray-900 rounded-lg border shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] min-h-[80px] min-w-[48px] group">
        <div className="mr-3 p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800/30 transition-colors">
          {icon}
        </div>
        <div>
          <span className="font-medium">{label}</span>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
    </Link>
  )
}

