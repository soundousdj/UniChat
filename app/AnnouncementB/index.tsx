import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface AnnouncementProps {
  onBack: () => void;
}

const PURPLE = '#450693';

export default function AnnouncementB({ onBack }: AnnouncementProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب الإعلانات من الباك اند
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // تأكد من استخدام الـ IP الصحيح لجهازك
        const response = await fetch('http://10.189.157.156:5000/api/announcements/all');
        const data = await response.json();
        
        if (response.ok) {
          setAnnouncements(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // دالة للتحقق إذا كان الإعلان أُرسل اليوم لظهور علامة "New"
  const isNewAnnouncement = (dateString: string) => {
    const annDate = new Date(dateString).toDateString();
    const today = new Date().toDateString();
    return annDate === today;
  };

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
          <View style={styles.tabItem}>
            <Text style={styles.tabNumber}>
              {announcements.filter(a => isNewAnnouncement(a.createdAt)).length}
            </Text>
            <Text style={styles.tabLabel}>New today</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>LATEST ANNOUNCEMENTS</Text>
          
          {loading ? (
            <ActivityIndicator color={PURPLE} size="large" style={{marginTop: 50}} />
          ) : announcements.length === 0 ? (
            <View style={styles.noDataBox}>
               <Ionicons name="document-text-outline" size={50} color="#CCC" />
               <Text style={styles.noDataText}>No announcements found.</Text>
            </View>
          ) : (
            announcements.map((item) => (
              <View key={item._id} style={styles.announcementCard}>
                {/* الجزء العلوي: معلومات الأستاذ */}
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <Image 
                      source={{ uri: `https://ui-avatars.com/api/?name=${item.senderName}&background=random` }} 
                      style={styles.authorAvatar} 
                    />
                    <View>
                      <View style={styles.nameRow}>
                        <Text style={styles.authorName}>{item.senderName}</Text>
                        {isNewAnnouncement(item.createdAt) && (
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>New</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.timeInfo}>
                        {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · {item.degree || 'General'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* أيقونة الإشعار */}
                <View style={styles.autoSentContainer}>
                   <Ionicons name="notifications" size={14} color={PURPLE} />
                   <Text style={styles.autoSentText}>Sent to {item.group || 'Everyone'}</Text>
                </View>

                {/* نص الرسالة الحقيقي */}
                <Text style={styles.contentBox}>{item.message}</Text>

                <View style={styles.divider} />

                {/* Footer */}
                <View style={styles.cardFooter}>
                  <Text style={styles.footerStats}>Verified Announcement</Text>
                  <View style={styles.likesContainer}>
                    <MaterialCommunityIcons name="thumb-up-outline" size={18} color={PURPLE} />
                    <Text style={styles.likesText}>12</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  activeIndicator: { position: 'absolute', bottom: 0, width: '80%', height: 3, backgroundColor: PURPLE, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  content: { padding: 15 },
  sectionTitle: { color: PURPLE, fontSize: 14, fontWeight: 'bold', letterSpacing: 1.2, marginBottom: 15 },
  announcementCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#E0E0E0', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  authorAvatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  authorName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  newBadge: { backgroundColor: '#E1D5F5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
  newBadgeText: { color: PURPLE, fontSize: 10, fontWeight: 'bold' },
  timeInfo: { color: '#888', fontSize: 12, marginTop: 2 },
  autoSentContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  autoSentText: { color: PURPLE, fontSize: 12, marginLeft: 5, fontWeight: '500' },
  contentBox: { fontSize: 14, lineHeight: 20, color: '#333', marginBottom: 15 },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerStats: { color: '#999', fontSize: 12 },
  likesContainer: { flexDirection: 'row', alignItems: 'center' },
  likesText: { color: PURPLE, marginLeft: 5, fontWeight: 'bold' },
  noDataBox: { alignItems: 'center', marginTop: 50 },
  noDataText: { color: '#999', marginTop: 10, fontSize: 16 }
});