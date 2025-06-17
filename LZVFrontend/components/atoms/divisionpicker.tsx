import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

type Region = {
  id: number;
  name: string;
};

type Division = {
  id: number;
  name: string;
};

type RegionDivisionPickerProps = {
  regions: Region[];
  divisions: Division[];
  selectedRegion: Region | null;
  selectedDivision: Division | null;
  onRegionChange: (region: Region | null) => void;
  onDivisionChange: (division: Division | null) => void;
};

const RegionDivisionPicker = ({
  regions,
  divisions,
  selectedRegion,
  selectedDivision,
  onRegionChange,
  onDivisionChange,
}: RegionDivisionPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegionChange = (regionId: number) => {
    const region = regions.find((r) => r.id === regionId);
    onRegionChange(region || null);
  };

  const handleDivisionChange = (divisionId: number) => {
    const division = divisions.find((d) => d.id === divisionId);
    onDivisionChange(division || null);
  };

  return (
    <View>
      {/* Touchable that opens the modal */}
      <TouchableOpacity
        style={styles.container}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="tune" size={18} color="black" />
        <Text style={styles.text}>
          {selectedRegion?.name || "Select Region"} -{" "}
          {selectedDivision?.name || "Select Division"}
        </Text>
      </TouchableOpacity>

      {/* Modal for selecting region and division */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Region and Division</Text>

            <ScrollView>
              {/* Region Picker */}
              <Text style={styles.sectionTitle}>Regions</Text>
              {regions.map((region) => (
                <TouchableOpacity
                  key={region.id}
                  style={[
                    styles.option,
                    selectedRegion?.id === region.id && styles.selectedOption,
                  ]}
                  onPress={() => handleRegionChange(region.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedRegion?.id === region.id &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {region.name}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Division Picker */}
              <Text style={styles.sectionTitle}>Divisions</Text>
              {divisions.map((division) => (
                <TouchableOpacity
                  key={division.id}
                  style={[
                    styles.option,
                    selectedDivision?.id === division.id &&
                      styles.selectedOption,
                  ]}
                  onPress={() => handleDivisionChange(division.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedDivision?.id === division.id &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {division.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Done Button */}
            <Button title="Done" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  option: {
    padding: 12,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedOption: {
    backgroundColor: "#1A73E8",
    borderColor: "#1A73E8",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOptionText: {
    color: "white",
  },
});

export default RegionDivisionPicker;
