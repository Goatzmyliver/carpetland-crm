"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MainNav() {
  return (
    <nav className="hidden flex-1 md:flex">
      <Button variant="ghost" asChild>
        <Link href="/">Dashboard</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/customers">Customers</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/quotes">Quotes</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/jobs">Jobs</Link>
      </Button>
    </nav>
  );
}