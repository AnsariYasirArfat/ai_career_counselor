import Link from "next/link";
import Image from "next/image";
import UserMenu from "./UserMenu";
import DrawerSidebar from "./DrawerSidebar";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between sm:px-6 px-2 h-12 sm:h-14 md:h-16">
      <div className="flex items-center gap-1">
        <DrawerSidebar />
        <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
          <Image src={"/logo.png"} width={24} height={24} alt="logo" />
          <span className="font-bold text-base sm:text-lg text-ai-orange">
            GuideLane AI
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  );
}

