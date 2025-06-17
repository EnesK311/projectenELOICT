// src/screens/MyTeamStatistics.tsx (example path)

import React from "react";
import { useGetStatisticsQuery } from "@/api/apiSlice";
import StatisticsContent from "@/components/organisms/statisticscontent";

export default function MyTeamStatistics() {
  const { data, error, isLoading } = useGetStatisticsQuery();

  return <StatisticsContent data={data} error={error} isLoading={isLoading} />;
}
