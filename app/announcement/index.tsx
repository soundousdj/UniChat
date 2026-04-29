import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// مكون فرعي للأزرار القابلة للاختيار (Chips)
const SelectionChip = ({ label, isSelected, onPress, icon }: any) => (
  <TouchableOpacity 
    style={[styles.chip, isSelected && styles.chipSelected]} 
    onPress={onPress}
  >
    {icon && <Ionicons name={icon} size={16} color={isSelected ? '#fff' : '#4A148C'} style={{marginRight: 4}} />}
    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

type Props = {
  onBack: () => void;
};

export default function NewAnnouncement({ onBack }: Props) {
  const [degree, setDegree] = useState('M1');
  const [speciality, setSpeciality] = useState('Networks');
  const [group, setGroup] = useState('Group 2');
  const [message, setMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) setSelectedFileName(result.assets[0].name);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) setSelectedImageName(result.assets[0].uri.split('/').pop() || 'image.jpg');
  };

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
        {/* From Section */}
        <View style={styles.card}>
          <Text style={styles.label}>From</Text>
          <View style={styles.profileRow}>
            <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
            <View>
              <Text style={styles.profileName}>Dr. Mohammed Amine</Text>
              <Text style={styles.profileSub}>Databases · Professor</Text>
            </View>
          </View>
        </View>

        {/* Degree Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Degree</Text>
          <View style={styles.row}>
            {['L1', 'L2', 'L3', 'M1', 'M2'].map((d) => (
              <TouchableOpacity 
                key={d} 
                style={[styles.circleOption, degree === d && styles.circleSelected]}
                onPress={() => setDegree(d)}
              >
                <Text style={[styles.circleText, degree === d && styles.circleTextSelected]}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Speciality Section (تمت إضافته) */}
        <View style={styles.card}>
          <Text style={styles.label}>Speciality</Text>
          <View style={styles.row}>
            {['Artificial intelligence', 'Networks', 'fundamental'].map((s) => (
              <SelectionChip 
                key={s} 
                label={s} 
                isSelected={speciality === s} 
                onPress={() => setSpeciality(s)} 
              />
            ))}
          </View>
        </View>

        {/* Groups Section (تمت إضافته) */}
        <View style={styles.card}>
          <Text style={styles.label}>Groups</Text>
          <View style={styles.row}>
            {['Group 1', 'Group 2', 'Group 3'].map((g) => (
              <SelectionChip 
                key={g} 
                label={g} 
                icon="people"
                isSelected={group === g} 
                onPress={() => setGroup(g)} 
              />
            ))}
          </View>
        </View>

        {/* Message Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Type your message here..."
            multiline
            onChangeText={setMessage}
          />
          <Text style={styles.charCount}>{message.length} / 500</Text>
        </View>

        {/* Attach Section */}
        <View style={styles.card}>
          <Text style={styles.label}>Attach</Text>
          <View style={styles.attachRow}>
            <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
              <MaterialCommunityIcons name="file-document-outline" size={30} color="#4A148C" />
              <Text style={styles.attachText}>File</Text>
              {selectedFileName && <Text style={styles.fileLabel}>{selectedFileName}</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
              <Ionicons name="image-outline" size={30} color="#4A148C" />
              <Text style={styles.attachText}>Image</Text>
              {selectedImageName && <Text style={styles.fileLabel}>{selectedImageName}</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} onPress={() => Alert.alert("Success", "Announcement Sent!")}>
          <Ionicons name="send" size={22} color="#fff" style={styles.sendIcon} />
          <Text style={styles.sendButtonText}>Send Announcement</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { backgroundColor: '#4A148C', height: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 30 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 12, elevation: 2 },
  label: { color: '#4A148C', fontWeight: 'bold', marginBottom: 12, fontSize: 15 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  profileName: { fontSize: 15, fontWeight: 'bold' },
  profileSub: { color: '#888', fontSize: 11 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  circleOption: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#4A148C', alignItems: 'center', justifyContent: 'center' },
  circleSelected: { backgroundColor: '#4A148C' },
  circleText: { color: '#4A148C', fontWeight: 'bold' },
  circleTextSelected: { color: '#fff' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18, borderWidth: 1, borderColor: '#4A148C', flexDirection: 'row', alignItems: 'center' },
  chipSelected: { backgroundColor: '#4A148C' },
  chipText: { color: '#4A148C', fontSize: 13 },
  chipTextSelected: { color: '#fff' },
  textArea: { minHeight: 80, textAlignVertical: 'top', fontSize: 14 },
  charCount: { alignSelf: 'flex-end', color: '#888', fontSize: 12 },
  attachRow: { flexDirection: 'row', justifyContent: 'space-between' },
  attachButton: { width: '48%', height: 80, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  attachText: { marginTop: 4, color: '#4A148C', fontSize: 13 },
  fileLabel: { fontSize: 10, color: '#666', marginTop: 2 },
  sendButton: { backgroundColor: '#310A8C', borderRadius: 12, height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 20 },
  sendButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sendIcon: { marginRight: 8, transform: [{ rotate: '-45deg' }] }
});