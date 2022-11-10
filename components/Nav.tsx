import Link from "next/link";
import React from "react";

function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex justify-between py-4 text-primary">{children}</nav>
  );
}

export function NavItem({
  href,
  as = undefined,
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
