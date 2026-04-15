export function Footer() {
  return (
    <footer className="border-t border-border px-4 sm:px-8 py-8 mt-4 bg-surface">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-xs">
          Data as of April 2026 · Corp dev research · Built by Value Add VC
        </p>
        <div className="flex items-center gap-5 text-xs">
          <a
            href="https://x.com/Trace_Cohen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-[var(--accent)] transition-colors font-medium"
          >
            Twitter
          </a>
          <a
            href="mailto:t@nyvp.com"
            className="text-slate-500 hover:text-[var(--accent)] transition-colors font-medium"
          >
            t@nyvp.com
          </a>
        </div>
      </div>
    </footer>
  )
}
