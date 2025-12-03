// app/index.tsx
import { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import { Redirect } from "expo-router";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen onFinish={undefined} />;

  return <Redirect href="./welcome" />;
}
