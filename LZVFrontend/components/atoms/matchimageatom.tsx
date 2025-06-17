import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "@/components/atoms/button";
import {
  useGetMatchImagesQuery,
  useUploadMatchImageMutation,
} from "@/api/apiSlice";

interface MatchImageAtomProps {
  matchId: number;
  isLoggedIn: boolean;
}

export function MatchImageAtom({ matchId, isLoggedIn }: MatchImageAtomProps) {
  const [permissionResponse, requestPermission] =
    ImagePicker.useCameraPermissions();

  const {
    data: images = [],
    isLoading: isImagesLoading,
    refetch: refetchImages,
  } = useGetMatchImagesQuery(matchId);

  const [uploadMatchImage, { isLoading: isUploading }] =
    useUploadMatchImageMutation();

  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (!permissionResponse?.granted) {
      requestPermission();
    }
  }, [permissionResponse]);

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        setPreviewUri(photo.uri);
        await uploadImage(photo.uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Something went wrong while taking a picture.");
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        setPreviewUri(photo.uri);
        await uploadImage(photo.uri);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      setUploadError("Something went wrong while picking an image");
      Alert.alert("Error", "Something went wrong while picking an image.");
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const filename = uri.split("/").pop() || `photo-${Date.now()}.jpg`;
      const matchImage = {
        uri,
        name: filename,
        type: "image/jpg",
      };

      await uploadMatchImage({
        matchId,
        photo: matchImage,
      }).unwrap();

      Alert.alert("Success", "Image uploaded successfully!");
      setUploadError(null);
      refetchImages();
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(error?.data?.message || "Failed to upload image.");
      Alert.alert(
        "Upload Error",
        error?.data?.message || "Failed to upload image."
      );
    }
  };

  return (
    <View style={styles.container}>
      {isLoggedIn && (
        <View style={styles.buttonRow}>
          <Button
            title="Take a Picture"
            onPress={handleTakePhoto}
            disabled={isUploading}
          />
          <Button
            title="Upload from Gallery"
            onPress={handlePickImage}
            disabled={isUploading}
          />
        </View>
      )}

      {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

      {previewUri && (
        <Image source={{ uri: previewUri }} style={styles.previewImage} />
      )}

      {/* Always display uploaded images */}
      <View style={styles.uploadedSection}>
        <ScrollView horizontal contentContainerStyle={styles.imageScroll}>
          {isImagesLoading ? (
            <Text>Loading images...</Text>
          ) : (
            images.map((img: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageUri(img.url)}
              >
                <Image source={{ uri: img.url }} style={styles.uploadedImage} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <Modal
        visible={!!selectedImageUri}
        transparent={false}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          {selectedImageUri && (
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
          <Button title="Close" onPress={() => setSelectedImageUri(null)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginTop: 10,
    resizeMode: "contain",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  uploadedSection: {
    height: 120,
  },
  imageScroll: {
    alignItems: "center",
    paddingHorizontal: 5,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    borderRadius: 8,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "80%",
  },
});
