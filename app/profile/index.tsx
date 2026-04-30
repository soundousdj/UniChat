import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView,
  Image 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileSettings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        // جلب البيانات من الرابط الذي أنشأناه في الباك اند
        const res = await fetch('http://192.168.1.4:5000/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear(); // مسح جميع البيانات عند الخروج
    router.replace('/login');
  };

  if (loading) return <ActivityIndicator size="large" color="#450693" style={{flex:1}} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
           <Image 
             source={{ uri: `https://ui-avatars.com/api/?name=${user?.username}&background=random&size=150` }} 
             style={styles.avatar} 
           />
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={user?.username} editable={false} />

        <Text style={styles.label}>Bio</Text>
        <TextInput 
           style={styles.input} 
           value={user?.role === 'teacher' ? 'University Professor' : 'Computer Science Student'} 
           editable={false} 
        />

        <Text style={styles.label}>Email (Read Only)</Text>
        <TextInput style={styles.input} value={user?.email} editable={false} />

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWeight: 3, borderColor: '#450693' },
  label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 10, fontSize: 16, color: '#333' },
  saveBtn: { backgroundColor: '#450693', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { backgroundColor: '#FF3B30', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  logoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});