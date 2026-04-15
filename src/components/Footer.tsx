export function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-slate-200 text-center">
      <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
        <a
          href="https://x.com/Trace_Cohen"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-900 transition-colors"
        >
          @Trace_Cohen
        </a>
        <span className="text-slate-300">&middot;</span>
        <a
          href="mailto:t@nyvp.com"
          className="hover:text-slate-900 transition-colors"
        >
          t@nyvp.com
        </a>
      </div>
    </footer>
  )
}
