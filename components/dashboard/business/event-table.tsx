"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "../data-table";
import Link from "next/link";
import type { Event } from "@/types";
import type { PaginatedResult } from "@/lib/dashboard/admin/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HiDotsVertical } from "react-icons/hi";
import { toast } from "@/hooks/use-toast";
import {
  deleteEvent,
  publishEvent,
  unpublishEvent,
} from "@/actions/event-actions";
import { formatDate } from "@/lib/dashboard/organiser/utils";

interface EventsTableProps {
  eventsResult: PaginatedResult<Event>;
  page: number;
  limit: number;
  initialSearch: string;
  initialCategory: string;
}

export default function EventsTable({
  eventsResult,
  page,
  limit,
  initialSearch,
  initialCategory,
}: EventsTableProps) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    if (initialSearch) params.set("search", initialSearch);
    if (initialCategory) params.set("category", initialCategory);
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleUnpublish = async (eventId: string) => {
    try {
      const res = await unpublishEvent(eventId);
      if (res.success) {
        toast({
          title: "Event Unpublished",
          description: "The event has been marked as a draft.",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error unpublishing event:", error);
      toast({
        title: "Error",
        description: "Failed to unpublish event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (eventId: string) => {
    try {
      const res = await publishEvent(eventId);
      if (res.success) {
        toast({
          title: "Event Published",
          description: "The event has been published.",
          variant: "success",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error publishing event:", error);
      toast({
        title: "Error",
        description: "Failed to publish event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      const res = await deleteEvent(eventId);
      if (res.success) {
        toast({
          title: "Event Deleted",
          description: "The event has been successfully deleted.",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  return (
    <DataTable
      title="Events"
      data={eventsResult.data}
      total={eventsResult.total}
      columns={[
        {
          header: "Title",
          accessor: "title",
          render: (item) => (
            <Link
              href={`/dashboard/events/${item.id}`}
              target="_blank"
              className="font-semibold"
            >
              {item.title}
            </Link>
          ),
        },
        { header: "Venue", accessor: "venue" },
        {
          header: "Category",
          accessor: (item) =>
            item.category.charAt(0).toUpperCase() + item.category.slice(1),
        },
        {
          header: "Start Date",
          accessor: (item) => formatDate(item.eventStart),
        },
        {
          header: "Actions",
          accessor: "id",
          render: (item) => (
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <HiDotsVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
                      asChild
                    >
                      <Link
                        href={`/dashboard/organiser/edit?eventId=${encodeURIComponent(item.id)}`}
                      >
                        Edit
                      </Link>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
                      onClick={() =>
                        handleDownload(item.pamphletUrl, `${item.title}.png`)
                      }
                    >
                      Download Pamphlet
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    {item.publishedAt !== null ? (
                      <Button
                        variant="ghost"
                        className="flex w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
                        onClick={() => handleUnpublish(item.id)}
                      >
                        Unpublish
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="flex w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
                        onClick={() => handlePublish(item.id)}
                      >
                        Publish
                      </Button>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-start focus-visible:ring-0 focus-visible:ring-offset-0"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        },
      ]}
      filters={[
        {
          key: "category",
          label: "Category",
          options: [
            { value: "all", label: "All Categories" },
            { value: "entertainment", label: "Entertainment" },
            { value: "music", label: "Music" },
            { value: "technology", label: "Technology" },
            { value: "sports", label: "Sports" },
            { value: "food", label: "Food & Drinks" },
            { value: "arts", label: "Arts & Culture" },
          ],
        },
      ]}
      onPageChange={handlePageChange}
      onFilterChange={handleFilterChange}
      page={page}
      limit={limit}
    />
  );
}
