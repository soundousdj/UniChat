import React from "react";
import { Pressable, Text, StyleSheet, Platform } from "react-native";

export default function ActionButton({ label, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && { transform: [{ translateY: 2 }] },
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const PRIMARY = "#450693";
const LIGHT = "#C6B6DA";

const styles = StyleSheet.create({
  button: {
    width: "75%",
    paddingVertical: 18,
    backgroundColor: "#C6B6DA", // اللون الفاتح للخلفية
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#450693", // اللون الداكن للإطار
    marginVertical: 16,
    alignItems: "center",

    // تعديل خصائص الظل
    shadowColor: "#450693", // استخدام اللون الداكن للظل
    shadowOffset: {
      width: 0,
      height: 9, // زيادة الارتفاع لإنشاء ظل سفلي بارز
    },
    shadowOpacity: 0.8, // زيادة الشفافية لجعل الظل أكثر وضوحًا
    shadowRadius: 8,
    elevation: 8, // تحسين الظل على Android
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
});