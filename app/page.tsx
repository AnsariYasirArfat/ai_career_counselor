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
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Section Skeleton */}
            <div className="mb-8 sm:mb-12 md:mb-16">
              <Skeleton className="h-6 sm:h-8 md:h-10 lg:h-12 w-64 sm:w-80 md:w-96 mx-auto mb-4 sm:mb-6" />
              <Skeleton className="h-4 sm:h-5 md:h-6 w-72 sm:w-80 md:w-96 mx-auto mb-6 sm:mb-8" />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Skeleton className="h-10 w-32 sm:w-36" />
                <Skeleton className="h-10 w-32 sm:w-36" />
              </div>
            </div>

            {/* Features Section Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardHeader className="pb-3 sm:pb-4">
                    <Skeleton className="w-12 h-12 rounded-lg mx-auto mb-3 sm:mb-4" />
                    <Skeleton className="h-5 sm:h-6 w-32 sm:w-40 mx-auto" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-5xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 leading-tight">
            Welcome to{" "}
            <span className="text-oration-orange bg-gradient-to-r from-oration-orange to-orange-500 bg-clip-text ">
              AI Career Counselor
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed">
            Get personalized career guidance powered by AI. Explore
            opportunities, plan your growth, and make smarter career decisions
            with confidence.
          </p>

          {!session ? (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="bg-oration-orange hover:bg-oration-orange/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                onClick={() => setModalOpen(true)}
                size="lg"
                className="bg-oration-orange hover:bg-oration-orange/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start New Chat
                <MessageCircle className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <NewChatModal open={modalOpen} setOpen={setModalOpen} />
              <Link href="/search">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  Search Chats
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-oration-orange/10 to-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-oration-orange" />
              </div>
              <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">
                AI-Powered Guidance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Get personalized career advice powered by advanced AI technology
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-oration-orange/10 to-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-oration-orange" />
              </div>
              <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">
                Conversational Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Have natural conversations about your career goals and
                aspirations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-oration-orange/10 to-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-oration-orange" />
              </div>
              <CardTitle className="text-base sm:text-lg md:text-xl font-semibold">
                Secure & Private
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Your conversations are secure and private with enterprise-grade
                security
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
