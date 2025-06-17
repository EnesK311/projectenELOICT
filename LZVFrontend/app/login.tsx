import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import { useLoginUserMutation } from "../api/apiSlice";
import { setUser } from "../features/auth/authSlice";
import { InputField } from "../components/atoms/inputfield";
import { Button } from "../components/atoms/button";

import logo from "../assets/images/logo.png";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const result = await loginUser(values).unwrap();
      setIsLoading(false);

      if (result.token && result.player) {
        const { player, token } = result;
        dispatch(setUser({ ...player, token }));
        if (player.role === "manager") {
          Alert.alert(
            "Verify Your Email",
            "You are registered. Please verify your email before accessing manager features."
          );
        } else {
          Alert.alert("Success", "Login successful!");
          router.push("/");
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert(
        "Error",
        error?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image} />
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
        validateOnChange={false} // Disable validation on change
        validateOnBlur={false} // Disable validation on blur
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          submitCount,
        }) => (
          <>
            {/* Only show error container if the user has tried to submit at least once */}
            {submitCount > 0 && (
              <View style={styles.errorcontainer}>
                {Object.values(errors).map(
                  (error, i) =>
                    error && (
                      <Text key={i} style={styles.errorText}>
                        {error}
                      </Text>
                    )
                )}
              </View>
            )}

            <InputField
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              keyboardType="email-address"
              autoCapitalize="none"
              // hasError is optional now since we hide errors until submit
              hasError={submitCount > 0 && touched.email && !!errors.email}
            />
            <InputField
              placeholder="Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              hasError={
                submitCount > 0 && touched.password && !!errors.password
              }
            />

            <View style={styles.buttonContainer}>
              <Button
                title={isLoading ? "Logging in..." : "Login"}
                onPress={handleSubmit}
                disabled={isLoading}
                style={{ width: "30%" }}
              />
              <Text
                style={styles.registerText}
                onPress={() => router.push("/register")}
              >
                Don't have an account? Register
              </Text>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 8,
  },
  errorcontainer: {
    backgroundColor: "#ffe0e0",
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    marginLeft: 16,
    color: "blue",
    fontSize: 14,
  },
  image: {
    alignSelf: "center",
    marginBottom: 16,
  },
});
