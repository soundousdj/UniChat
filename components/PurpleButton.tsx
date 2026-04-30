import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// 1. تحديث الـ Interface ليقبل خاصية disabled
interface PurpleButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean; // أضفنا علامة الاستبعاد ليكون اختيارياً
}

export default function PurpleButton({ label, onPress, disabled }: PurpleButtonProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        disabled={disabled} // 2. ربط الخاصية بـ Pressable
        style={({ pressed }) => [
          styles.button,
          // 3. إضافة تأثير الشفافية عند التعطيل (Disabled) أو الضغط
          (pressed || disabled) && { transform: [{ scale: 0.98 }], opacity: 0.7 },
        ]}
      >
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </View>
  );
}

const PRIMARY = "#450693";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  button: {
    width: width * 0.35, 
    paddingVertical: 18,
    backgroundColor: PRIMARY,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 9,
  },
  text: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});