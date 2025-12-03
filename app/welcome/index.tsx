// app/welcome/index.tsx
import React from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import TopHeader from "../../components/TopHeader";
import ActionButton from "@/components/ActionButton";
import BottomWave from "../../components/BottomWave";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");
const STATUS = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <BottomWave />
        <View style={styles.inner}>
          <TopHeader />

          <View style={styles.buttons}>
            <ActionButton
              label="Log in now"
              onPress={() => router.push("/login")}
            />
            <ActionButton
              label="Create Account"
              onPress={() => router.push("/register")}
            />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  inner: {
    width: "100%",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  buttons: {
    marginTop: 60,
    width: "100%",
    alignItems: "center",
    paddingBottom: 160,
  },
});




