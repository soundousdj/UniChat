import { Tabs } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('userRole').then(setRole);
  }, []);

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#450693' }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color}/> }} />
      
      {/* إذا كان أستاذاً يظهر له تبويب الإدارة، إذا طالباً يختفي التبويب */}
      <Tabs.Screen 
        name="explore" 
        options={{ 
          title: 'Management',
          href: role === 'teacher' ? '/explore' : null, // القفل البرمجي
          tabBarIcon: ({color}) => <Ionicons name="stats-chart" size={24} color={color}/> 
        }} 
      />
    </Tabs>
  );
}