import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/atoms/blueheader";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import AvailabilitiesPage from "../availabilities";

const Manage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const navigateTo = (path: string) => {
    if (["/linkplayers", "/availabilities"].includes(path)) {
      router.push(path as "/linkplayers");
    } else {
      console.error(`Invalid route: ${path}`);
    }
  };

  if (user?.role === "manager") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title={"Manage"} />
        <ScrollView contentContainerStyle={styles.wrapper}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team specific</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigateTo("/linkplayers")}
            >
              <Text style={styles.buttonText}>Manage players</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigateTo("/availabilities")}
            >
              <Text style={styles.buttonText}>See availabilities</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overall</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Team shirt color</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Feedback</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>
                Send all teammates a notification
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else if (user?.role === "player") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title={"Availabilities"} />
        <AvailabilitiesPage />
      </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>No access</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Manage;
