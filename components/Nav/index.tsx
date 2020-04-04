import React from "react";
import Link from "next/link";

function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex justify-between py-4 text-primary">{children}</nav>
  );
}

export function NavItem({
  href,
  as = null,
  text
}: {
  href: string;
  as?: string;
  text: string;
}) {
  return (
    <Link href={href} as={as}>
      <a className="underline">{text}</a>
    </Link>
  );
}

export default Nav;
