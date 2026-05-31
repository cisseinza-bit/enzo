export default function ScreenHeader({ title, subtitle, right }) {
  return (
    <header className="flex items-end justify-between px-5 pt-[max(env(safe-area-inset-top),20px)] pb-3">
      <div>
        {subtitle && <p className="text-xs font-semibold uppercase tracking-wide text-muted">{subtitle}</p>}
        <h1 className="text-2xl font-extrabold leading-tight">{title}</h1>
      </div>
      {right}
    </header>
  )
}
