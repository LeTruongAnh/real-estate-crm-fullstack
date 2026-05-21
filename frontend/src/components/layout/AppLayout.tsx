"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { clearAuthSession, getAuthToken } from "@/lib/api";

type AppLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Leads",
    href: "/leads",
  },
  {
    label: "Tasks",
    href: "/tasks",
  },
];

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
      router.replace("/login");
      return;
    }

    setIsAuthenticated(true);
    setIsCheckingAuth(false);
  }, [router]);

  function handleLogout() {
    clearAuthSession();
    router.replace("/login");
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-medium text-slate-700">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r border-slate-200 bg-white px-4 py-6 md:block">
          <div className="mb-8">
            <p className="text-sm font-semibold text-slate-500">
              Real Estate CRM
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-900">
              Sales Console
            </h1>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${pathname.startsWith(item.href)
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <p className="text-sm text-slate-500">CRM Workspace</p>
              <h2 className="text-lg font-semibold text-slate-900">
                Real Estate Sales Management
              </h2>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}