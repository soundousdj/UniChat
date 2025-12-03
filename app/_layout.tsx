// app/_layout.tsx
import React from "react";
import { Slot ,Stack } from "expo-router";

export default function RootLayout() {
  <Stack screenOptions={{ headerShown: false }} />

  return <Slot />;
}
