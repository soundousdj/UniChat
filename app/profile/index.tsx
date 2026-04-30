import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, Image, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PURPLE = '#450693';

export default function ProfileSettings({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await fetch('http://192.168.1.4:5000/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (res.ok) {
          setUser(data);
        } else {
          // إذا فشل الـ fetch، نأخذ البيانات المخزنة محلياً كخطة بديلة
          const name = await AsyncStorage.getItem('userName');
          const email = await AsyncStorage.getItem('userEmail');
          const role = await AsyncStorage.getItem('userRole');
          setUser({ username: name, email: email, role: role });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear(); 
    router.replace('/login');
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={PURPLE} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={{width: 28}} />
      </View>

      <View style={styles.content}>
        {/* Avatar with Camera Icon like Design */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
             <Image 
               source={{ uri: `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random&size=200` }} 
               style={styles.avatarImage} 
             />
             <TouchableOpacity style={styles.cameraBtn}>
                <Ionicons name="camera" size={20} color="white" />
             </TouchableOpacity>
          </View>
        </View>

        {/* Info Fields */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={user?.username} editable={false} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Academic Role</Text>
          <TextInput 
            style={styles.input} 
            value={user?.role === 'teacher' ? 'Computer Science Professor' : 'Computer Science Student'} 
            editable={false} 
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email (Read Only)</Text>
          <TextInput style={styles.input} value={user?.email} editable={false} />
        </View>

        {/* Buttons */}
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 25 },
  avatarWrapper: { alignItems: 'center', marginBottom: 40 },
  avatarCircle: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, borderColor: PURPLE, padding: 3, position: 'relative' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 65 },
  cameraBtn: { position: 'absolute', bottom: 5, right: 5, backgroundColor: PURPLE, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500' },
  input: { backgroundColor: '#F8F9FA', padding: 16, borderRadius: 12, fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#EEE' },
  saveBtn: { backgroundColor: PURPLE, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 3 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { backgroundColor: '#FF3B30', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 15 },
  logoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});