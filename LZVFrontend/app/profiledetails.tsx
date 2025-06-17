import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { clearUser } from "../features/auth/authSlice";
import { useLogoutUserMutation } from "@/api/apiSlice";
import StatSquare from "../components/atoms/statsquare";
import Header from "@/components/atoms/blueheader";

const ProfileDetails = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap(); // Call the API to revoke the token
      dispatch(clearUser()); // Clear user state after successful API call
      Alert.alert("Success", "You have been logged out.");
    } catch (error) {
      console.error("Logout error:", error); // Log the error for debugging
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  if (!user) {
    return <Text>Not logged in</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title={`Welkom ${user.first_name}`} />
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatSquare value={String(user.goals)} label="Goals scored" />
            <StatSquare value={String(user.assists)} label="Assists given" />
          </View>
          <View style={styles.statsRow}>
            <StatSquare value={String(user.games)} label="Matches played" />
          </View>
        </View>
        <Text style={styles.subtitle}>Email: {user.email}</Text>
        <Text style={styles.subtitle}>Role: {user.role}</Text>

        <Button
          title={isLoading ? "Logging out..." : "Logout"}
          onPress={handleLogout}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
