// app/login/index.tsx
import { Ionicons } from "@expo/vector-icons"; // استدعاء المكتبة
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomWave from "../../components/BottomWave";
import PurpleButton from "../../components/PurpleButton";

const STATUS = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function LoginScreen() {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

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
            <Text style={styles.pageTitle}>Log in</Text>
            <Text style={styles.pageSub}>Log in to access your account</Text>

            {/* Registration Number */}
            <View style={styles.inputBox}>
              <Ionicons
                name="key-outline"
                size={ICON_SIZE}
                color={ICON_COLOR}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Registration number"
                placeholderTextColor="#000000ff"
                value={regNo}
                onChangeText={setRegNo}
                keyboardType="default"
              />
            </View>

            {/* Password */}
            <View style={styles.inputBox}>
              <Ionicons
                name="lock-closed-outline"
                size={ICON_SIZE}
                color={ICON_COLOR}
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#000000ff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
              />
              <TouchableOpacity
                onPress={() => setSecure(!secure)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={ICON_SIZE}
                  color={ICON_COLOR}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => alert("Reset password flow")}
              style={styles.forgot}
            >
              <Text style={styles.forgotText}>Forgot password ?</Text>
            </TouchableOpacity>
            <PurpleButton
  label="Login"
  onPress={() => {
    // هنا يمكنك إضافة منطق التحقق من البيانات مستقبلاً
    if (regNo && password) {
      router.replace("/(tabs)"); 
    } else {
      alert("Please fill in all fields");
    }
  }}
/>
            <TouchableOpacity
              onPress={() => router.push("/register")}
              style={styles.bottomTextWrap}
            >
              <Text style={styles.bottomText}>
                Don’t have an account? <Text style={styles.link}>Sign up</Text>
              </Text>
            </TouchableOpacity>

            <View style={{ height: 60 }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// نفس الستايلات السابقة
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
    paddingTop: 30,
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
    color: "#000000ff",
    fontFamily: "InkNutAntiqua-Bold",
    fontWeight: "600",
    marginBottom: 40,
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
    marginBottom: 20,
    shadowColor: PRIMARY,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: { marginRight: 12 }, // تم التعديل هنا لإزالة fontSize
  input: { flex: 1, fontSize: 16, color: "#000", padding: 0 },
  eyeBtn: { paddingHorizontal: 6 },
  forgot: { width: "100%", alignItems: "flex-end", marginBottom: 10 },
  forgotText: {
    color: PRIMARY,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  bottomTextWrap: { marginTop: 10, alignItems: "center" },
  bottomText: { color: "#000000ff", fontSize: 15, fontWeight: "500" },
  link: { color: "#D62B2B", fontWeight: "700" },
});
