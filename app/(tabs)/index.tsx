import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react'; 
import { router } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform
} from 'react-native';

import AnnouncementB from '../AnnouncementB';
import Announcement from '../announcement'; 

const PURPLE = '#450693';

export default function UniChatApp() {
  const [showMenu, setShowMenu] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'contacts' | 'groups' | 'profile' | 'announcement'| 'announcements'>('home');
  const [loading, setLoading] = useState(true);

  // --- 1. الحالات الحقيقية ---
  const [contacts, setContacts] = useState<any[]>([]); // كل المستخدمين
  const [currentUser, setCurrentUser] = useState<any>({ name: '', email: '', role: '', avatar: '' });

  // --- 2. دالة جلب البيانات من الباك اند ---
  const loadData = async () => {
    try {
      // أ- جلب بياناتي من الذاكرة
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail');
      const role = await AsyncStorage.getItem('userRole');
      
      setCurrentUser({
        name: name || 'User',
        email: email || '',
        role: role || 'student',
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`
      });

      // ب- جلب كل المسجلين من السيرفر
      const response = await fetch('http://192.168.1.4:5000/api/auth/all-users');
      const allUsers = await response.json();
      if (Array.isArray(allUsers)) {
        setContacts(allUsers);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };
  // داخل دالة UniChatApp
const [role, setRole] = useState<string | null>(null);

useEffect(() => {
  const getRole = async () => {
    const savedRole = await AsyncStorage.getItem('userRole');
    setRole(savedRole);
  };
  getRole();
}, []);

// ... في جزء الـ Return ...
{/* زر الإضافة العائم يظهر للمعلم فقط */}
{role === 'teacher' && (
  <TouchableOpacity 
    style={styles.floatingAddBtn} 
    onPress={() => setCurrentView('announcement')} // يفتح صفحة New Announcement
  >
    <Ionicons name="add" size={30} color="white" />
  </TouchableOpacity>
)}
  useEffect(() => {
    loadData();
  }, []);

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/login');
      }}
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={PURPLE} /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      
      {/* 1. HOME SCREEN */}
      {currentView === 'home' && (
        <View style={styles.container}>
          <View style={styles.mainHeader}>
            <Text style={styles.logo}>UniChat</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ marginRight: 15 }} onPress={() => setCurrentView('announcements')}>
                <Ionicons name="notifications-outline" size={26} color={PURPLE} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentView('profile')}>
                <View style={styles.smallAvatar}>
                  <Image source={{ uri: currentUser.avatar }} style={styles.full} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput style={styles.searchInput} placeholder="Rechercher..." />

          <View style={styles.onlineContainer}>
            <Text style={styles.onlineTitle}>En ligne (Real Users)</Text>
            <FlatList
              data={contacts}
              horizontal
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.onlineUser}>
                  <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.username}&background=random` }} style={styles.onlineAvatar} />
                  <View style={styles.onlineDotUser} />
                  <Text style={styles.onlineName}>{item.username}</Text>
                </View>
              )}
            />
          </View>

          <Text style={[styles.sectionTitle, { marginLeft: 20, marginTop: 20 }]}>Messages</Text>
          <TouchableOpacity style={styles.chatItem}>
            <View style={styles.teamAvatar}><Ionicons name="people" size={25} color={PURPLE} /></View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.teamName}>General University Group</Text>
              <Text style={{color: '#888', fontSize: 12}}>Welcome back, {currentUser.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. CONTACTS SCREEN */}
      {currentView === 'contacts' && (
        <View style={styles.container}>
          <Text style={styles.title}>Contacts</Text>
          <Text style={styles.sectionTitle}>Registered Members ({contacts.length})</Text>
          <ScrollView>
            {contacts.map((item) => (
              <TouchableOpacity key={item._id} style={styles.chatItem}>
                <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.username}` }} style={styles.contactAvatar} />
                <View>
                   <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                   <Text style={{ fontSize: 12, color: '#888' }}>{item.role}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 3. PROFILE SCREEN */}
      {currentView === 'profile' && (
        <ScrollView style={styles.container}>
          <View style={styles.pHeader}>
            <TouchableOpacity onPress={() => setCurrentView('home')}><Ionicons name="arrow-back" size={26} color="black" /></TouchableOpacity>
            <Text style={styles.pTitle}>My Profile</Text>
          </View>
          <View style={styles.pAvatarContainer}>
            <Image source={{ uri: currentUser.avatar }} style={styles.largeAvatar} />
          </View>
          <View style={styles.pForm}>
            <Text style={styles.pLabel}>Name</Text>
            <TextInput style={styles.pInput} value={currentUser.name} editable={false} />
            <Text style={styles.pLabel}>Academic Role</Text>
            <TextInput style={styles.pInput} value={currentUser.role} editable={false} />
            <Text style={styles.pLabel}>Email</Text>
            <TextInput style={[styles.pInput, { color: '#999' }]} value={currentUser.email} editable={false} />
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* بقية الشاشات */}
      {currentView === 'announcements' && <AnnouncementB onBack={() => setCurrentView('home')} />}
      {currentView === 'announcement' && <Announcement onBack={() => setCurrentView('home')} />}

      {/* Floating Button */}
      {currentView === 'home' && (
        <TouchableOpacity style={styles.floatingAddBtn} onPress={() => setShowMenu(true)}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('home')}>
          <Ionicons name="home" size={24} color={currentView === 'home' ? PURPLE : '#666'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('contacts')}>
          <Ionicons name="people" size={24} color={currentView === 'contacts' ? PURPLE : '#666'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... الستايلات التي كانت في كودك (تأكد من وجودها جميعاً) ...
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50, paddingBottom: 80 },
  mainHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  logo: { fontSize: 26, fontWeight: 'bold', color: PURPLE },
  smallAvatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#F0F0FF', overflow: 'hidden' },
  full: { width: '100%', height: '100%' },
  onlineContainer: { marginTop: 20 },
  onlineTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 15 },
  onlineUser: { alignItems: 'center', marginHorizontal: 10 },
  onlineAvatar: { width: 60, height: 60, borderRadius: 30 },
  onlineDotUser: { position: 'absolute', bottom: 15, right: 5, width: 12, height: 12, borderRadius: 6, backgroundColor: 'green', borderWidth: 2, borderColor: '#fff' },
  onlineName: { marginTop: 5, fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginLeft: 20, color: '#333' },
  chatItem: { flexDirection: 'row', padding: 15, marginHorizontal: 20, backgroundColor: '#F9F9F9', borderRadius: 20, alignItems: 'center', marginBottom: 10 },
  teamAvatar: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#E0E0FF', justifyContent: 'center', alignItems: 'center' },
  teamName: { fontSize: 16, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%', height: 60, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center' },
  floatingAddBtn: { position: 'absolute', bottom: 80, right: 20, backgroundColor: PURPLE, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: PURPLE },
  searchInput: { borderWidth: 1, borderColor: '#CCC', padding: 12, borderRadius: 25, marginHorizontal: 20, marginVertical: 15, backgroundColor: '#F5F5F5' },
  contactAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  pHeader: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  pTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  pAvatarContainer: { alignSelf: 'center', marginVertical: 30 },
  largeAvatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: PURPLE },
  pForm: { padding: 20 },
  pLabel: { color: '#666', marginBottom: 8, fontSize: 14 },
  pInput: { backgroundColor: '#F8F8F8', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  logoutBtn: { backgroundColor: '#FF3B30', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10 }
});