import AsyncStorage from '@react-native-async-storage/async-storage';

// إذا كنت تستخدم محاكي أندرويد استبدل localhost بـ 10.0.2.2
const API_URL = 'http://192.168.1.4:5000/api/auth'; 

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // حفظ البيانات في ذاكرة الهاتف
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userRole', data.role); 
      await AsyncStorage.setItem('userName', data.username);
      return data;
    } else {
      throw new Error(data.message || 'خطأ في تسجيل الدخول');
    }
  } catch (error: any) {
    console.error("Login Error:", error.message);
    throw error;
  }
};