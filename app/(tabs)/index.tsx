import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react'; 
import { router } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import AnnouncementB from '../AnnouncementB';
import Announcement from '../announcement'; 

const PURPLE = '#450693';

export default function UniChatApp() {
  const [currentView, setCurrentView] = useState<'home' | 'contacts' | 'groups' | 'profile' | 'announcement'| 'announcements'>('home');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>({ name: '', avatar: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedName = await AsyncStorage.getItem('userName');
        const savedRole = await AsyncStorage.getItem('userRole');
        setRole(savedRole);
        setUser({
          name: savedName || 'User',
          avatar: `https://ui-avatars.com/api/?name=${savedName}&background=random`
        });

        const res = await fetch('http://192.168.1.4:5000/api/auth/all-users');
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        console.log("Error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={PURPLE} /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      
      {/* عرض المحتوى بناءً على الزر المضغوط */}
      {currentView === 'home' && (
        <View style={styles.container}>
          <View style={styles.mainHeader}>
            <Text style={styles.logo}>UniChat</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ marginRight: 15 }} onPress={() => setCurrentView('announcements')}>
                <Ionicons name="notifications-outline" size={26} color={PURPLE} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentView('profile')}>
                <Image source={{ uri: user.avatar }} style={styles.smallAvatarImg} />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput style={styles.searchInput} placeholder="Rechercher..." />

          <View style={styles.onlineContainer}>
            <Text style={styles.onlineTitle}>En ligne (Real Users)</Text>
            <FlatList
              data={users}
              horizontal
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.onlineUser}>
                  <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.username}&background=random` }} style={styles.onlineAvatar} />
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineName}>{item.username}</Text>
                </View>
              )}
            />
          </View>

          <Text style={styles.sectionTitle}>Messages</Text>
          <TouchableOpacity style={styles.chatItem}>
            <View style={styles.teamAvatar}><Ionicons name="people" size={25} color={PURPLE} /></View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.teamName}>General University Group</Text>
              <Text style={{color: '#888', fontSize: 12}}>Welcome back, {user.name}</Text>
            </View>
          </TouchableOpacity>

          {/* زر الـ (+) العائم - يظهر للأستاذ فقط ويفتح صفحة الإعلان */}
          {role === 'teacher' && (
            <TouchableOpacity 
              style={styles.floatingAddBtn} 
              onPress={() => setCurrentView('announcement')}
            >
              <Ionicons name="add" size={35} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* تنقل الصفحات */}
      {currentView === 'announcements' && <AnnouncementB onBack={() => setCurrentView('home')} />}
      {currentView === 'announcement' && <Announcement onBack={() => setCurrentView('home')} />}
      {currentView === 'contacts' && <View style={styles.center}><Text>Contacts List (Real Data)</Text></View>}

      {/* شريط التنقل السفلي (المصلح ليعرض 3 أيقونات) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('home')}>
          <Ionicons name="home" size={26} color={currentView === 'home' ? PURPLE : '#AAA'} />
          <Text style={{color: currentView === 'home' ? PURPLE : '#AAA', fontSize: 10}}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('contacts')}>
          <Ionicons name="people" size={26} color={currentView === 'contacts' ? PURPLE : '#AAA'} />
          <Text style={{color: currentView === 'contacts' ? PURPLE : '#AAA', fontSize: 10}}>Contacts</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('groups')}>
          <Ionicons name="chatbubbles" size={26} color={currentView === 'groups' ? PURPLE : '#AAA'} />
          <Text style={{color: currentView === 'groups' ? PURPLE : '#AAA', fontSize: 10}}>Groups</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, paddingTop: 50 },
  mainHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  logo: { fontSize: 28, fontWeight: 'bold', color: PURPLE },
  smallAvatarImg: { width: 40, height: 40, borderRadius: 20 },
  searchInput: { backgroundColor: '#F5F5F5', margin: 20, padding: 15, borderRadius: 20 },
  onlineContainer: { marginTop: 10 },
  onlineTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 15 },
  onlineUser: { alignItems: 'center', marginLeft: 20 },
  onlineAvatar: { width: 60, height: 60, borderRadius: 30 },
  onlineDot: { position: 'absolute', right: 5, bottom: 20, width: 12, height: 12, borderRadius: 6, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFF' },
  onlineName: { marginTop: 5, fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 30, marginBottom: 15 },
  chatItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 15, backgroundColor: '#F8F9FA', borderRadius: 15 },
  teamAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' },
  teamName: { marginLeft: 15, fontSize: 16, fontWeight: '600' },
  floatingAddBtn: { position: 'absolute', bottom: 100, right: 25, backgroundColor: PURPLE, width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  bottomNav: { position: 'absolute', bottom: 0, width: '100%', height: 70, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF' },
  navItem: { alignItems: 'center' }
});