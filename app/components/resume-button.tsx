import { RESUME_URL } from "@/lib/identity";

interface ResumeButtonProps {
  variant?: "accent" | "ghost";
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

// Accent-styled CTA for the resume PDF. The single highest-priority
// link for audience A (recruiter skimmers) so it lives in the header
// AND repeats in hero/about contact strip — same component, two homes.
export function ResumeButton({
  variant = "accent",
  size = "sm",
  label = "resume",
  className = "",
}: ResumeButtonProps) {
  const cls = variant === "accent" ? "cta-accent" : "cta-ghost";
  const sizing = size === "sm" ? "" : "min-h-[44px] px-5 text-[13px]";
  return (
    <a
      href={RESUME_URL}
      target="_blank"
      rel="noreferrer"
      className={`${cls} ${sizing} ${className}`.trim()}
      title="Download resume (PDF)"
    >
      <span>{label}</span>
      <span aria-hidden className="text-[0.85em] opacity-75">
        pdf
      </span>
      <svg
        aria-hidden
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        className="-mr-0.5 ml-0.5 opacity-80"
      >
        <path
          d="M2 8L8 2M8 2H3.5M8 2V6.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </a>
  );
}
