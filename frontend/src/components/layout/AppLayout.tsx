import Link from "next/link";

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
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <p className="text-sm text-slate-500">CRM Workspace</p>
              <h2 className="text-lg font-semibold text-slate-900">
                Real Estate Sales Management
              </h2>
            </div>
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}