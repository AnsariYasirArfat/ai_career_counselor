import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Shield, Zap } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewChatButton from "@/components/common/NewChatButton";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Guidance",
      description:
        "Get personalized career advice powered by advanced AI technology.",
    },
    {
      icon: MessageCircle,
      title: "Conversational Interface",
      description:
        "Have natural conversations about your career goals and aspirations.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your conversations are secure and private with enterprise-grade security.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto h-full text-center p-4 ">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4 leading-tight">
          Welcome to
          <span className="text-ai-orange bg-gradient-to-r from-ai-orange to-orange-500 bg-clip-text ml-2">
            GuideLane AI
          </span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed">
          GuideLane AI is your AI-powered career counselor. Explore
          opportunities, plan your growth, and make smarter career decisions
          with confidence.
        </p>

        {!session ? (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link href="/auth/signin">
              <Button className="bg-ai-orange hover:bg-ai-orange/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                variant="outline"
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Create Account
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <NewChatButton className="bg-ai-orange hover:bg-ai-orange/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <MessageCircle className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              Start New Chat
            </NewChatButton>
            <Link href="/search">
              <Button
                variant="outline"
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                Search Chats
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-4">
          <Link
            href="/about"
            className="text-xs sm:text-sm underline text-gray-700 dark:text-gray-300"
          >
            Learn more about GuideLane AI
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {features.map(({ icon: Icon, title, description }, i) => (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm !gap-2">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-ai-orange/10 to-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-ai-orange" />
              </div>
              <CardTitle className="text-sm sm:text-base md:text-lg font-semibold">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
