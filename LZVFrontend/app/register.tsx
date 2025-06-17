import { useNavigation, NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRegisterUserMutation } from "@/api/apiSlice";
import { Button } from "../components/atoms/button";
import { InputField } from "../components/atoms/inputfield";

type RootStackParamList = {
  login: undefined;
  register: undefined;
};

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Please confirm your password"),
});

const RegisterScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [registerUser] = useRegisterUserMutation();

  const handleRegister = async (values: any) => {
    setIsLoading(true);
    const result = await registerUser(values);
    setIsLoading(false);

    if ("data" in result) {
      Alert.alert("Success", result.data.message);
      navigation.navigate("login");
    } else {
      const errorMessage =
        "error" in result && "data" in result.error
          ? (result.error.data as { message: string }).message
          : "Registration failed.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          password_confirmation: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
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
            {/* Only show errors if the user has tried to submit at least once */}
            {submitCount > 0 && (
              <View style={styles.errorContainer}>
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
              placeholder="First Name"
              value={values.first_name}
              onChangeText={handleChange("first_name")}
              onBlur={handleBlur("first_name")}
              hasError={
                submitCount > 0 && touched.first_name && !!errors.first_name
              }
            />
            <InputField
              placeholder="Last Name"
              value={values.last_name}
              onChangeText={handleChange("last_name")}
              onBlur={handleBlur("last_name")}
              hasError={
                submitCount > 0 && touched.last_name && !!errors.last_name
              }
            />
            <InputField
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              keyboardType="email-address"
              autoCapitalize="none"
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
            <InputField
              placeholder="Confirm Password"
              secureTextEntry
              value={values.password_confirmation}
              onChangeText={handleChange("password_confirmation")}
              onBlur={handleBlur("password_confirmation")}
              hasError={
                submitCount > 0 &&
                touched.password_confirmation &&
                !!errors.password_confirmation
              }
            />

            <View style={styles.buttonContainer}>
              <Button
                title={isLoading ? "Registering..." : "Register"}
                onPress={handleSubmit}
                disabled={isLoading}
                style={{ width: "30%" }}
              />
              <Text
                style={styles.loginText}
                onPress={() => navigation.navigate("login")}
              >
                Already have an account? Login
              </Text>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default RegisterScreen;

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
  errorContainer: {
    backgroundColor: "#ffe0e0",
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    marginLeft: 16,
    color: "blue",
    fontSize: 14,
  },
});
