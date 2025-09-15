"use client";
import { UserCircle2, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 focus:outline-none"
          aria-label="User menu"
        >
          <UserCircle2 className="w-7 h-7" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40  border rounded shadow-lg"
      >
        <DropdownMenuItem className="flex items-center px-4 py-2 text-sm hover:bg-red-400/30 hover:dark:bg-red-400/10 cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
