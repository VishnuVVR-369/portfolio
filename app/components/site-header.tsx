import Link from "next/link";
import { GuardianBadge } from "./guardian-badge";
import { ResumeButton } from "./resume-button";
import { HeaderBreadcrumb } from "./header-breadcrumb";
import { HeaderNav } from "./header-nav";
import { HeaderActions } from "./header-actions";

const logoMaskStyle = {
  WebkitMaskImage: "url(/logo.svg)",
  maskImage: "url(/logo.svg)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  maskSize: "contain",
} as const;

export function SiteHeader() {
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color:rgba(10,10,11,0.82)] backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-[76rem] items-center justify-between gap-3 px-5 font-mono text-[12px] text-[var(--color-text-muted)] md:h-14 md:px-6">
        <div className="flex min-w-0 items-center gap-3 overflow-hidden">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
            aria-label="Home"
          >
            <span
              aria-hidden
              className="block h-7 w-[56px] flex-shrink-0 bg-[var(--color-accent)] transition-opacity group-hover:opacity-85"
              style={logoMaskStyle}
            />
            <span className="hidden sm:inline">~/vvr.dev</span>
          </Link>
          <HeaderBreadcrumb />
        </div>

        <HeaderNav />

        <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
          <div className="hidden md:inline-flex">
            <GuardianBadge variant="compact" />
          </div>
          <div className="hidden lg:inline-flex">
            <ResumeButton size="sm" />
          </div>
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
