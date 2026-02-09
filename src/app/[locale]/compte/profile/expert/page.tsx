"use client";

import ExpertProfile from "@/components/profile/ExpertProfile";
import AccountLayout from "../../AccountLayout";

export default function ExpertProfilePage() {
  return (
    <AccountLayout>
      <div className="w-full bg-white min-h-screen">
        <ExpertProfile />
      </div>
    </AccountLayout>
  );
}
