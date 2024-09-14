/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as adminDashboard from "../adminDashboard.js";
import type * as advancedSettings from "../advancedSettings.js";
import type * as aiEstimate from "../aiEstimate.js";
import type * as analytics from "../analytics.js";
import type * as appointments from "../appointments.js";
import type * as appointmnets from "../appointmnets.js";
import type * as assessments from "../assessments.js";
import type * as auth from "../auth.js";
import type * as availability from "../availability.js";
import type * as booking from "../booking.js";
import type * as bookings from "../bookings.js";
import type * as calendar from "../calendar.js";
import type * as clients from "../clients.js";
import type * as estimations from "../estimations.js";
import type * as images from "../images.js";
import type * as insights from "../insights.js";
import type * as integrations from "../integrations.js";
import type * as invoices from "../invoices.js";
import type * as metrics from "../metrics.js";
import type * as profile from "../profile.js";
import type * as quotes from "../quotes.js";
import type * as quoting from "../quoting.js";
import type * as scheduling from "../scheduling.js";
import type * as services from "../services.js";
import type * as users from "../users.js";
import type * as vehicle from "../vehicle.js";
import type * as vehicleparts from "../vehicleparts.js";
import type * as vinscanner from "../vinscanner.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  adminDashboard: typeof adminDashboard;
  advancedSettings: typeof advancedSettings;
  aiEstimate: typeof aiEstimate;
  analytics: typeof analytics;
  appointments: typeof appointments;
  appointmnets: typeof appointmnets;
  assessments: typeof assessments;
  auth: typeof auth;
  availability: typeof availability;
  booking: typeof booking;
  bookings: typeof bookings;
  calendar: typeof calendar;
  clients: typeof clients;
  estimations: typeof estimations;
  images: typeof images;
  insights: typeof insights;
  integrations: typeof integrations;
  invoices: typeof invoices;
  metrics: typeof metrics;
  profile: typeof profile;
  quotes: typeof quotes;
  quoting: typeof quoting;
  scheduling: typeof scheduling;
  services: typeof services;
  users: typeof users;
  vehicle: typeof vehicle;
  vehicleparts: typeof vehicleparts;
  vinscanner: typeof vinscanner;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
