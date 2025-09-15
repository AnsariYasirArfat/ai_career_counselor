'use client';
import Link from "next/link";
import { Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Frown className="w-16 h-16 text-zinc-400 mb-4" />
      <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
      <p className="text-zinc-500 mb-6">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="px-6 py-2 rounded bg-oration-orange text-white hover:bg-oration-orange/80 transition">
        Go Home
      </Link>
    </div>
  );
}
