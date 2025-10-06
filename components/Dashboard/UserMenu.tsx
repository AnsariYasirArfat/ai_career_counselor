"use client";
import { UserCircle2, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthed = !!session?.user;

  if (isLoading) {
    return <Skeleton className="h-7 w-7 rounded-full " />;
  }
  if (!isAuthed) {
    return (
      <Link className="ml-2" href={"/auth/signin"}>
        <Button className="bg-oration-orange hover:bg-oration-orange/90">
          Sign in
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 focus:outline-none"
          aria-label="User menu"
        >
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session?.user?.name || session?.user?.email || "User"}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <UserCircle2 className="w-7 h-7" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border rounded shadow-lg"
      >
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium truncate">
            {session?.user?.name || "User"}
          </p>
          {session?.user?.email && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {session?.user?.email}
            </p>
          )}
        </div>

        <DropdownMenuItem
          className="flex items-center px-4 py-2 text-sm hover:bg-red-400/30 hover:dark:bg-red-400/10 cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
