"use client";
import { useState, useEffect } from "react";
import NewChatModal from "@/components/Dashboard/NewChatModal";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Shield, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-8">
        <Skeleton className="h-8 w-80 mb-4" />
        <Skeleton className="h-5 w-64 mb-4" />
        <Skeleton className="h-10 w-40 mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-xl sm:text-2xl  md:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to{" "}
              <span className="text-oration-orange">AI Career Counselor</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Get personalized career guidance powered by AI. Explore
              opportunities, plan your growth, and make smarter career decisions
              with confidence.
            </p>

            {!session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signin">
                  <Button className="bg-oration-orange hover:bg-oration-orange/90">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline">Create Account</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setModalOpen(true)}
                  className="bg-oration-orange hover:bg-oration-orange/90"
                >
                  Start New Chat
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
                <NewChatModal open={modalOpen} setOpen={setModalOpen} />
                <Link href="/search">
                  <Button variant="outline">Search Chats</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-oration-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-oration-orange" />
                </div>
                <CardTitle>AI-Powered Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get personalized career advice powered by advanced AI
                  technology
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-oration-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-oration-orange" />
                </div>
                <CardTitle>Conversational Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Have natural conversations about your career goals and
                  aspirations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-oration-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-oration-orange" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your conversations are secure and private with
                  enterprise-grade security
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
