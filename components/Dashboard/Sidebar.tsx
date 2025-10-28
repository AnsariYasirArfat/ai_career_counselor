"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/ModeToggle";
import { cn } from "@/lib/utils";
import { Menu, SquarePen, Search } from "lucide-react";
import Link from "next/link";
import ChatRoomList from "./ChatRoomList";
import { useSession } from "next-auth/react";
import ChatRoomListSkeleton from "./ChatRoomListSkeleton";
import NewChatButton from "../common/NewChatButton";

interface SidebarProps {
  closeDrawer?: () => void;
  isDrawer?: boolean;
}

export default function Sidebar({ closeDrawer, isDrawer }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const isAuthLoading = status === "loading";
  const isAuthed = !!session?.user;

  const handleNav = (cb?: () => void) => {
    if (cb) cb();
    if (isDrawer && closeDrawer) closeDrawer();
  };

  return (
    <aside
      className={cn(
        "flex flex-col gap-2 sm:gap-4 py-4 h-[100svh] bg-[#f0f4f9] dark:bg-[#282a2c] transition-all ease-in-out duration-500",
        collapsed ? "w-14" : "w-72"
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center px-2 transition-all ease-in-out duration-500",
          collapsed ? "justify-center flex-col gap-4" : "justify-between"
        )}
      >
        <Button
          variant="ghost"
          title="Toggle Sidebar"
          size="icon"
          onClick={() => handleNav(() => setCollapsed((c) => !c))}
          className={`flex justify-center items-center hover:!bg-zinc-400/20`}
        >
          <Menu size={16} />
        </Button>
        <Link
          href="/search"
          title="Search"
          className={cn(
            "p-2 rounded-md hover:bg-zinc-400/20 transition-colors"
          )}
          onNavigate={() => handleNav()}
        >
          <Search size={16} />
        </Link>
      </div>

      <div
        className={cn(
          "flex items-center px-2",
          collapsed ? "justify-center " : "justify-between"
        )}
      >
        <NewChatButton
          variant="ghost"
          className={cn(
            "w-full hover:!bg-zinc-400/20 cursor-pointer",
            collapsed ? "justify-center " : "justify-start"
          )}
          onSuccess={() => closeDrawer?.()}
        >
          <SquarePen />
          <span className={cn("", collapsed && "hidden")}>New Chat</span>
        </NewChatButton>
      </div>
      <div
        id="chatroom-scrollable"
        className="flex-1 overflow-y-auto p-2"
        style={{ minHeight: 0 }}
      >
        {isAuthLoading ? (
          <ChatRoomListSkeleton count={8} />
        ) : isAuthed ? (
          <div
            className={cn(
              "text-gray-700 dark:text-gray-300 transition-all duration-500 ease-in-out",
              collapsed
                ? "opacity-0 pointer-events-none translate-y-2"
                : "opacity-100 pointer-events-auto translate-y-0"
            )}
          >
            <ChatRoomList onRoomClick={handleNav} />
          </div>
        ) : (
          <div
            className={cn(
              "text-center transition-all duration-500 ease-in-out",
              collapsed && "hidden"
            )}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm transition-all duration-500 ease-in-out">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Once you're signed in, you can access your recent chats here.
              </p>
              <Link href="/auth/signin">
                <Button variant="link">Sign In</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex items-center px-2 transition-all ease-in-out duration-500",
          collapsed ? "justify-center " : "justify-between"
        )}
      >
        <ModeToggle />
      </div>
    </aside>
  );
}
