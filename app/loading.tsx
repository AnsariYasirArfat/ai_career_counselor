import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
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
};

export default loading;
