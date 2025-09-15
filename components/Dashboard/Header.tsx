"use client";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { useAppSelector } from "@/store/hook";
import Image from "next/image";
import DrawerSidebar from "./DrawerSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

export default function Header() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-6 h-16 ">
      <div className="flex items-center gap-1">
        <DrawerSidebar />
        <Link href={"/"} className="flex items-center gap-1 cursor-pointer">
          <Image
            src={"/oration_logo.png"}
            width={30}
            height={30}
            alt="oration_logo"
          />
          <span className="font-bold text-lg text-oration-orange">Oration</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://www.oration.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:block text-sm text-gray-700 dark:text-gray-200 hover:underline"
        >
          About Oration
        </a>
        {loading ? <Skeleton className="h-10 w-24 rounded" /> : <UserMenu />}
      </div>
    </header>
  );
}
