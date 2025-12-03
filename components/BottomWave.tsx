import React, { useEffect, useState } from "react";
import { View, StyleSheet, Keyboard, Platform, Dimensions } from "react-native";
import Svg, { Rect, Defs, ClipPath, G } from "react-native-svg";

// نستخدم أبعاد ثابتة (Reference Dimensions) بناءً على الشكل الذي أعجبك
// هذا يضمن أن الرسمة الداخلية لا تتغير حساباتها أبداً مهما كبرت الشاشة
const DESIGN_WIDTH = 360;
const DESIGN_HEIGHT = 470;

const DARK_PURPLE = "#450693";
const LIGHT_PURPLE = "#C6B6DA";

export default function BottomWave() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // تحسين المستمعات لتكون أسرع ما يمكن
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardShowListener = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  // إذا كان الكيبورد ظاهراً، نخفي المكون فوراً
  if (isKeyboardVisible) {
    return null; 
  }

  return (
    <View style={styles.wrap}>
      {/* preserveAspectRatio="xMaxYMax slice":
         هذا السطر هو السحر. هو يقول للرسمة:
         1. xMaxYMax: ثبتي نفسك في الزاوية اليمين والسفلية (حيث يوجد القوس).
         2. slice: تمددي لتغطية الشاشة بالكامل، وقصي الزوائد إن وجدت، لكن لا تغيري شكل القوس.
      */}
      <Svg
        width="100%"
        height={DESIGN_HEIGHT}
        viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
        preserveAspectRatio="xMaxYMax slice"
      >
        <Defs>
          <ClipPath id="clipShape">
            <Rect
              x="0"
              y="100"
              width={DESIGN_WIDTH}
              height={DESIGN_HEIGHT - 50}
              rx="60"
              ry="60"
            />
          </ClipPath>
        </Defs>

        {/* نستخدم القيم الثابتة هنا بدلاً من W المتغير
           وبما أن الـ ViewBox ثابت، سيبقى الدوران 66 درجة بنفس المظهر تماماً
        */}
        <G transform={`rotate(66, ${DESIGN_WIDTH / 100}, ${DESIGN_HEIGHT}) translate(-20, -20)`}>
          {/* 1. الخلفية */}
          <Rect
            x="0"
            y="100"
            width={DESIGN_WIDTH}
            height={DESIGN_HEIGHT - 50}
            rx="60"
            ry="60"
            fill={LIGHT_PURPLE}
          />

          {/* 2. الظل الداخلي */}
          <Rect
            x="0"
            y="100"
            width={DESIGN_WIDTH}
            height={DESIGN_HEIGHT - 50}
            rx="60"
            ry="60"
            fill="none"
            stroke={DARK_PURPLE}
            strokeWidth={12} 
            strokeOpacity="0.25"
            clipPath="url(#clipShape)"
          />

          {/* 3. الإطار الخارجي */}
          <Rect
            x="0"
            y="100"
            width={DESIGN_WIDTH}
            height={DESIGN_HEIGHT - 50}
            rx="60"
            ry="60"
            fill="none"
            stroke={DARK_PURPLE}
            strokeWidth={3}
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
});