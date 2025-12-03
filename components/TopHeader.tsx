// components/TopHeader.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const PRIMARY = "#450693";

// الكلمة التي نريد كتابتها بعد الحرف U
const TARGET = "niChat"; // لاحظ: U ثابت خارج الأنيميشن

export default function TopHeader() {
  const [current, setCurrent] = useState("");
  const [direction, setDirection] = useState<"typing" | "deleting">("typing");

  useEffect(() => {
    const interval = setInterval(() => {
      if (direction === "typing") {
        // نضيف حرف
        const next = TARGET.slice(0, current.length + 1);
        setCurrent(next);

        // عند الوصول للنهاية نغيّر الاتجاه
        if (next.length === TARGET.length) {
          setDirection("deleting");
        }
      } else {
        // حذف حرف
        const next = current.slice(0, -1);
        setCurrent(next);

        // إذا عدنا للحرف الأول فقط
        if (next.length === 0) {
          setDirection("typing");
        }
      }
    }, 170); // سرعة الكتابة

    return () => clearInterval(interval);
  }, [current, direction]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <Text style={styles.toLine}>
        <Text style={styles.toText}>to </Text>

        {/* U ثابت */}
        <Text style={styles.brandText}>U</Text>

        {/* النص المتغير */}
        <Text style={styles.brandText}>{current}</Text>
      </Text>

      <Text style={styles.subtitle}>where your campus connects</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 56,
    color: PRIMARY,
    fontWeight: "800",
    fontFamily: "InkNutAntiqua-Bold",
    lineHeight: 62,
    marginBottom: 20,
  },
  toLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  toText: {
    fontSize: 18,
    color: "#222",
    fontWeight: "700",
  },
  brandText: {
    fontSize: 22,
    color: PRIMARY,
    fontWeight: "800",
  },
  subtitle: {
    
    marginTop: 10,
    fontSize: 18,
    color: "#222",
    fontWeight: "700",
  },
});