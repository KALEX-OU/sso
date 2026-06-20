"use client";

import React from "react";
import { StripeConnect } from "@/framework/components/user/StripeConnect";

export default function ConnectDashboardPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <StripeConnect />
    </div>
  );
}
