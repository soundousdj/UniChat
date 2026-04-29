import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { router } from 'expo-router'; 
// تأكد من أن مسار الملف صحيح لصفحتك الجاهزة
import AnnouncementB from '../AnnouncementB';
import Announcement from '../announcement'; 

import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const PURPLE = '#450693';

interface User {
  id: string;
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
}

interface Group {
  id: string;
  name: string;
  members: string[];
  avatar?: string;
}

export default function UniChatApp() {
  // --- States ---
  // تم إضافة 'announcements' هنا
  const [showMenu, setShowMenu] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'contacts' | 'groups' | 'chat' | 'profile' | 'announcement'| 'announcements'>('home');
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [contacts, setContacts] = useState<User[]>([
    { id: '1', name: 'Karim', avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: '2', name: 'Sofia', avatar: 'https://i.pravatar.cc/100?img=2' },
    { id: '3', name: 'Ali', avatar: 'https://i.pravatar.cc/100?img=3' },
    { id: '4', name: 'Nina', avatar: 'https://i.pravatar.cc/100?img=4' },
    { id: '5', name: 'Leo', avatar: 'https://i.pravatar.cc/100?img=5' },
  ]);
  const [groups, setGroups] = useState<Group[]>([{ id: '1', name: 'Project Team', members: ['Doua', 'Ahmed', 'Sara'] }]);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchTextHome, setSearchTextHome] = useState('');
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupImage, setGroupImage] = useState<string | null>(null);
  
  const [user, setUser] = useState<any | null>({
    name: 'Doua',
    bio: 'Computer Science Student',
    email: 'doua.student@univ.dz',
    phone: '+213 555 12 34 56',
    avatar: null as string | null,
    isOnline: true,
  });

  const [currentChat, setCurrentChat] = useState<{type: 'contact' | 'group', id: string, name: string, avatar?: string} | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, any[]>>({
    'group_1': [{ id: '1', text: 'Did you finish the lab task?', sender: 'other', type: 'text' }],
  });

  // --- Functions ---
  const sendMessage = () => {
    if (inputText.trim() && currentChat) {
      const chatKey = `${currentChat.type}_${currentChat.id}`;
      setChatMessages((prev) => ({
        ...prev,
        [chatKey]: [
          ...(prev[chatKey] || []),
          { id: Date.now().toString(), text: inputText, sender: 'me', type: 'text' },
        ],
      }));
      setInputText('');
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!res.canceled && currentChat) {
        const chatKey = `${currentChat.type}_${currentChat.id}`;
        setChatMessages((prev) => ({
          ...prev,
          [chatKey]: [
            ...(prev[chatKey] || []),
            { id: Date.now().toString(), text: res.assets[0].name, sender: 'me', type: 'file' },
          ],
        }));
      }
    } catch (err) {
      Alert.alert('Error', "Can't pick file");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && currentChat) {
      const chatKey = `${currentChat.type}_${currentChat.id}`;
      setChatMessages((prev) => ({
        ...prev,
        [chatKey]: [
          ...(prev[chatKey] || []),
          { id: Date.now().toString(), text: result.assets[0].uri, sender: 'me', type: 'image' },
        ],
      }));
    }
  };

  const pickProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setUser({ ...user, avatar: result.assets[0].uri });
    }
  };

  const pickGroupImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  const addContact = () => {
    if (newContactName.trim()) {
      const alreadyExists = contacts.find((c) => c.name.toLowerCase() === newContactName.trim().toLowerCase());
      if (alreadyExists) {
        Alert.alert('Info', 'Ce contact existe déjà');
        return;
      }
      const newContact: User = { 
        id: Date.now().toString(), 
        name: newContactName, 
        avatar: `https://i.pravatar.cc/100?img=${contacts.length + 1}`,
        phone: newContactPhone.trim() || undefined,
        email: newContactEmail.trim() || undefined
      };
      setContacts([...contacts, newContact]);
      Alert.alert('Succès', newContactName + ' ajouté aux contacts');
      setNewContactName('');
      setNewContactPhone('');
      setNewContactEmail('');
      setShowAddContactModal(false);
    }
  };

  const addGroup = () => {
    if (newGroupName.trim() && selectedMembers.length > 0) {
      const newGroup: Group = { id: Date.now().toString(), name: newGroupName, members: selectedMembers, avatar: groupImage || undefined };
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setSelectedMembers([]);
      setGroupImage(null);
      setShowAddGroupModal(false);
    } else {
      Alert.alert('Error', 'Please enter group name and select at least one member');
    }
  };

  const toggleMemberSelection = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            router.replace('/login'); 
          } 
        },
      ]
    );
  };

  // --- Render Components ---

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* 1. HOME SCREEN */}
      {currentView === 'home' && (
        <View style={styles.container}>
          <View style={styles.mainHeader}>
            <Text style={styles.logo}>UniChat</Text>
            
            {/* الحاوية الجديدة للأزرار على اليمين */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              
              {/* زر الإشعارات المضاف */}
              <TouchableOpacity 
                style={{ marginRight: 15 }} 
                onPress={() => setCurrentView('announcements')}
              >
                <Ionicons name="notifications-outline" size={26} color={PURPLE} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>

              {/* زر الملف الشخصي */}
              <TouchableOpacity onPress={() => setCurrentView('profile')}>
                <View style={styles.smallAvatar}>
                  {user.avatar ? <Image source={{ uri: user.avatar }} style={styles.full} /> : <Ionicons name="person" size={20} color={PURPLE} />}
                  {user.isOnline && <View style={styles.onlineDot} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={searchTextHome}
            onChangeText={setSearchTextHome}
          />

          <View style={styles.onlineContainer}>
            <Text style={styles.onlineTitle}>En ligne</Text>

            <FlatList
              data={contacts.filter(c => c.name.toLowerCase().includes(searchTextHome.toLowerCase()))}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.onlineUser}>
                  <Image source={{ uri: item.avatar }} style={styles.onlineAvatar} />
                  <View style={styles.onlineDotUser} />
                  <Text style={styles.onlineName}>{item.name}</Text>
                </View>
              )}
            />
          </View>

          <Text style={[styles.sectionTitle, { marginLeft: 20 }]}>Messages</Text>
          <TouchableOpacity style={styles.chatItem} onPress={() => { setCurrentChat({type: 'group', id: '1', name: 'Project Team', avatar: undefined}); setCurrentView('chat'); }}>
            <View style={styles.teamAvatar}><Ionicons name="people" size={25} color={PURPLE} /></View>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.teamName}>Project Team Group</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Add Contact Button */}
      {currentView === 'home' && (
        <TouchableOpacity style={styles.floatingAddBtn} onPress={() => setShowMenu(true)}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* 4. CONTACTS SCREEN */}
      {currentView === 'contacts' && (
        <View style={styles.container}>
          <Text style={styles.title}>Contacts</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un contact..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <Text style={styles.sectionTitle}>Mes contacts</Text>
          {contacts.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase())).map((item) => (
            <TouchableOpacity key={item.id} style={styles.chatItem} onPress={() => { setCurrentChat({type: 'contact', id: item.id, name: item.name, avatar: item.avatar}); setCurrentView('chat'); }}>
              <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
              <Text style={{ marginLeft: 10 }}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 5. GROUPS SCREEN */}
      {currentView === 'groups' && (
        <View style={styles.container}>
          <Text style={styles.title}>Groups</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddGroupModal(true)}>
            <Ionicons name="add" size={24} color="white" />
            <Text style={{ color: 'white', marginLeft: 10 }}>Add Group</Text>
          </TouchableOpacity>
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.groupItem} onPress={() => { setCurrentChat({type: 'group', id: item.id, name: item.name, avatar: item.avatar}); setCurrentView('chat'); }}>
                {item.avatar ? <Image source={{ uri: item.avatar }} style={styles.groupAvatar} /> : <Ionicons name="people" size={40} color={PURPLE} />}
                <Text style={styles.groupName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* 2. CHAT SCREEN */}
      {currentView === 'chat' && currentChat && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setCurrentView('home')}><Ionicons name="arrow-back" size={26} color="black" /></TouchableOpacity>
            {currentChat.avatar ? <Image source={{ uri: currentChat.avatar }} style={styles.chatAvatar} /> : <Ionicons name={currentChat.type === 'group' ? 'people' : 'person'} size={40} color={PURPLE} />}
            <Text style={styles.chatName}>{currentChat.name}</Text>
            <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
              <TouchableOpacity onPress={() => setIsCalling(true)}><Ionicons name="call-outline" size={24} color={PURPLE} /></TouchableOpacity>
              <TouchableOpacity onPress={() => setIsCalling(true)} style={{ marginLeft: 15 }}><Ionicons name="videocam-outline" size={24} color={PURPLE} /></TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={chatMessages[`${currentChat.type}_${currentChat.id}`] || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.sender === 'me' ? styles.myBubble : styles.otherBubble]}>
                {item.type === 'image' ? <Image source={{ uri: item.text }} style={styles.sentImage} /> :
                  item.type === 'file' ? <Text style={{ color: 'white' }}>📄 {item.text}</Text> :
                    <Text style={{ color: item.sender === 'me' ? 'white' : 'black' }}>{item.text}</Text>}
              </View>
            )}
            contentContainerStyle={{ padding: 20 }}
          />

          <View style={styles.chatInput}>
            <TouchableOpacity onPress={pickImage}><Ionicons name="image-outline" size={26} color={PURPLE} /></TouchableOpacity>
            <TouchableOpacity onPress={pickDocument} style={{ marginLeft: 10 }}><Ionicons name="attach-outline" size={26} color={PURPLE} /></TouchableOpacity>
            <TextInput
              style={styles.inputField}
              placeholder="Type message..."
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity onPress={sendMessage} disabled={!inputText.trim()}>
              <Ionicons name="send" size={26} color={inputText.trim() ? PURPLE : '#CCC'} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* 3. PROFILE SCREEN */}
      {currentView === 'profile' && (
        <ScrollView style={styles.container}>
          <View style={styles.pHeader}>
            <TouchableOpacity onPress={() => setCurrentView('home')}><Ionicons name="arrow-back" size={26} color="black" /></TouchableOpacity>
            <Text style={styles.pTitle}>Profile Settings</Text>
          </View>

          <View style={styles.pAvatarContainer}>
            <View style={styles.largeAvatar}>
              {user.avatar ? <Image source={{ uri: user.avatar }} style={styles.full} /> : <Ionicons name="person" size={50} color={PURPLE} />}
              {user.isOnline && <View style={styles.onlineDotLarge} />}
            </View>
            <TouchableOpacity style={styles.cameraIcon} onPress={pickProfileImage}>
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.pForm}>
            <Text style={styles.pLabel}>Full Name</Text>
            <TextInput style={styles.pInput} value={user.name} onChangeText={(t) => setUser({ ...user, name: t })} />
            
            <Text style={styles.pLabel}>Bio</Text>
            <TextInput style={styles.pInput} value={user.bio} onChangeText={(t) => setUser({ ...user, bio: t })} />

            <Text style={styles.pLabel}>Email (Read Only)</Text>
            <TextInput style={[styles.pInput, { color: '#999' }]} value={user.email} editable={false} />

            <Text style={styles.pLabel}>Phone Number</Text>
            <TextInput style={styles.pInput} value={user.phone} onChangeText={(t) => setUser({ ...user, phone: t })} keyboardType="phone-pad" />

            <TouchableOpacity style={styles.pBtn} onPress={() => { Alert.alert("Success", "Profile Updated!"); setCurrentView('home'); }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* 6. ANNOUNCEMENT SCREEN الجاهزة */}
      {currentView === 'announcements' && (
        <AnnouncementB onBack={() => setCurrentView('home')} />
      )}
      {currentView === 'announcement' && (
         <Announcement onBack={() => setCurrentView('home')} />
      )}
      {showMenu && (
  <TouchableOpacity 
    style={styles.overlay} 
    activeOpacity={1} 
    onPress={() => setShowMenu(false)}
  >
    <View style={styles.menuBox}>
      
      {/* New Group */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          setShowMenu(false);
          setShowAddGroupModal(true);
        }}
      >
        <Ionicons name="people-outline" size={20} color={PURPLE} />
        <Text style={styles.menuText}>New Group</Text>
      </TouchableOpacity>

      {/* New Message */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          setShowMenu(false);
          setCurrentView('contacts');
        }}
      >
        <Ionicons name="chatbubble-outline" size={20} color={PURPLE} />
        <Text style={styles.menuText}>New Message</Text>
      </TouchableOpacity>

      {/* New Announcement */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          setShowMenu(false);
          setCurrentView('announcement');
        }}
      >
        <Ionicons name="megaphone-outline" size={20} color={PURPLE} />
        <Text style={styles.menuText}>New Announcement</Text>
      </TouchableOpacity>

    </View>
  </TouchableOpacity>
)}
      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('home')}>
          <Ionicons name="home" size={24} color={currentView === 'home' ? PURPLE : '#666'} />
          <Text style={{ color: currentView === 'home' ? PURPLE : '#666', fontSize: 12 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('contacts')}>
          <Ionicons name="people" size={24} color={currentView === 'contacts' ? PURPLE : '#666'} />
          <Text style={{ color: currentView === 'contacts' ? PURPLE : '#666', fontSize: 12 }}>Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentView('groups')}>
          <Ionicons name="chatbubbles" size={24} color={currentView === 'groups' ? PURPLE : '#666'} />
          <Text style={{ color: currentView === 'groups' ? PURPLE : '#666', fontSize: 12 }}>Groups</Text>
        </TouchableOpacity>
      </View>

      {/* --- Modals --- */}
      {/* ... بقية المودالات (Call, Add Contact, Add Group) تبقى كما هي بدون تغيير ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  // تم إضافة تنسيق نقطة الإشعارات
  overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.2)',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
},

menuBox: {
  backgroundColor: '#FFF',
  borderRadius: 20,
  padding: 15,
  marginRight: 20,
  marginBottom: 140,
  width: 220,
  elevation: 10,
},

menuItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
},

menuText: {
  marginLeft: 10,
  fontSize: 16,
  color: PURPLE,
  fontWeight: '500',
},
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  container: { flex: 1, backgroundColor: '#FFF', paddingTop: 50, paddingBottom: 80 },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: { fontSize: 26, fontWeight: 'bold', color: PURPLE },
  smallAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE',
    position: 'relative',
  },
  full: { width: '100%', height: '100%' },
  onlineContainer: { marginTop: 20 },
  onlineTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 },
  onlineUser: { alignItems: 'center', marginHorizontal: 10, position: 'relative' },
  onlineAvatar: { width: 60, height: 60, borderRadius: 30 },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineDotLarge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'green',
    borderWidth: 3,
    borderColor: '#fff',
  },
  onlineDotUser: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineName: { marginTop: 5, fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  chatItem: {
    flexDirection: 'row',
    padding: 18,
    marginHorizontal: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 20,
    alignItems: 'center',
  },
  teamAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#E0E0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  chatHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  chatName: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  bubble: { padding: 14, borderRadius: 20, marginBottom: 12, maxWidth: '80%' },
  myBubble: { backgroundColor: PURPLE, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: '#F0F0F0', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  sentImage: { width: 220, height: 160, borderRadius: 12 },
  chatInput: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
  inputField: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 18,
    height: 48,
    marginHorizontal: 10,
  },
  pHeader: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  pTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  pAvatarContainer: { alignSelf: 'center', marginVertical: 30 },
  largeAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F0F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: PURPLE,
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: PURPLE,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  pForm: { padding: 20 },
  pLabel: { color: '#666', marginBottom: 8, fontSize: 14, fontWeight: '500' },
  pInput: { backgroundColor: '#F8F8F8', padding: 14, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  pBtn: { backgroundColor: PURPLE, padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 2 },
  logoutBtn: { backgroundColor: '#FF3B30', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: PURPLE },
  searchInput: { borderWidth: 1, borderColor: '#CCC', padding: 10, borderRadius: 25, marginHorizontal: 20, marginBottom: 15, backgroundColor: '#F5F5F5' },
  contactAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  groupItem: { flexDirection: 'row', padding: 15, marginHorizontal: 20, marginVertical: 5, backgroundColor: '#F9F9F9', borderRadius: 10, alignItems: 'center' },
  groupName: { fontSize: 16, fontWeight: 'bold', marginLeft: 15 },
  addBtn: { flexDirection: 'row', backgroundColor: PURPLE, padding: 15, marginHorizontal: 20, marginVertical: 10, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  bottomNav: { flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', justifyContent: 'space-around', alignItems: 'center' },
  navItem: { alignItems: 'center' },
  chatAvatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 15 },
  groupAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  floatingAddBtn: { position: 'absolute', bottom: 80, right: 20, backgroundColor: PURPLE, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});