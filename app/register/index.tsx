// app/register/index.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // 1. استدعاء المكتبة
import PurpleButton from "../../components/PurpleButton";
import BottomWave from "../../components/BottomWave";

const STATUS = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function RegisterScreen() {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);

  // لون الأيقونة
  const ICON_COLOR = "#000000ff"; 
  const ICON_SIZE = 22;

  return (
    <SafeAreaView style={styles.page}>
      <View style={[styles.container, { paddingTop: STATUS + 20 }]}>
        <BottomWave />

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <Text style={styles.pageTitle}>Sign up</Text>
            <Text style={styles.pageSub}>Please fill in your details</Text>

            {/* Registration Number */}
            <View style={styles.inputBox}>
              <Ionicons name="key-outline" size={ICON_SIZE} color={ICON_COLOR} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Registration number"
                placeholderTextColor="#000000ff"
                value={regNo}
                onChangeText={setRegNo}
              />
            </View>

            {/* Email */}
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={ICON_SIZE} color={ICON_COLOR} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#000000ff"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={ICON_SIZE} color={ICON_COLOR} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#000000ff"
                value={pass}
                onChangeText={setPass}
                secureTextEntry={secure1}
              />
              <TouchableOpacity
                onPress={() => setSecure1(!secure1)}
                style={styles.eyeBtn}
              >
                <Ionicons 
                  name={secure1 ? "eye-off-outline" : "eye-outline"} 
                  size={ICON_SIZE} 
                  color={ICON_COLOR} 
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={ICON_SIZE} color={ICON_COLOR} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor="#000000ff"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={secure2}
              />
              <TouchableOpacity
                onPress={() => setSecure2(!secure2)}
                style={styles.eyeBtn}
              >
                <Ionicons 
                  name={secure2 ? "eye-off-outline" : "eye-outline"} 
                  size={ICON_SIZE} 
                  color={ICON_COLOR} 
                />
              </TouchableOpacity>
            </View>

            <PurpleButton
              label="Sign up"
              onPress={() => alert("Sign up pressed")}
            />

            <TouchableOpacity
              onPress={() => router.push("/login")}
              style={styles.bottomTextWrap}
            >
              <Text style={styles.bottomText}>
                Already have an account?{" "}
                <Text style={styles.link}>Log in now</Text>
              </Text>
            </TouchableOpacity>

            <View style={{ height: 60 }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = "#450693";
const LIGHT = "#C6B6DA";

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, width: "100%" },
  scrollContent: { flexGrow: 1 },
  inner: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontSize: 42,
    color: PRIMARY,
    fontWeight: "700",
    fontFamily: "InkNutAntiqua-Bold",
    lineHeight: 56,
    marginBottom: 10,
    textAlign: "center",
  },
  pageSub: {
    marginTop: 0,
    fontSize: 18,
    fontFamily: "InkNutAntiqua-Bold",
    color: "#000000ff",
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  inputBox: {
    width: "100%",
    backgroundColor: LIGHT,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: PRIMARY,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: { marginRight: 12 }, // تم حذف fontSize لأن الأيقونة لها prop size
  input: { flex: 1, fontSize: 16, color: "#000", padding: 0 },
  eyeBtn: { paddingHorizontal: 6 },
  bottomTextWrap: { marginTop: 10, alignItems: "center" },
  bottomText: { color: "#000000ff", fontSize: 15, fontWeight:"500" },
  link: { color: "#D62B2B", fontWeight: "700" },
});