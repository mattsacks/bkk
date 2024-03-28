import Link from "next/link";
import React from "react";

function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="flex justify-between py-4 text-primary">{children}</nav>
  );
}

export function NavItem({ href, text }: { href: string; text: string }) {
  return <Link href={href}>{text}</Link>;
}

export default Nav;
