'use client';
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-3xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-zinc-500 mb-6">
        An unexpected error occurred. Please try again or go back to the homepage.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 rounded bg-oration-orange text-white hover:bg-oration-orange/80 transition mb-2"
      >
        Try Again
      </button>
      <Link
        href="/"
        className="text-oration-orange hover:underline text-sm"
      >
        Go Home
      </Link>
    </div>
  );
}
