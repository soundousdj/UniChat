import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface AnnouncementProps {
  onBack: () => void;
}

const PURPLE = '#450693';

export default function AnnouncementB({ onBack }: AnnouncementProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب الإعلانات من الباك اند عند فتح الصفحة
useEffect(() => {
  fetch('http://192.168.1.4:5000/api/announcements/all')
    .then(res => res.json())
    .then(data => setAnnouncements(data)) // تخزين الإعلانات الحقيقية
    .catch(err => console.error(err));
}, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcements</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="notifications-outline" size={22} color={PURPLE} />
          <Text style={styles.infoBannerText}>
            All announcements sent to your group automatically
          </Text>
        </View>

        {/* Stats Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabItem}>
            <Text style={styles.tabNumber}>{announcements.length}</Text>
            <Text style={styles.tabLabel}>Total</Text>
            <View style={styles.activeIndicator} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>LATEST ANNOUNCEMENTS FROM DATABASE</Text>
          
          {loading ? (
            <ActivityIndicator color={PURPLE} size="large" />
          ) : announcements.length === 0 ? (
            <Text style={{textAlign: 'center', marginTop: 20}}>No announcements found.</Text>
          ) : (
            announcements.map((item) => (
              <View key={item._id} style={styles.announcementCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <Image 
                      source={{ uri: `https://ui-avatars.com/api/?name=${item.senderName}` }} 
                      style={styles.authorAvatar} 
                    />
                    <View>
                      <Text style={styles.authorName}>{item.senderName}</Text>
                      <Text style={styles.timeInfo}>
                        {new Date(item.createdAt).toLocaleDateString()} · {item.group}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.contentBox}>{item.message}</Text>
                <View style={styles.divider} />
                <View style={styles.cardFooter}>
                  <Text style={styles.footerStats}>Degree: {item.degree}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... الستايلات التي أرسلتها أنت (تبقى كما هي)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { backgroundColor: PURPLE, height: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  infoBanner: { backgroundColor: '#E1D5F5', flexDirection: 'row', alignItems: 'center', padding: 15, margin: 15, borderRadius: 10 },
  infoBannerText: { color: PURPLE, marginLeft: 10, fontSize: 13, fontWeight: '500' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', paddingTop: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tabItem: { flex: 1, alignItems: 'center', paddingBottom: 10 },
  tabNumber: { fontSize: 18, fontWeight: 'bold', color: PURPLE },
  tabLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  activeIndicator: { position: 'absolute', bottom: 0, width: '80%', height: 3, backgroundColor: PURPLE },
  content: { padding: 15 },
  sectionTitle: { color: PURPLE, fontSize: 14, fontWeight: 'bold', marginBottom: 15 },
  announcementCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#E0E0E0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  authorAvatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  authorName: { fontSize: 16, fontWeight: 'bold' },
  timeInfo: { color: '#888', fontSize: 12 },
  contentBox: { fontSize: 14, color: '#333', marginBottom: 15 },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  footerStats: { color: '#999', fontSize: 12 }
});