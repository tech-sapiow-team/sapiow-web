"use client";
import { useGetProExpert } from "@/api/proExpert/useProExpert";
import { UpcomingVideoCall } from "@/components/common/DarkSessionCard";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useClientHome } from "@/hooks/useClientHome";
import { usePatientAppointments } from "@/hooks/usePatientAppointments";
import { Professional } from "@/types/professional";
import {
  transformAppointmentToSessionData,
  type ApiAppointment,
} from "@/utils/appointmentUtils";
import { useTranslations } from "next-intl";
import CategoryFilter from "./CategoryFilter";
import CategorySection from "./CategorySection";
import ProfessionalCard from "./ProfessionalCard";
import SubCategoryFilter from "./SubCategoryFilter";

export default function Client() {
  const t = useTranslations();

  const { data: proExpert } = useGetProExpert(true);

  // Passer l'ID du profil expert au hook pour l'exclure de la liste
  const {
    selectedCategory,
    selectedSubCategory,
    groupedProfessionals,
    filteredProfessionals,
    likedProfs,
    handleCategoryChange,
    handleSubCategoryChange,
    handleSortChange,
    handleToggleLike,
    handleProfessionalClick,
    isLoading,
    error,
  } = useClientHome(proExpert?.id);

  // Récupération des appointments du patient avec filtre de date et recherche
  const { confirmedAppointments: upcomingAppointments } =
    usePatientAppointments();

  if (isLoading) {
    return <LoadingScreen message={t("home.loadingExperts")} size="md" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">
            {t("home.errorLoadingExperts")}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {error.message || t("home.unknownError")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=" w-full">
        {/* Section visios confirmées à venir */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-6 mt-4">
            <h2 className="mb-3 text-lg font-bold text-exford-blue font-figtree">
              {t("home.yourNextVisio")}
            </h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {upcomingAppointments
                .slice(0, 2)
                .map((appointment: ApiAppointment) => {
                  const sessionData =
                    transformAppointmentToSessionData(appointment);
                  return (
                    <UpcomingVideoCall
                      key={appointment.id}
                      date={sessionData.date}
                      appointmentAt={appointment.appointment_at}
                      profileImage={sessionData.profileImage}
                      name={sessionData.professionalName}
                      title={sessionData.professionalTitle}
                      variant="dark"
                      showButton={false}
                      sessionTime={sessionData.time}
                      className="w-full min-w-full md:min-w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)] lg:max-w-[324px] lg:min-w-[324px] h-[184px] border-none shadow-none"
                    />
                  );
                })}
            </div>
          </div>
        )}
        <h2 className="my-2 text-lg lg:text-2xl font-normal text-exford-blue font-figtree">
          {t("home.accelerateProject")}
        </h2>{" "}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        {/* </div> */}
        {selectedCategory !== "top" && (
          <SubCategoryFilter
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onSubCategoryChange={handleSubCategoryChange}
            onSortChange={handleSortChange}
          />
        )}
        {selectedCategory === "top" ? (
          // Affichage par sections pour "Top"
          <div className="py-6 ">
            {Object.entries(groupedProfessionals).map(
              ([category, categoryProfessionals]) => (
                <CategorySection
                  key={category}
                  category={category}
                  professionals={categoryProfessionals as Professional[]}
                  likedProfs={likedProfs}
                  onToggleLike={handleToggleLike}
                  onProfessionalClick={handleProfessionalClick}
                />
              )
            )}
          </div>
        ) : (
          // Affichage normal pour les autres catégories
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {filteredProfessionals.map((professional: Professional) => (
              <ProfessionalCard
                key={professional.id}
                professional={professional}
                isLiked={(() => {
                  const profIdString = professional.id.toString();
                  const isLiked = likedProfs[profIdString] || false;

                  return isLiked;
                })()}
                onToggleLike={handleToggleLike}
                onProfessionalClick={handleProfessionalClick}
                lineClamp={3}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
