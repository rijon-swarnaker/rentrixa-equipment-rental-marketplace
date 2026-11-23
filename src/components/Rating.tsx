
"use client";

import { useState } from "react";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  SlidersHorizontal,
  PenLine,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const reviews = [
  {
    id: 1,
    name: "Alex Morgan",
    image: "https://i.pravatar.cc/150?img=12",
    equipment: "Professional DSLR Camera",
    rating: 5,
    date: "November 20, 2026",
    comment:
      "Excellent rental experience! The equipment was in perfect condition and the owner was very helpful. Highly recommended!",
    helpful: 24,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    image: "https://i.pravatar.cc/150?img=47",
    equipment: "Excavator Machine",
    rating: 4,
    date: "November 18, 2026",
    comment:
      "Great service and smooth booking process. Equipment quality was good. Definitely going to rent again.",
    helpful: 18,
  },
  {
    id: 3,
    name: "James Cooper",
    image: "https://i.pravatar.cc/150?img=33",
    equipment: "Toyota Pickup Truck",
    rating: 5,
    date: "November 15, 2026",
    comment:
      "Very professional service. Everything was exactly as described. The entire rental process was hassle-free.",
    helpful: 12,
  },
  {
    id: 4,
    name: "Emily Johnson",
    image: "https://i.pravatar.cc/150?img=44",
    equipment: "Agriculture Tractor",
    rating: 3,
    date: "November 12, 2026",
    comment:
      "Overall a decent experience. The equipment worked well, but delivery took longer than expected.",
    helpful: 8,
  },
];

const ratingStats = [
  { stars: 5, percentage: 75, count: 150 },
  { stars: 4, percentage: 18, count: 36 },
  { stars: 3, percentage: 5, count: 10 },
  { stars: 2, percentage: 1, count: 2 },
  { stars: 1, percentage: 1, count: 2 },
];

export default function RatingsPage() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const filteredReviews = reviews
    .filter((review) =>
      filter === "all" ? true : review.rating === Number(filter)
    )
    .sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating;
      if (sort === "lowest") return a.rating - b.rating;
      return b.id - a.id;
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ratings & Reviews
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              See what customers are saying about their rental experience.
            </p>
          </div>

          <Button className="gap-2 bg-green-600 text-white hover:bg-green-700">
            <PenLine size={17} />
            Write a Review
          </Button>
        </div>

        {/* Overview */}
        <div className="grid gap-5 lg:grid-cols-3">

          <Card className="lg:col-span-1">
            <CardContent className="flex h-full flex-col items-center justify-center py-8">
              <p className="text-sm font-medium text-muted-foreground">
                Overall Rating
              </p>

              <h2 className="mt-3 text-6xl font-bold tracking-tight">
                4.8
              </h2>

              <div className="my-3 flex gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={21} fill="currentColor" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground">
                Based on 200 customer reviews
              </p>

              <Badge className="mt-4 gap-1 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400">
                <TrendingUp size={13} />
                Excellent
              </Badge>
            </CardContent>
          </Card>

          {/* Rating breakdown */}
          <Card className="lg:col-span-2">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Rating Breakdown</h3>
                <span className="text-xs text-muted-foreground">
                  200 reviews
                </span>
              </div>

              {ratingStats.map((item) => (
                <button
                  key={item.stars}
                  onClick={() =>
                    setFilter(
                      filter === String(item.stars)
                        ? "all"
                        : String(item.stars)
                    )
                  }
                  className="flex w-full items-center gap-3 text-sm"
                >
                  <span className="flex w-10 items-center gap-1">
                    {item.stars}
                    <Star
                      size={14}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  </span>

                  <Progress
                    value={item.percentage}
                    className="h-2 flex-1"
                  />

                  <span className="w-10 text-right text-muted-foreground">
                    {item.count}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Review Section */}
        <div className="space-y-5">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">Customer Reviews</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Real feedback from our rental community.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={filter} onValueChange={(value) => setSort(value ?? "newest")}>
                <SelectTrigger className="w-[145px]">
                  <SlidersHorizontal size={15} className="mr-2" />
                  <SelectValue placeholder="Filter rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <SelectItem key={star} value={String(star)}>
                      {star} Stars
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={(value) => setSort(value ?? "newest")}>
                <SelectTrigger className="w-[145px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <Card key={review.id} className="transition-colors hover:border-green-600/40">
                  <CardContent className="space-y-4 p-5 sm:p-6">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={review.image} />
                          <AvatarFallback>
                            {review.name[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {review.name}
                            </h3>
                            <Badge variant="secondary" className="gap-1 text-[10px]">
                              <BadgeCheck size={12} className="text-green-600" />
                              Verified Renter
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < review.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground/30"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-semibold">
                        {review.equipment}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <ThumbsUp size={15} />
                        Helpful ({review.helpful})
                      </Button>

                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare size={14} />
                        Customer feedback
                      </span>
                    </div>

                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <MessageSquare className="mb-3 text-muted-foreground" size={32} />
                  <h3 className="font-semibold">No reviews found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try selecting a different rating filter.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
