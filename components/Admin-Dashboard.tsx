// components/dashboard/admin-dashboard.tsx
'use client';

import React from "react";
import { Protect } from "@clerk/nextjs";
import DashboardCard from "./Dashboard-Card";

interface AdminDashboardProps {
  data: {
    totalUsers: number;
    totalOrganizations: number;
    activeAppointments: number;
  };
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  return (
    <Protect
      permission="org:admin:access"
      fallback={<p>You do not have permission to view the admin dashboard.</p>}
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Users"
            description="Total registered users"
            stats={[{ id: "total-users", label: "Total Users", value: data.totalUsers }]}
            action="View Users"
            onAction={() => {/* Navigate to users page */ }}
          />
          <DashboardCard
            title="Organizations"
            description="Total registered organizations"
            stats={[{ id: "total-orgs", label: "Total Organizations", value: data.totalOrganizations }]}
            action="View Organizations"
            onAction={() => {/* Navigate to organizations page */ }}
          />
          <DashboardCard
            title="Appointments"
            description="Currently active appointments"
            stats={[{ id: "active-appointments", label: "Active Appointments", value: data.activeAppointments }]}
            action="View Appointments"
            onAction={() => {/* Navigate to appointments page */ }}
          />
        </div>
      </div>
    </Protect>
  );
}