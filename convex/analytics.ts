import { Query } from "convex/server";

export const getMetrics = Query(async ({ db }) => {
  try {
    const totalRevenue = await db.query("services").sum("revenue") ?? 0;
    const completedServices = await db.query("services").filter({ status: "completed" }).count();
    const totalAppointments = await db.query("appointments").count();
    const noShowAppointments = await db.query("appointments").filter({ status: "no-show" }).count();
    const noShowRate = totalAppointments > 0 ? noShowAppointments / totalAppointments : 0;
    const averageRating = await db.query("ratings").avg("score") ?? 0;

    return {
      totalRevenue,
      completedServices,
      noShowRate,
      averageRating,
    };
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw new Error("Failed to fetch analytics metrics.");
  }
});