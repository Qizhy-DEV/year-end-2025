"use client";

import ComingSoon from "@/pages/coming-soon";
import Main from "@/pages/main";

const EVENT_DATE = new Date("2025-12-17T15:30:00");

const Page = () => {
  const shouldShowComingSoon = new Date() < EVENT_DATE;

  if (shouldShowComingSoon) {
    return <ComingSoon />;
  }

  return <Main />;
};

export default Page;
