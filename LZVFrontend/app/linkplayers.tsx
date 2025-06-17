import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { clearUser } from "../features/auth/authSlice";
import { router } from "expo-router";
import {
  useGetPlayersInTeamQuery,
  useLinkPlayerEmailMutation,
} from "../api/apiSlice";

const ProfileDetails = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  const { data: players = [], isLoading, error } = useGetPlayersInTeamQuery();
  const [linkPlayerEmail] = useLinkPlayerEmailMutation();

  useEffect(() => {
    if (user?.role !== "manager") {
      router.push("/");
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const handleLinkEmail = async () => {
    if (!selectedPlayerId || !email) {
      Alert.alert("Error", "Please select a player and enter an email.");
      return;
    }

    try {
      const response = await linkPlayerEmail({
        playerId: selectedPlayerId,
        email,
      }).unwrap();
      Alert.alert("Success", `Email linked successfully to player.`);
      setEmail("");
      setSelectedPlayerId(null);
    } catch (err) {
      if (err && typeof err === "object" && "data" in err) {
        Alert.alert(
          "Error",
          (err as any).data?.message || "Failed to link email."
        );
      } else {
        Alert.alert("Error", "Failed to link email.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alle spelers in je team:</Text>
      {isLoading ? (
        <Text>Loading players...</Text>
      ) : error ? (
        <Text>Error loading players</Text>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.playerItem}>
              <Text style={styles.playerName}>
                {item.first_name} {item.last_name}
              </Text>
              <Button
                title="Select"
                onPress={() => setSelectedPlayerId(item.id)}
              />
            </View>
          )}
        />
      )}
      {selectedPlayerId && (
        <View style={styles.emailSection}>
          <Text>Link email to player ID: {selectedPlayerId}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
          />
          <Button title="Link Email" onPress={handleLinkEmail} />
        </View>
      )}
    </View>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  playerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  playerName: {
    fontSize: 18,
  },
  emailSection: {
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
});
