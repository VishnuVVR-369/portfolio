export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-sm text-foreground-subtle">
          © 2026 Vishnuvardhan Reddy
        </p>
        <div className="flex gap-6">
          <a
            href="https://github.com/VishnuVVR-369"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/vishnu-vvr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href="mailto:vishnuvardhanganji@gmail.com"
            className="text-sm text-foreground-subtle transition-colors hover:text-foreground"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
