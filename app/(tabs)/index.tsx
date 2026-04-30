import React, { useState, useEffect } from 'react';
import {
  Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator, Platform
} from 'react-native';
// يجب أن يكون هذا السطر موجوداً مرة واحدة فقط في الملف
import { Ionicons } from '@expo/vector-icons'; 
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// استيراد المكونات الأخرى (تأكد من صحة المسارات لديك)
import AnnouncementB from '../AnnouncementB';
import Announcement from '../announcement';
import ProfileSettings from '../profile';

const PURPLE = '#450693';

export default function UniChatApp() {
  const [currentView, setCurrentView] = useState<'home' | 'contacts' | 'groups' | 'profile' | 'announcement' | 'announcements'>('home');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadAppData = async () => {
      try {
        // جلب البيانات من التخزين المحلي
        const name = await AsyncStorage.getItem('userName');
        const userRole = await AsyncStorage.getItem('userRole');
        setUserName(name || 'User');
        setRole(userRole);

        // جلب قائمة المستخدمين من السيرفر
        // ملاحظة: تأكد من تشغيل الباك اند وأن الـ IP صحيح
        const res = await fetch('http://192.168.1.4:5000/api/auth/all-users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.log("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAppData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PURPLE} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      
      {currentView === 'home' && (
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.mainHeader}>
            <Text style={styles.logo}>UniChat</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* أيقونة الإشعارات */}
              <TouchableOpacity 
                style={{ marginRight: 20 }} 
                onPress={() => setCurrentView('announcements')}
              >
                <Ionicons name="notifications-outline" size={28} color={PURPLE} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>

              {/* أيقونة البروفايل - تم تصحيح المتغير هنا */}
              <TouchableOpacity onPress={() => setCurrentView('profile')}>
                <View style={styles.smallAvatarContainer}>
                  <Image 
                    source={{ uri: `https://ui-avatars.com/api/?name=${userName}&background=450693&color=fff` }} 
                    style={styles.avatarImage} 
                  />
                  {/* نقطة الحالة (Online) */}
                  <View style={styles.onlineStatusDot} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput style={styles.searchInput} placeholder="Rechercher..." />

          {/* En ligne (الأشخاص المتصلون) */}
          <View style={styles.onlineContainer}>
            <Text style={styles.onlineTitle}>En ligne</Text>
            <FlatList
              data={users}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.onlineUser}>
                  <View>
                    <Image 
                      source={{ uri: `https://ui-avatars.com/api/?name=${item.username}&background=random` }} 
                      style={styles.onlineAvatar} 
                    />
                    <View style={styles.statusDot} />
                  </View>
                  <Text style={styles.onlineName}>{item.username}</Text>
                </View>
              )}
            />
          </View>

          {/* Messages */}
          <Text style={styles.sectionTitle}>Messages</Text>
          <TouchableOpacity style={styles.chatItem} onPress={() => Alert.alert("Chat coming soon")}>
            <View style={styles.teamAvatar}>
                <Ionicons name="people" size={25} color={PURPLE} />
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.teamName}>General University Group</Text>
              <Text style={{color: '#888', fontSize: 12}}>Active now</Text>
            </View>
          </TouchableOpacity>

          {/* زر الإضافة العائم للمعلم فقط */}
          {role === 'teacher' && (
            <TouchableOpacity style={styles.floatingAddBtn} onPress={() => setCurrentView('announcement')}>
              <Ionicons name="add" size={35} color="white" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* منطق عرض الصفحات الأخرى */}
      {currentView === 'contacts' && (
        <View style={styles.container}>
          <Text style={styles.title}>University Contacts</Text>
          <ScrollView>
            {users.map(u => (
              <View key={u._id} style={styles.chatItem}>
                <Image source={{ uri: `https://ui-avatars.com/api/?name=${u.username}` }} style={styles.contactAvatar} />
                <Text style={{fontWeight: 'bold'}}>{u.username} ({u.role})</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      
      {currentView === 'announcements' && <AnnouncementB onBack={() => setCurrentView('home')} />}
      {currentView === 'announcement' && <Announcement onBack={() => setCurrentView('home')} />}
      {currentView === 'profile' && <ProfileSettings onBack={() => setCurrentView('home')} />}

      {/* Bottom Navigation */}
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
  container: { flex: 1, paddingTop: 50, backgroundColor: '#FFF' },
  
  // Header Styles
  mainHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    alignItems: 'center',
    marginBottom: 10
  },
  logo: { fontSize: 28, fontWeight: 'bold', color: PURPLE },
  
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white'
  },

  smallAvatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#eee',
    position: 'relative'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
  },
  onlineStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },

  searchInput: { 
    backgroundColor: '#F5F5F5', 
    marginHorizontal: 20, 
    marginVertical: 10,
    padding: 15, 
    borderRadius: 25 
  },
  
  onlineContainer: { marginTop: 10 },
  onlineTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 15 },
  onlineUser: { alignItems: 'center', marginLeft: 20 },
  onlineAvatar: { width: 65, height: 65, borderRadius: 32.5 },
  statusDot: { 
    position: 'absolute', 
    bottom: 5, 
    right: 2, 
    width: 15, 
    height: 15, 
    borderRadius: 7.5, 
    backgroundColor: '#4CAF50', 
    borderWidth: 2, 
    borderColor: '#FFF' 
  },
  onlineName: { marginTop: 5, fontSize: 12, fontWeight: '500' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 30, marginBottom: 15 },
  chatItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 20, 
    padding: 15, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 20, 
    marginBottom: 10 
  },
  teamAvatar: { 
    width: 55, 
    height: 55, 
    borderRadius: 27.5, 
    backgroundColor: '#E1D5F5', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  teamName: { fontSize: 16, fontWeight: 'bold' },

  floatingAddBtn: { 
    position: 'absolute', 
    bottom: 100, 
    right: 25, 
    backgroundColor: PURPLE, 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },

  bottomNav: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: 75, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#EEE', 
    backgroundColor: '#FFF', 
    paddingBottom: 15 
  },
  navItem: { alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: PURPLE },
  contactAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 }
});