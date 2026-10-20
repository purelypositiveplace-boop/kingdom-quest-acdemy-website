import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Tone = "royal" | "sun" | "emerald" | "coral" | "lavender" | "white" | "sky";

const TONES: Record<Tone, string> = {
  royal: "bg-royal text-white",
  sun: "bg-sun text-ink",
  emerald: "bg-emerald text-white",
  coral: "bg-coral text-white",
  lavender: "bg-lavender text-ink",
  sky: "bg-sky text-ink",
  white: "bg-white text-royal-dark border-2 border-royal-soft",
};

const SIZES = { md: "", lg: "text-xl px-8 min-h-[3.75rem]", xl: "text-2xl px-10 min-h-[4.5rem]" };

interface Common {
  tone?: Tone;
  size?: keyof typeof SIZES;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonProps = Common & { href?: string } & Omit<ComponentProps<"button">, "children">;

/** Big glossy primary action. Renders a link when `href` is given. */
export function PrimaryButton({ tone = "sun", size = "md", icon, className = "", children, href, ...rest }: ButtonProps) {
  const cls = `btn-toy ${TONES[tone]} ${SIZES[size]} ${className}`;
  if (href)
    return (
      <Link href={href} className={cls} {...(rest as Record<string, unknown>)}>
        {icon}
        {children}
      </Link>
    );
  return (
    <button type="button" className={cls} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export function SecondaryButton(props: ButtonProps) {
  return <PrimaryButton tone="white" {...props} />;
}

/** Round icon-only button with a required accessible label. */
export function IconButton({ label, children, className = "", ...rest }: { label: string; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`tap-target inline-flex items-center justify-center rounded-full bg-white text-royal-dark shadow-md transition hover:scale-105 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
