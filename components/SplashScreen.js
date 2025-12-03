// components/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen({ onFinish }) {
  // animated value for logo opacity
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // blinking animation: fade out -> fade in, loop
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.15,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();

    // optional: stop blinking and call onFinish after 3s (change as needed)
    const timer = setTimeout(() => {
      blink.stop();
      if (typeof onFinish === 'function') onFinish();
    }, 3000);

    return () => {
      clearTimeout(timer);
      blink.stop();
    };
  }, [opacity, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Animated.Image
        source={require("../assets/images/unichat.png")}
        style={[styles.logo, { opacity }]}
        resizeMode="contain"
      />
      <Text style={styles.title}>UniChat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,    
    height: 100,
   
  },
  title: {
    fontSize: 45,
    fontWeight: "700",
    color: '#450693',
  },
});