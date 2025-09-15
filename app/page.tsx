"use client";
import { useState, useEffect } from "react";
import NewChatModal from "@/components/Dashboard/NewChatModal";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-8">
        <Skeleton className="h-8 w-80 mb-4" />
        <Skeleton className="h-5 w-64 mb-4" />
        <Skeleton className="h-10 w-40 mb-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8">
      <h1 className="text-base sm:text-xl lg:text-2xl font-bold mb-4 text-center">
        Welcome to AI Career Counselor Chat
      </h1>

      <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
        Click <span className="font-semibold">New Chat</span> to start a new
        conversation.
      </p>
      <Button onClick={() => setModalOpen(true)} className="mb-4">
        <SquarePen /> New Chat
      </Button>
      <NewChatModal open={modalOpen} setOpen={setModalOpen} />
    </div>
  );
}
