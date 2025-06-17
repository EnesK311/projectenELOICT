import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import {
  useGetTeamAvailabilitiesQuery,
  useUpdateAvailabilityMutation,
  useGetlatestMatchQuery,
} from "@/api/apiSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

function AvailabilitiesPage() {
  const [matchId, setMatchId] = useState<number | null>(null);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    data: latestMatch,
    isLoading: isMatchesLoading,
    isError: isMatchesError,
  } = useGetlatestMatchQuery();

  const {
    data: availabilities = [],
    isLoading,
    isError,
    refetch,
  } = useGetTeamAvailabilitiesQuery(matchId as number, { skip: !matchId });

  const [updateAvailability, { isLoading: isUpdating }] =
    useUpdateAvailabilityMutation();
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (latestMatch) {
      setMatchId(latestMatch?.data?.id);
    }
  }, [latestMatch]);

  const handleAvailabilityChange = async (available: boolean) => {
    try {
      setUploadError(null);
      if (!matchId) {
        console.warn("No match ID available.");
        return;
      }
      await updateAvailability({ matchId, available }).unwrap();
      refetch();
    } catch (error: any) {
      Alert.alert(
        "Upload Error",
        error?.data?.message || "Failed to update availability."
      );
      setUploadError(error?.data?.message || "Failed to update availability.");
    }
  };

  // If the user isn't logged in, hide the page
  if (!isLoggedIn) {
    return null;
  }

  // Display a loader while fetching data
  if (isMatchesLoading || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Handle error states
  if (isMatchesError || isError || !latestMatch) {
    return (
      <View style={styles.center}>
        <Text>Error loading match or availabilities.</Text>
      </View>
    );
  }

  const availableCount = availabilities.filter(
    (item: any) => item.availability === "true"
  ).length;

  /**
   * Detect scroll position. If the user is near the bottom,
   * refetch the data (similar to "onEndReached" in FlatList).
   */
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    // How close to the bottom before triggering the refetch (pixels).
    const paddingToBottom = 50;

    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      // User is near the bottom — refetch the availability
      refetch();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { paddingTop: 0 }]}
      edges={["left", "right", "bottom"]}
    >
      <View style={styles.container}>
        <Text style={styles.subTitle}>
          Total available players: {availableCount}
        </Text>

        {/* Replace FlatList with a scrollable list of items */}
        <ScrollView
          style={{ flex: 1 }}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Controls how often onScroll updates (16 ~ 60fps)
        >
          {availabilities.map((item: any, index: number) => {
            let icon;
            if (item.availability === "true") {
              icon = (
                <Ionicons name="checkmark-circle" size={24} color="green" />
              );
            } else if (item.availability === "false") {
              icon = <Ionicons name="close-circle" size={24} color="red" />;
            } else {
              icon = <Ionicons name="remove-circle" size={24} color="yellow" />;
            }

            return (
              <View key={index} style={styles.item}>
                <View style={styles.playerInfo}>
                  {icon}
                  <Text style={styles.playerName}>{item.player_name}</Text>
                </View>
              </View>
            );
          })}

          <View style={styles.editAvailability}>
            <Text style={styles.editTitle}>Edit availability</Text>
            <TouchableOpacity
              style={[styles.button, styles.availableButton]}
              onPress={() => handleAvailabilityChange(true)}
              disabled={isUpdating}
            >
              <Text style={styles.buttonText}>Available</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.unavailableButton]}
              onPress={() => handleAvailabilityChange(false)}
              disabled={isUpdating}
            >
              <Text style={styles.buttonText}>Unavailable</Text>
            </TouchableOpacity>
            {user?.role === "manager" && (
              <TouchableOpacity
                style={[styles.button, styles.reminderButton]}
                onPress={() => Alert.alert("Reminder sent to all players")}
              >
                <Text style={styles.buttonText}>Send reminder</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default AvailabilitiesPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 18,
    color: "#333",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  playerName: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  editAvailability: {
    marginTop: 20,
    paddingVertical: 10,
  },
  editTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  availableButton: {
    backgroundColor: "green",
  },
  unavailableButton: {
    backgroundColor: "red",
  },
  reminderButton: {
    backgroundColor: "#FFD700",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
