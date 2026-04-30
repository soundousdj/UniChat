import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

type Props = {
  onBack: () => void;
};

export default function NewAnnouncement({ onBack }: Props) {
  // --- States ---
  const [userData, setUserData] = useState({ name: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false); // حالة إرسال الإعلان

  const [degree, setDegree] = useState('M1');
  const [speciality, setSpeciality] = useState('Networks');
  const [group, setGroup] = useState('Group 2');
  const [message, setMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // 1. جلب معلوماتك الحقيقية عند فتح الصفحة
  useEffect(() => {
    const loadInfo = async () => {
      const name = await AsyncStorage.getItem('userName');
      const role = await AsyncStorage.getItem('userRole');
      setUserData({ name: name || 'Professor', role: role || 'teacher' });
      setLoading(false);
    };
    loadInfo();
  }, []);

  // 2. دالة إرسال الإعلان للباك اند
const handleSend = async () => {
  if (!message) return Alert.alert("Error", "Please type a message");
  
  try {
    const name = await AsyncStorage.getItem('userName');
    const response = await fetch('http://192.168.1.4:5000/api/announcements/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: name, // اسم المعلم الحقيقي من الذاكرة
        message: message,
        degree: degree,
        group: group,
        speciality: speciality
      }),
    });

    if (response.ok) {
      Alert.alert("Success", "Announcement Sent!");
      onBack(); // العودة للصفحة الرئيسية
    }
  } catch (error) {
    Alert.alert("Error", "Server is not responding");
  }
};

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) setSelectedFileName(result.assets[0].name);
  };

  if (loading) return <ActivityIndicator size="large" style={{flex:1}} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Announcement</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* From Section - تعرض اسمك الحقيقي الآن */}
        <View style={styles.card}>
          <Text style={styles.label}>From</Text>
          <View style={styles.profileRow}>
            <Image source={{ uri: `https://ui-avatars.com/api/?name=${userData.name}` }} style={styles.avatar} />
            <View>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileSub}>{userData.role === 'teacher' ? 'University Professor' : 'Assistant'}</Text>
            </View>
          </View>
        </View>

        {/* Message Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Type your message here..."
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <Text style={styles.charCount}>{message.length} / 500</Text>
        </View>

        {/* Attach Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Attach Files</Text>
          <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
            <MaterialCommunityIcons name="file-document-outline" size={30} color="#4A148C" />
            <Text style={styles.attachText}>{selectedFileName || 'Select File'}</Text>
          </TouchableOpacity>
        </View>

        {/* زر الإرسال الحقيقي */}
        <TouchableOpacity 
          style={[styles.sendButton, { opacity: sending ? 0.6 : 1 }]} 
          onPress={handleSendAnnouncement}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={22} color="#fff" style={styles.sendIcon} />
              <Text style={styles.sendButtonText}>Post Announcement</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (نفس الستايلات التي كانت لديك) ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { backgroundColor: '#4A148C', height: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 12 },
  label: { color: '#4A148C', fontWeight: 'bold', marginBottom: 12 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  profileName: { fontSize: 15, fontWeight: 'bold' },
  profileSub: { color: '#888', fontSize: 11 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  charCount: { alignSelf: 'flex-end', color: '#888', fontSize: 12 },
  attachButton: { height: 80, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  attachText: { color: '#4A148C', marginTop: 5 },
  sendButton: { backgroundColor: '#4A148C', borderRadius: 12, height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  sendIcon: { marginRight: 8 }
});