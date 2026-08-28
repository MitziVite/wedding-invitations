import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "light";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

const VARIANT_CLASS: Record<Variant, string> = {
  solid: "border-sage bg-sage text-espresso hover:bg-sage/90",
  outline: "border-espresso/50 text-espresso hover:bg-espresso/5",
  light: "border-blush bg-blush text-espresso hover:bg-blush/90",
};

/** A consistent, accessible link styled as a button (map links, registry, etc.). */
export function LinkButton({ href, children, variant = "outline", className = "" }: LinkButtonProps) {
  const external = href !== "#" && !href.startsWith("#");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`inline-flex items-center justify-center rounded-sm border px-6 py-3 font-body text-sm tracking-wide uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${VARIANT_CLASS[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
