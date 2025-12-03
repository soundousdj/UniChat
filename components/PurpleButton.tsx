// components/PurpleButton.tsx
import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface PurpleButtonProps {
  label: string;
  onPress: () => void;
}

export default function PurpleButton({ label, onPress }: PurpleButtonProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
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
    marginVertical: 20, // مسافة علوية وسفلية لفصل الزر عن العناصر الأخرى
  },
  button: {
    width: width * 0.35, // عرض الزر 85% من الشاشة
    paddingVertical: 18,
    backgroundColor: PRIMARY,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    // خصائص الظل
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