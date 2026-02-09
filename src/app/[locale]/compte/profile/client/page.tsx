"use client";

import ClientProfile from "@/components/profile/ClientProfile";
import AccountLayout from "../../AccountLayout";

export default function ClientProfilePage() {
  return (
    <AccountLayout>
      <div className="w-full bg-white min-h-screen">
        <ClientProfile />
      </div>
    </AccountLayout>
  );
}
