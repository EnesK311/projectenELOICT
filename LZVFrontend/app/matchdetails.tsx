import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

import StaticMatchScreen from "./matchstates/staticmatchscreen";
import InProgressMatchScreen from "./matchstates/Inprogressmatchscreen";
import ManageScoresScreen from "./matchstates/managescoresscreen";

import {
  useCheckIfMatchIsLiveQuery,
  useRequestLiveScoreRightsMutation,
  useGetExtraDataQuery,
} from "@/api/apiSlice";
import * as Location from "expo-location";

/**
 * This screen decides which "match state" screen to render:
 * - StaticMatchScreen by default
 * - If the backend says match is live (200), we switch to InProgressMatchScreen
 * - If user explicitly requests to manage scores (and is authorized), we show ManageScoresScreen
 */
export default function MatchDetailRouter() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  // Parse match data from router params
  let match: any;
  const params = useLocalSearchParams();
  try {
    match = JSON.parse(params.match as string);
  } catch (error) {
    console.error("Error parsing match parameter:", error);
    Alert.alert("Error", "Invalid match data.");
    return null;
  }
  const {
    data: extraData,
    error: extraDataError,
    isLoading: isExtraDataLoading,
  } = useGetExtraDataQuery(match.id);

  // Whether the user is actively managing scores
  const [hasLiveScorePermission, setHasLiveScorePermission] = useState(false);

  // Whether the match is live (defaults to false until proven otherwise)
  const [isMatchLive, setIsMatchLive] = useState(false);

  // RTK Mutation: request permission to manage live scores (location-based)
  const [requestLiveScoreRights, { isLoading: requestingScoreRights }] =
    useRequestLiveScoreRightsMutation();

  // RTK Query: check if the match is "live" according to the server (returns 200 if live, 404 if not)
  const {
    data: isLiveData,
    isLoading: isLiveCheckLoading,
    isError: isLiveCheckError,
    error: isLiveCheckErrorData,
  } = useCheckIfMatchIsLiveQuery(match.id);

  useEffect(() => {
    if (!isLiveCheckLoading && !isLiveCheckError && isLiveData) {
      // We got a success => the match is live
      setIsMatchLive(true);
    }
    // If 404 or any error, we do nothing => keep isMatchLive as false
  }, [isLiveCheckLoading, isLiveCheckError, isLiveData]);

  /**
   * Attempt to manage scores (only if logged in + location allowed).
   */
  const handleManageScores = async () => {
    try {
      if (!isLoggedIn) {
        Alert.alert("Not Logged In", "Please log in to manage scores.");
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const result = await requestLiveScoreRights({
        matchId: match.id,
        userLocation,
      }).unwrap();

      Alert.alert("Success", result.message);
      setHasLiveScorePermission(true);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.data?.message || "Could not start managing scores."
      );
    }
  };

  /**
   * If the user is already managing scores, show ManageScoresScreen.
   */
  if (hasLiveScorePermission) {
    return (
      <ManageScoresScreen
        match={match}
        onStopEditing={() => setHasLiveScorePermission(false)}
      />
    );
  }

  /**
   * If we're still requesting the manage-scores permission, show a spinner.
   */
  if (requestingScoreRights) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isMatchLive) {
    // The match is live per the backend
    return (
      <InProgressMatchScreen
        match={match}
        isLoggedIn={isLoggedIn}
        onManageScores={handleManageScores}
      />
    );
  }

  // Otherwise, show the static screen
  return (
    <StaticMatchScreen
      match={match}
      isLoggedIn={isLoggedIn}
      onManageScores={handleManageScores}
      extraData={extraData}
    />
  );
}

export const screenOptions = {
  headerBackTitle: "Back",
};
