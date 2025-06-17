import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  useGetDivisionResultsQuery,
  useGetDivisionTableQuery,
  useGetDivisionNameQuery,
} from "@/api/apiSlice";
import MatchCard from "@/components/molecules/matchcard";
import Header from "@/components/atoms/blueheader";
import { router, useLocalSearchParams } from "expo-router";

const Division = () => {
  // Get `division_id` from params
  const params = useLocalSearchParams();
  const divisionId = Number(params.id);

  const {
    data: divisionName,
    isLoading: divisionNameLoading,
    error: divisionNameError,
  } = useGetDivisionNameQuery(divisionId);

  const {
    data: results = [],
    isLoading: resultsLoading,
    error: resultsError,
  } = useGetDivisionResultsQuery(divisionId);

  const {
    data: table = [],
    isLoading: tableLoading,
    error: tableError,
  } = useGetDivisionTableQuery(divisionId);

  // Redirect or handle invalid divisionId
  useEffect(() => {
    if (!divisionId) {
      alert("Invalid Division ID. Returning to previous screen.");
      router.back(); // Navigate back if divisionId is invalid
    }
  }, [divisionId]);

  // Combined loading state
  if (divisionNameLoading || resultsLoading || tableLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1A2B47" />
        <Text>Loading division data...</Text>
      </View>
    );
  }

  // Combined error state
  if (divisionNameError || resultsError || tableError) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>Failed to load division data.</Text>
        {divisionNameError && (
          <Text>Name Error: {divisionNameError.toString()}</Text>
        )}
        {resultsError && <Text>Results Error: {resultsError.toString()}</Text>}
        {tableError && <Text>Table Error: {tableError.toString()}</Text>}
      </View>
    );
  }

  // Extract the division name from the fetched data
  const divisionDisplayName = divisionName?.name || "Unknown Division";

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title={divisionDisplayName} />
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <>
              {/* Division Table */}
              <Text style={styles.sectionTitle}>Standings</Text>
              <View style={styles.tableContainer}>
                {/* Fixed Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, styles.boldCell]}>pos.</Text>
                  <Text style={[styles.tableCell, styles.boldCell]}>Team</Text>
                  <Text style={[styles.tableCell, styles.boldCell]}>pts.</Text>
                  <Text style={[styles.tableCell, styles.boldCell]}>mp</Text>
                  <Text style={[styles.tableCell, styles.boldCell]}>gs</Text>
                  <Text style={[styles.tableCell, styles.boldCell]}>ga</Text>
                </View>
                {/* Scrollable Table Body */}
                <ScrollView style={styles.tableBodyScroll}>
                  {table.map((item, index) => (
                    <View key={item.team_id} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                      <Text style={styles.tableCell}>
                        {item.team_name || "Unknown"}
                      </Text>
                      <Text style={styles.tableCell}>{item.points || 0}</Text>
                      <Text style={styles.tableCell}>
                        {item.matches_played || 0}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.goals_for || 0}
                      </Text>
                      <Text style={styles.tableCell}>
                        {item.goals_against || 0}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Division Results Section Title */}
              <Text style={styles.sectionTitle}>Matches</Text>
            </>
          }
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MatchCard match={item} id={item.id} />}
          ListEmptyComponent={<Text>No match results available.</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  tableBodyScroll: {
    maxHeight: 200, // Limit vertical space for the table body
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
  boldCell: {
    fontWeight: "bold",
  },
});

export default Division;
