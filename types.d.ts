import { bookings, events } from "./drizzle/schema";

export interface TicketType {
  name: string;
  price: number;
  seatsAvailable: number;
  seatsRemaining: number;
}

export type Event = typeof events.$inferSelect;
export type Booking = typeof bookings.$inferSelect & { eventTitle: string };
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: "admin" | "business" | "user";
};
export type Business = {
  id: string;
  name: string | null;
  owner?: { name: string | null } | null;
  description: string | null;
  businessType: "restaurant" | "event";
};

export type DashboardData = {
  stats: {
    totalUsers: number;
    totalBusinesses: number;
  };
  users: User[];
  businesses: Business[];
};

export type EventDetails = {
  id: string;
  title: string;
  venue: string;
  city: string;
  eventStart: Date | string;
  eventEnd: Date | string;
  organizerName: string;
  eventImageUrl: string;
};

export type EventStats = {
  totalTicketsSold: number;
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
};

export type TicketAvailability = {
  name: string;
  price: number;
  sold: number;
  remaining: number;
  percentageSold: number;
};

export type RecentBooking = {
  id: string;
  email: string;
  phone: string;
  status: string;
  amount: number;
  date: string;
  tickets: number;
};

export type SalesOverTime = {
  date: string;
  ticketsSold: number;
  revenue: number;
};

export type TicketStatus = {
  status: string;
  count: number;
};

export type DemographicStat = {
  name: string;
  value: number;
};

export type EventDemographics = {
  gender: DemographicStat[];
  ageGroups: DemographicStat[];
};

export type EventDashboardData = {
  eventDetails: EventDetails;
  stats: EventStats;
  ticketAvailability: TicketAvailability[];
  recentBookings: RecentBooking[];
  salesOverTime: SalesOverTime[];
  ticketStatus: TicketStatus[];
  demographics: EventDemographics;
};
