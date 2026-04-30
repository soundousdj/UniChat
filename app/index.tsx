import { useState, useEffect } from 'react'; // أضفنا useState هنا
import { Redirect } from 'expo-router'; // حذفنا useRouter لأننا سنستخدم Redirect فقط
import AsyncStorage from '@react-native-async-storage/async-storage'; // أضفنا هذا السطر

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) setIsLoggedIn(true);
      setChecking(false);
    };
    checkStatus();
  }, []);

  if (checking) return null; // أو شاشة تحميل بسيطة

  // إذا كان مسجل دخول، اذهب للتبويبات، وإذا لا، اذهب لصفحة الترحيب
  return isLoggedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/welcome" />;
}