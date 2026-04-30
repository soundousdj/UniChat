import { Ionicons } from "@expo/vector-icons";
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
  Alert, // أضفنا Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // أضفنا هذا لتخزين البيانات
import BottomWave from "../../components/BottomWave";
import PurpleButton from "../../components/PurpleButton";

const STATUS = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function LoginScreen() {
  const router = useRouter();
  const [regNo, setRegNo] = useState(""); // ملاحظة: سنستخدم هذا كـ Email في الطلب
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false); // حالة التحميل

  // رابط الباك اند الخاص بك (تأكد من الـ IP)
  const API_URL = "http://192.168.1.4:5000/api/auth/login";

  const handleLogin = async () => {
  if (!regNo || !password) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: regNo.toLowerCase().trim(),
        password: password,
      }),
    });

    // 1. استلام البيانات مرة واحدة فقط
    const data = await response.json(); 

    if (response.ok) {
      // 2. الآن نقوم بحفظ البيانات بعد التأكد من أن الاستجابة ناجحة
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userRole', data.role);
      await AsyncStorage.setItem('userName', data.username); // حفظ الاسم الحقيقي
      await AsyncStorage.setItem('userEmail', data.email);    // حفظ الإيميل الحقيقي

      router.replace("/(tabs)"); 
    } else {
      Alert.alert("Login Failed", data.message || "Invalid credentials");
    }
  } catch (error) {
    Alert.alert("Error", "Could not connect to server.");
  } finally {
    setLoading(false);
  }
};

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

            {/* Registration Number (Email) */}
            <View style={styles.inputBox}>
              <Ionicons name="key-outline" size={ICON_SIZE} color={ICON_COLOR} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Registration number / Email"
                placeholderTextColor="#000000ff"
                value={regNo}
                onChangeText={setRegNo}
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={ICON_SIZE} color={ICON_COLOR} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#000000ff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
              />
              <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeBtn}>
                <Ionicons name={secure ? "eye-off-outline" : "eye-outline"} size={ICON_SIZE} color={ICON_COLOR} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => alert("Reset password flow")} style={styles.forgot}>
              <Text style={styles.forgotText}>Forgot password ?</Text>
            </TouchableOpacity>

            {/* تحديث الزر */}
            <PurpleButton
              label={loading ? "Logging in..." : "Login"}
              onPress={handleLogin}
              disabled={loading}
            />

            <TouchableOpacity onPress={() => router.push("/register")} style={styles.bottomTextWrap}>
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

// ... الستايلات تبقى كما هي دون أي تغيير ...
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
  icon: { marginRight: 12 },
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