import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex flex-col items-center flex-1 w-full min-h-0 px-4">
      {children}
    </div>
  );
}
