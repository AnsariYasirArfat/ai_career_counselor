import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "About GuideLane AI – AI Career Counselor",
  description:
    "GuideLane AI helps you explore career paths, plan your growth, and make confident decisions with a private, conversational experience.",
  keywords: [
    "GuideLane AI",
    "AI career counselor",
    "career guidance",
    "career planning",
    "job search",
    "professional growth",
    "AI career coach",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About GuideLane AI – AI Career Counselor",
    description:
      "A private, conversational AI that helps you make confident career decisions.",
    images: [
      {
        url: "/screenshots/AI-Career-Counselor.png",
        width: 1200,
        height: 630,
        alt: "GuideLane AI overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About GuideLane AI – AI Career Counselor",
    description:
      "Private, conversational AI for your career choices and growth.",
    images: ["/screenshots/AI-Career-Counselor.png"],
  },
};

export default async function AboutPage() {
  const session = await auth();
  const highlights = [
    "Discover roles and paths that fit your strengths",
    "Build a focused learning plan with resources and checkpoints",
    "Prepare for interviews with targeted practice",
    "Improve your resume or portfolio with practical feedback",
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-20">
      {/* Intro */}
      <header className=" mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="GuideLane AI logo"
            width={36}
            height={36}
            className="rounded"
            priority={false}
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            About GuideLane AI
          </h1>
        </div>
        <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
          GuideLane AI is your private, conversational career counselor. It
          helps you explore options, design a plan that fits your pace, and move
          forward with confidence—without the noise or generic advice.
        </p>
      </header>

      {/* What it is */}
      <section className="sm:mb-12">
        <h2 className="text-lg sm:text-xl font-semibold mb-3">What it is</h2>
        <div className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Whether you’re switching careers, leveling up in your current role,
            or exploring what’s next, GuideLane AI gives you personalized
            guidance grounded in your skills, interests, and goals.
          </p>
          <p>
            Instead of long reports, you get short, practical steps—learn a
            skill, practice with examples, gather proof of work, and iterate.
            You stay in control, and the assistant adapts as your goals evolve.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-10 sm:mb-12">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-center">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white/70 dark:bg-zinc-900/60">
            <p className="text-sm font-medium mb-1">1. Share your goals</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Tell GuideLane where you are and what you want next—role, skills,
              or industry.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white/70 dark:bg-zinc-900/60">
            <p className="text-sm font-medium mb-1">2. Get a clear plan</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Receive focused steps, resources, and checkpoints tailored to you.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white/70 dark:bg-zinc-900/60">
            <p className="text-sm font-medium mb-1">3. Iterate in chat</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ask follow‑ups, refine your plan, and track progress over time.
            </p>
          </div>
        </div>
      </section>

      {/* See it in action (friendly wording, responsive images) */}
      <section className="mb-12">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-center">
          See it in action
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center max-w-3xl mx-auto">
          A quick peek at the experience in light and dark modes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              src: "/screenshots/AI-Career-Counselor.png",
              alt: "GuideLane AI overview (dark)",
            },
            {
              src: "/screenshots/AI-Career-Counselor-light.png",
              alt: "GuideLane AI overview (light)",
            },
            {
              src: "/screenshots/chat_light.png",
              alt: "GuideLane AI conversation view",
            },
            { src: "/screenshots/login.png", alt: "GuideLane AI sign-in" },
            { src: "/screenshots/register.png", alt: "GuideLane AI sign-up" },
            {
              src: "/screenshots/search.png",
              alt: "GuideLane AI search chats",
            },
          ].map((img) => (
            <div
              key={img.src}
              className="relative w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-black/5 dark:bg-white/5"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* What you can do */}
      <section className="mx-auto max-w-5xl mb-12">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-center">
          What you can do
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
          {highlights.map((h) => (
            <li
              key={h}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white/70 dark:bg-zinc-900/60"
            >
              {h}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA respects session */}
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-lg sm:text-xl font-semibold mb-3">Get started</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
          Start a conversation and get guidance tailored to you.
        </p>

        {!session ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signin">
              <Button className="bg-ai-orange hover:bg-ai-orange/90 text-white">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline">Create account</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search">
              <Button variant="outline">Browse chats</Button>
            </Link>
            <Link href="/">
              <Button className="bg-ai-orange hover:bg-ai-orange/90 text-white">
                Start new chat
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
