interface InfoCardProps {
  title: string
  text: string
}

export function InfoCard({ title, text }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  )
}
