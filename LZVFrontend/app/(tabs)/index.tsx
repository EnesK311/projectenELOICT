import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import Header from "@/components/atoms/header";
import RegionDivisionPicker from "@/components/atoms/divisionpicker";
import UpcomingGames from "@/components/organisms/upcominggames";
import RecentGames from "@/components/organisms/matchesrecentlyplayed";
import { Region, Division } from "@/types/types";
import {
  useGetRegionsQuery,
  useGetDivisionsInRegionQuery,
} from "@/api/apiSlice";

function HomeScreen() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(
    null
  );

  // For pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // Store refetch functions from child components
  const [refetchMatchesUpcoming, setRefetchMatchesUpcoming] = useState<
    (() => Promise<any>) | null
  >(null);
  const [refetchMatchesRecent, setRefetchMatchesRecent] = useState<
    (() => Promise<any>) | null
  >(null);

  // Fetch all regions
  const {
    data: regions = [],
    isLoading: regionsLoading,
    error: regionsError,
    refetch: refetchRegions,
  } = useGetRegionsQuery();

  // Fetch divisions in the selected region
  const {
    data: divisions = [],
    isLoading: divisionsLoading,
    error: divisionsError,
    refetch: refetchDivisions,
  } = useGetDivisionsInRegionQuery(selectedRegion?.id || 0, {
    skip: !selectedRegion,
  });

  useEffect(() => {
    if (regions.length > 0 && !selectedRegion) {
      setSelectedRegion(regions[0]);
    }
  }, [regions, selectedRegion]);

  useEffect(() => {
    if (divisions.length > 0 && !selectedDivision) {
      setSelectedDivision(divisions[0]);
    }
  }, [divisions, selectedDivision]);

  const handleRegionChange = (region: Region | null) => {
    setSelectedRegion(region);
    setSelectedDivision(null);
  };

  const handleDivisionChange = (division: Division | null) => {
    setSelectedDivision(division);
  };

  // Pull-to-refresh callback
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refetch the parent-level queries
      await refetchRegions();
      if (selectedRegion) {
        await refetchDivisions();
      }

      // Refetch matches from UpcomingGames if available
      if (refetchMatchesUpcoming) {
        await refetchMatchesUpcoming();
      }

      // Refetch matches from RecentGames if available
      if (refetchMatchesRecent) {
        await refetchMatchesRecent();
      }
    } catch (error) {
      console.warn("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Show activity indicators and errors for regions/divisions */}
        {(regionsLoading || divisionsLoading) && (
          <ActivityIndicator size="large" />
        )}
        {regionsError && (
          <Text>Error loading regions: {regionsError.toString()}</Text>
        )}
        {divisionsError && (
          <Text>Error loading divisions: {divisionsError.toString()}</Text>
        )}

        {/* Move the region/division picker to the HomeScreen */}
        <RegionDivisionPicker
          regions={regions}
          divisions={divisions}
          selectedRegion={selectedRegion}
          selectedDivision={selectedDivision}
          onRegionChange={handleRegionChange}
          onDivisionChange={handleDivisionChange}
        />

        {/* Pass the selected region & division + refetch setter to upcoming & recent games */}
        <UpcomingGames
          selectedRegion={selectedRegion}
          selectedDivision={selectedDivision}
          setRefetchMatchesFunc={setRefetchMatchesUpcoming}
        />

        <RecentGames
          selectedRegion={selectedRegion}
          selectedDivision={selectedDivision}
          setRefetchMatchesFunc={setRefetchMatchesRecent}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
});
