// src/screens/TeamStatistics.tsx (example path)
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useGetTeamStatisticsQuery } from "@/api/apiSlice";
import StatisticsContent from "@/components/organisms/statisticscontent";

export default function TeamStatistics() {
  // e.g., /team/[id] -> let { id } = useLocalSearchParams();
  const { id } = useLocalSearchParams();
  const teamId = id ? parseInt(String(id), 10) : null;

  // If there's no valid id, you might handle it differently
  const { data, error, isLoading } = useGetTeamStatisticsQuery(teamId!, {
    skip: !teamId, // skip if we don't have a valid ID
  });

  return <StatisticsContent data={data} error={error} isLoading={isLoading} />;
}
