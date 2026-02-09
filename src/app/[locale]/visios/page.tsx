"use client";
import { withAuth } from "@/components/common/withAuth";
import { AppSidebar } from "@/components/layout/Sidebare";
import { useCallStore } from "@/store/useCall";
import { useUserStore } from "@/store/useUser";
import Client from "./Client";
import Expert from "./Expert";

function Visios() {
  const handleNotificationClick = () => {
    console.log("Notifications cliquées");
  };
  const { isVideoCallOpen } = useCallStore();
  const { user } = useUserStore();
  return (
    <div className="flex w-full">
      <AppSidebar hideMobileNav={isVideoCallOpen} />
      <div className="w-full flex-1 pb-10">
        {user.type === "client" ? (
          <Client />
        ) : (
          <Expert handleNotificationClick={handleNotificationClick} />
        )}
      </div>

      {/* Modal de consultation vidéo */}
    </div>
  );
}

export default withAuth(Visios);
