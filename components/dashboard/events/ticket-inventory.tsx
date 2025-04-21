"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Ticket, ChevronDown, ChevronUp } from "lucide-react";

export function TicketInventory({
  ticketAvailability,
}: {
  ticketAvailability: Array<{
    name: string;
    price: number;
    sold: number;
    remaining: number;
    percentageSold: number;
  }>;
}) {
  const [showAll, setShowAll] = useState(false);

  const sortedTickets = [...ticketAvailability].sort((a, b) => b.sold - a.sold);
  const displayedTickets = showAll ? sortedTickets : sortedTickets.slice(0, 4);

  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Ticket className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Ticket Inventory</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {displayedTickets.map((ticket) => (
          <Card key={ticket.name}>
            <CardContent className="p-4">
              <div className="mb-3 flex justify-between">
                <div>
                  <h3 className="font-medium">{ticket.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{ticket.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{ticket.sold} sold</p>
                  <p className="text-xs text-gray-400">
                    {ticket.remaining} remaining
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${ticket.percentageSold}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {ticket.percentageSold}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ticketAvailability.length > 4 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showAll ? "Show Less" : "Show More"}
            {showAll ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
