"use client";

import ComingSoon from "@/pages/coming-soon";
import Login from "@/pages/login";
import Main from "@/pages/main";

const EVENT_DATE = new Date("2025-12-17T15:30:00");

const Page = () => {
  const shouldShowComingSoon = new Date() < EVENT_DATE;
  const info = globalThis.localStorage.getItem("info");

  if (shouldShowComingSoon) {
    return <ComingSoon />;
  }

  if (!info) {
    return <Login />;
  }

  return <Main />;
};

export default Page;
