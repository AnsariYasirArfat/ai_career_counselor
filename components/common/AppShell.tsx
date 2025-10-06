'use client';
import Sidebar from "@/components/Dashboard/Sidebar";
import Header from "@/components/Dashboard/Header";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return <>{children}</>;
  }


  return (
    <div className="flex h-[100svh]">
      <div className="hidden lg:block  h-[100svh]">
        <Sidebar />
      </div>
      <main className="flex-1 flex flex-col dark:bg-[#0e0e0f] h-[100svh] min-h-0">
        <Header />
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
