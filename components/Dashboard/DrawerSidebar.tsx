"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Drawer, DrawerContent, DrawerOverlay } from "@/components/ui/drawer";
import { Menu } from "lucide-react";

export default function DrawerSidebar() {
  const [open, setOpen] = useState(false);
  const closeDrawer = () => setOpen(false);
  return (
    <>
      <button
        className="lg:hidden p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerContent className="p-0 !w-64  h-[100svh]">
          <Sidebar closeDrawer={closeDrawer} isDrawer />
        </DrawerContent>
        <DrawerOverlay onClick={() => setOpen(false)} />
      </Drawer>
    </>
  );
}
