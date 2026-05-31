export default function ScreenHeader({ title, subtitle, right }) {
  return (
    <header className="flex items-end justify-between px-5 pt-[max(env(safe-area-inset-top),24px)] pb-4">
      <div>
        {subtitle && (
          <p className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{subtitle}</p>
        )}
        <h1 className="font-display text-[34px] font-extrabold leading-[0.95] tracking-tightest">{title}</h1>
      </div>
      {right}
    </header>
  )
}
