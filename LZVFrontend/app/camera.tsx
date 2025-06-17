import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";

export default function Camera() {
  const params = useLocalSearchParams();
  const matchId = params.matchId; // Pass this to identify the match

  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          console.log("Photo taken:", photo.uri);

          // Use router.back() and pass data in route params
          router.replace({
            pathname: "/matchdetails", // <-- Adjust to your actual route
            params: {
              matchId: matchId,
              capturedPhotoUri: photo.uri, // We'll read this in MatchImageAtom
            },
          });
        }
      } catch (e) {
        console.error("Error taking photo", e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
