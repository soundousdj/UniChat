import React, { useState, useEffect } from 'react';
import {
  Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

// استيراد المكونات الأخرى
import AnnouncementB from '../AnnouncementB';
import Announcement from '../announcement';
import ProfileSettings from '../profile';

const PURPLE = '#450693';

export default function UniChatApp() {
  // --- 1. الحالات (States) ---
  const [currentView, setCurrentView] = useState<'home' | 'contacts' | 'groups' | 'profile' | 'announcement' | 'announcements'>('home');
  const [selectedUser, setSelectedUser] = useState<any>(null); // المستخدم أو المجموعة المختارة
  const [activeChatType, setActiveChatType] = useState<'user' | 'group'>('user'); 
  const [messages, setMessages] = useState<any[]>([]); 
  const [newMessage, setNewMessage] = useState(''); 
  const [groups, setGroups] = useState<any[]>([]); 
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  // --- 2. جلب البيانات الأساسية (المستخدمين والمجموعات) ---
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const userRole = await AsyncStorage.getItem('userRole');
        setUserName(name || 'User');
        setRole(userRole);

        // جلب المستخدمين
        const usersRes = await fetch('http://192.168.1.4:5000/api/auth/all-users');
        const usersData = await usersRes.json();
        setUsers(usersData);

        // جلب المجموعات
        const groupsRes = await fetch('http://192.168.1.4:5000/api/groups/all');
        const groupsData = await groupsRes.json();
        setGroups(groupsData);

      } catch (error) {
        console.log("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAppData();
  }, []);

  // --- 3. وظائف المحادثة (إرسال واستقبال) ---
  
  // جلب الرسائل (فردية أو مجموعات)
  const fetchChatContent = async (id: string, type: 'user' | 'group') => {
    try {
      const myId = await AsyncStorage.getItem('userId');
      const url = type === 'user' 
        ? `http://192.168.1.4:5000/api/messages/${myId}/${id}`
        : `http://192.168.1.4:5000/api/groups/${id}/messages`;
      
      const res = await fetch(url);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  // إرسال رسالة
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const myId = await AsyncStorage.getItem('userId');
      const url = activeChatType === 'user' 
        ? 'http://192.168.1.4:5000/api/messages/send'
        : `http://192.168.1.4:5000/api/groups/${selectedUser._id}/send`;

      const body = activeChatType === 'user' 
        ? { sender: myId, recipient: selectedUser._id, text: newMessage }
        : { sender: myId, text: newMessage };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const savedMsg = await res.json();
      setMessages([...messages, savedMsg]);
      setNewMessage('');
    } catch (error) {
      Alert.alert("Error", "Message not sent");
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={PURPLE} /></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      
      {/* --- الشاشة أ: واجهة المحادثة المفتوحة --- */}
      {selectedUser ? (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.chatScreen}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setSelectedUser(null)}>
              <Ionicons name="arrow-back" size={28} color={PURPLE} />
            </TouchableOpacity>
            <Text style={styles.chatTitle}>{activeChatType === 'user' ? selectedUser.username : selectedUser.name}</Text>
            <View style={{ width: 28 }} />
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.sender === userName ? styles.myBubble : styles.theirBubble]}>
                {activeChatType === 'group' && item.sender !== userName && (
                  <Text style={styles.senderNameTag}>{item.senderName || 'Member'}</Text>
                )}
                <Text style={[styles.bubbleText, { color: item.sender === userName ? '#FFF' : '#000' }]}>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={{ padding: 15 }}
          />

          <View style={styles.inputArea}>
            <TextInput 
              style={styles.msgInput} 
              placeholder="Type a message..." 
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="send" size={28} color={PURPLE} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        /* --- الشاشة ب: التبويبات الرئيسية --- */
        <>
          {/* 1. واجهة HOME */}
          {currentView === 'home' && (
            <View style={styles.container}>
              <View style={styles.mainHeader}>
                <Text style={styles.logo}>UniChat</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity style={{ marginRight: 20 }} onPress={() => setCurrentView('announcements')}>
                    <Ionicons name="notifications-outline" size={28} color={PURPLE} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setCurrentView('profile')}>
                    <View style={styles.smallAvatarContainer}>
                      <Image source={{ uri: `https://ui-avatars.com/api/?name=${userName}&background=450693&color=fff` }} style={styles.avatarImage} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput style={styles.searchInput} placeholder="Rechercher..." />
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.onlineContainer}>
                  <Text style={styles.onlineTitle}>En ligne</Text>
                  <FlatList
                    data={users}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.onlineUser}>
                        <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.username}&background=random` }} style={styles.onlineAvatar} />
                        <View style={styles.statusDot} />
                        <Text style={styles.onlineName}>{item.username}</Text>
                      </View>
                    )}
                  />
                </View>

                <Text style={styles.sectionTitle}>Recent Chats</Text>
                {users.map((item) => (
                  <TouchableOpacity key={item._id} style={styles.chatItem} onPress={() => { setSelectedUser(item); setActiveChatType('user'); fetchChatContent(item._id, 'user'); }}>
                    <Image source={{ uri: `https://ui-avatars.com/api/?name=${item.username}&background=random` }} style={styles.messageAvatar} />
                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={styles.userNameText}>{item.username}</Text>
                      <Text style={styles.lastMsgText}>Click to chat...</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 2. واجهة CONTACTS (بيانات حقيقية) */}
          {currentView === 'contacts' && (
            <View style={styles.container}>
              <Text style={styles.title}>University Contacts</Text>
              <ScrollView>
                {users.map(u => (
                  <TouchableOpacity key={u._id} style={styles.chatItem} onPress={() => { setSelectedUser(u); setActiveChatType('user'); fetchChatContent(u._id, 'user'); }}>
                    <Image source={{ uri: `https://ui-avatars.com/api/?name=${u.username}` }} style={styles.contactAvatar} />
                    <View>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>{u.username}</Text>
                        <Text style={{color: '#888'}}>{u.role}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 3. واجهة GROUPS (مجموعات حقيقية) */}
          {currentView === 'groups' && (
            <View style={styles.container}>
              <Text style={styles.title}>Groups</Text>
              <ScrollView>
                {groups.map(g => (
                  <TouchableOpacity key={g._id} style={styles.chatItem} onPress={() => { setSelectedUser(g); setActiveChatType('group'); fetchChatContent(g._id, 'group'); }}>
                    <View style={styles.groupIconBox}><Ionicons name="people" size={30} color={PURPLE} /></View>
                    <View style={{marginLeft: 15}}>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>{g.name}</Text>
                        <Text style={{color: '#888'}}>Community group</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          
          {/* التبويبات الأخرى */}
          {currentView === 'announcements' && <AnnouncementB onBack={() => setCurrentView('home')} />}
          {currentView === 'announcement' && <Announcement onBack={() => setCurrentView('home')} />}
          {currentView === 'profile' && <ProfileSettings onBack={() => setCurrentView('home')} />}

          {/* شريط التنقل السفلي */}
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, paddingTop: 50, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: PURPLE },
  mainHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 10 },
  logo: { fontSize: 28, fontWeight: 'bold', color: PURPLE },
  smallAvatarContainer: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden' },
  avatarImage: { width: '100%', height: '100%' },
  searchInput: { backgroundColor: '#F5F5F5', marginHorizontal: 20, marginVertical: 10, padding: 15, borderRadius: 25 },
  onlineContainer: { marginTop: 10 },
  onlineTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 15 },
  onlineUser: { alignItems: 'center', marginLeft: 20 },
  onlineAvatar: { width: 65, height: 65, borderRadius: 32.5 },
  statusDot: { position: 'absolute', bottom: 20, right: 2, width: 15, height: 15, borderRadius: 7.5, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFF' },
  onlineName: { marginTop: 5, fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginTop: 10 },
  chatItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  messageAvatar: { width: 55, height: 55, borderRadius: 27.5 },
  contactAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  groupIconBox: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#E1D5F5', justifyContent: 'center', alignItems: 'center' },
  userNameText: { fontSize: 16, fontWeight: 'bold' },
  lastMsgText: { fontSize: 14, color: '#666' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 75, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF' },
  navItem: { alignItems: 'center' },
  // Chat Styles
  chatScreen: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 40 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  chatTitle: { fontSize: 18, fontWeight: 'bold' },
  bubble: { padding: 12, borderRadius: 18, marginVertical: 4, maxWidth: '80%' },
  myBubble: { alignSelf: 'flex-end', backgroundColor: PURPLE },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: '#FFF' },
  senderNameTag: { fontWeight: 'bold', fontSize: 11, color: PURPLE, marginBottom: 2 },
  bubbleText: { fontSize: 15 },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE' },
  msgInput: { flex: 1, backgroundColor: '#F0F0F0', borderRadius: 25, paddingHorizontal: 15, height: 45, marginRight: 10 },
});