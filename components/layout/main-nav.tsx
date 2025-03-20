"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package, LayoutDashboard, Users, ClipboardList, Calendar, Package2, Settings } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  
  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/customers",
      label: "Customers",
      icon: Users,
    },
    {
      href: "/quotes",
      label: "Quotes",
      icon: ClipboardList,
    },
    {
      href: "/jobs",
      label: "Jobs",
      icon: Calendar,
    },
    {
      href: "/inventory",
      label: "Inventory",
      icon: Package2,
    },
  ];

  return (
    <nav className="hidden flex-1 md:flex">
      {navItems.map((item) => (
        <Button 
          key={item.href}
          variant={pathname === item.href ? "default" : "ghost"} 
          asChild
        >
          <Link href={item.href} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}