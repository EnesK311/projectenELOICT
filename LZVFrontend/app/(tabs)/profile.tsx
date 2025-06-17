import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useCheckLoginQuery } from "../../api/apiSlice";
import { clearUser } from "../../features/auth/authSlice";
import LoginScreen from "../login";
import ProfileDetails from "../profiledetails";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { error } = useCheckLoginQuery(undefined, {
    skip: !isLoggedIn,
  });

  useEffect(() => {
    console.log("inside useEffect");
    if (error && "status" in error && error.status === 401) {
      // Clear user if the token is invalid
      dispatch(clearUser());
    }
  }, [error, dispatch]);

  return (
    <View style={styles.container}>
      {isLoggedIn ? <ProfileDetails /> : <LoginScreen />}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
