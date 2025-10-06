"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/ModeToggle";
import { cn } from "@/lib/utils";
import { Menu, SquarePen, Search } from "lucide-react";
import Link from "next/link";
import NewChatModal from "./NewChatModal";
import ChatRoomList from "./ChatRoomList";
import { useSession } from "next-auth/react";
import ChatRoomListSkeleton from "./ChatRoomListSkeleton";

interface SidebarProps {
  closeDrawer?: () => void;
  isDrawer?: boolean;
}

export default function Sidebar({ closeDrawer, isDrawer }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
        "flex flex-col gap-2 sm:gap-4 p-4 h-[100svh] bg-[#f0f4f9] dark:bg-[#282a2c] transition-all duration-300 ",
        collapsed ? "w-16 " : "w-64 "
      )}
    >
      <div
        className={cn(
          "flex items-center",
          collapsed ? "justify-center " : "justify-between"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNav(() => setCollapsed((c) => !c))}
          className={` flex justify-center items-center hover:!bg-zinc-400/20`}
        >
          <Menu size={20} />
        </Button>
        <Link
          href="/search"
          className={cn(
            "p-2 rounded-full hover:bg-zinc-400/20 transition-colors",
            collapsed && "hidden"
          )}
          onNavigate={() => handleNav()}
        >
          <Search size={16} />
        </Link>
      </div>

      <div
        className={cn(
          "flex items-center",
          collapsed ? "justify-center " : "justify-between"
        )}
      >
        <Button
          className={cn(
            "w-full  hover:!bg-zinc-400/20 cursor-pointer",
            collapsed ? "justify-center " : "justify-start"
          )}
          variant="ghost"
          onClick={() => {
            setModalOpen(true);
          }}
          disabled={!session}
        >
          <SquarePen />
          <span className={cn("", collapsed && "hidden")}>New Chat</span>
        </Button>
        <NewChatModal
          open={modalOpen}
          setOpen={setModalOpen}
          closeDrawer={closeDrawer}
        />
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
              "text-gray-700 dark:text-gray-300",
              collapsed && "hidden"
            )}
          >
            <ChatRoomList onRoomClick={handleNav} />
          </div>
        ) : (
          <div className={cn("text-center", collapsed && "hidden")}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
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

      <div className="mt-auto flex justify-start">
        <ModeToggle />
      </div>
    </aside>
  );
}
