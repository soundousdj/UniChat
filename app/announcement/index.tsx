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
import { useRouter } from 'expo-router'; // أضفنا هذا السطر لحل خطأ router

type Props = {
  onBack: () => void;
};

export default function NewAnnouncement({ onBack }: Props) {
  const router = useRouter(); // تعريف الـ router
  const [userData, setUserData] = useState({ name: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [degree, setDegree] = useState('M1');
  const [group, setGroup] = useState('Group 2');
  const [message, setMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // 1. جلب بيانات المستخدم والتأكد من الصلاحيات
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const role = await AsyncStorage.getItem('userRole');
        
        if (role !== 'teacher') {
          Alert.alert("Forbidden", "You are not authorized");
          router.replace('/(tabs)');
          return;
        }

        setUserData({ name: name || 'Professor', role: role || 'teacher' });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, []);

  // 2. دالة إرسال الإعلان (النسخة المختصرة والصحيحة)
  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please type a message");
      return;
    }

    setSending(true);
    try {
      // تأكد أن الـ IP صحيح ويطابق جهازك
      const response = await fetch('http://192.168.1.4:5000/api/announcements/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: userData.name,
          message: message,
          degree: degree,
          group: group,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Announcement Sent!");
        onBack(); // العودة للخلف
      } else {
        const errData = await response.json();
        Alert.alert("Error", errData.error || "Failed to send");
      }
    } catch (error) {
      Alert.alert("Error", "Could not connect to server. Check IP!");
    } finally {
      setSending(false);
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) setSelectedFileName(result.assets[0].name);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4A148C" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Announcement</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.label}>From</Text>
          <View style={styles.profileRow}>
            <Image source={{ uri: `https://ui-avatars.com/api/?name=${userData.name}&background=random` }} style={styles.avatar} />
            <View>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileSub}>Verified Professor</Text>
            </View>
          </View>
        </View>

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

        <View style={styles.card}>
          <Text style={styles.label}>Attach</Text>
          <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
            <MaterialCommunityIcons name="file-document-outline" size={30} color="#4A148C" />
            <Text style={styles.attachText}>{selectedFileName || 'Select File'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.sendButton, { opacity: sending ? 0.7 : 1 }]} 
          onPress={handleSend}
          disabled={sending}
        >
          {sending ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="send" size={22} color="#fff" style={{marginRight: 8}} />
              <Text style={styles.sendButtonText}>Send Announcement</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  textArea: { minHeight: 100, textAlignVertical: 'top', fontSize: 15 },
  charCount: { alignSelf: 'flex-end', color: '#888', fontSize: 12 },
  attachButton: { height: 70, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  attachText: { color: '#4A148C', marginTop: 5 },
  sendButton: { backgroundColor: '#4A148C', borderRadius: 12, height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  sendButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});