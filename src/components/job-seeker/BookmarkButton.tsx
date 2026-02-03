"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { useEffect, useState } from "react";

// actions
import {
  ToggleBookmark,
  ToggleBookmarkActionError,
} from "@/actions/job-seeker/toggle-bookmark";

// lib
import { cn } from "@/lib/utils";

// components
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";

// 3rd party
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";

// ----------------------------------------
// Interfaces and types
// ----------------------------------------
interface BookmarkButtonProps {
  jobId: string;
  isBookmarked?: boolean;
  className?: string;
}

// ----------------------------------------
// Main component
// ----------------------------------------
export function BookmarkButton({
  jobId,
  isBookmarked,
  className,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { data: session, status } = useSession();
  const jobSeekerId = session?.user.id;

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  // Apply for job tanstack mutation
  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      if (!jobSeekerId) throw new Error("Authentication required");

      return ToggleBookmark(jobId);
    },

    onSuccess: (response) => {
      if (response.success) {
        setBookmarked(response.success ? !bookmarked : bookmarked);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    },

    onError: (error: ToggleBookmarkActionError) => {
      toast.error(error.message);
    },
  });

  // Handle job apply
  const handleToggleBookmark = () => {
    mutate();
  };

  const loading = isPending || status === "loading";

  return (
    <Button
      type="button"
      size="icon"
      className={cn(
        "bg-brand/20 hover:bg-brand/30 border border-brand/30 text-brand",
        className,
      )}
      aria-label={`${bookmarked ? "remove from bookmarks" : "add to bookmarks"}`}
      disabled={loading}
      onClick={handleToggleBookmark}
    >
      {loading ? (
        <Spinner size={20} color="text-brand" />
      ) : bookmarked ? (
        <HiBookmark size={20} />
      ) : (
        <HiOutlineBookmark size={20} />
      )}
    </Button>
  );
}
