import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// تعريف الـ Props لضمان عمل زر الرجوع بدون أخطاء TypeScript
interface AnnouncementProps {
  onBack: () => void;
}

const PURPLE = '#450693';

// بيانات تجريبية للإعلانات
const ANNOUNCEMENTS = [
  {
    id: '1',
    author: 'Dr. Mohammed Amine',
    role: 'Databases',
    time: 'Today · 10:34 AM',
    group: 'Group 2',
    content: 'The practical session scheduled for Thursday is postponed to next week. Please review chapters 7 and 8.',
    seenCount: 24,
    likes: 12,
    isNew: true,
    avatar: 'https://i.pravatar.cc/100?img=12'
  },
  {
    id: '2',
    author: 'Ms. Sara Benali',
    role: 'tech IP',
    time: 'Yesterday · 2:15 PM',
    group: 'Group 2',
    content: 'Exam results are now available. Please check your student portal. Overall performance was good — well done everyone!',
    seenCount: 31,
    likes: 8,
    isNew: false,
    avatar: 'https://i.pravatar.cc/100?img=44'
  }
];

const AnnouncementCard = ({ item }: { item: typeof ANNOUNCEMENTS[0] }) => (
  <View style={styles.announcementCard}>
    <View style={styles.cardHeader}>
      <View style={styles.userInfo}>
        <Image source={{ uri: item.avatar }} style={styles.authorAvatar} />
        <View>
          <View style={styles.nameRow}>
            <Text style={styles.authorName}>{item.author}</Text>
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            )}
          </View>
          <Text style={styles.timeInfo}>{item.time} · {item.role}</Text>
        </View>
      </View>
    </View>

    <View style={styles.autoSentContainer}>
       <Ionicons name="notifications" size={14} color={PURPLE} />
       <Text style={styles.autoSentText}>Sent automatically to {item.group}</Text>
    </View>

    <Text style={styles.contentBox}>{item.content}</Text>

    <View style={styles.divider} />

    <View style={styles.cardFooter}>
      <Text style={styles.footerStats}>{item.seenCount} students seen</Text>
      <View style={styles.likesContainer}>
        <MaterialCommunityIcons name="thumb-up-outline" size={16} color={PURPLE} />
        <Text style={styles.likesText}>{item.likes}</Text>
      </View>
    </View>
  </View>
);

// تصحيح اسم المكون وتمرير onBack
export default function AnnouncementB({ onBack }: AnnouncementProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header المعدل ليتناسب مع تطبيق UniChat */}
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
            <Text style={styles.tabNumber}>2</Text>
            <Text style={styles.tabLabel}>New today</Text>
            <View style={styles.activeIndicator} />
          </View>
          <View style={styles.tabItem}>
            <Text style={styles.tabNumber}>10</Text>
            <Text style={styles.tabLabel}>This week</Text>
          </View>
          <View style={styles.tabItem}>
            <Text style={styles.tabNumber}>47</Text>
            <Text style={styles.tabLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>LATEST ANNOUNCEMENTS</Text>
          
          {ANNOUNCEMENTS.map(item => (
            <AnnouncementCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    backgroundColor: PURPLE,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  
  infoBanner: {
    backgroundColor: '#E1D5F5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    margin: 15,
    borderRadius: 10,
  },
  infoBannerText: {
    color: PURPLE,
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500'
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  tabNumber: { fontSize: 18, fontWeight: 'bold', color: PURPLE },
  tabLabel: { fontSize: 12, color: '#666', marginTop: 2 },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '80%',
    height: 3,
    backgroundColor: PURPLE,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  content: { padding: 15 },
  sectionTitle: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 15,
  },

  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  authorAvatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  authorName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  newBadge: {
    backgroundColor: '#E1D5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  newBadgeText: { color: PURPLE, fontSize: 10, fontWeight: 'bold' },
  timeInfo: { color: '#888', fontSize: 12, marginTop: 2 },

  autoSentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  autoSentText: { color: PURPLE, fontSize: 12, marginLeft: 5, fontWeight: '500' },

  contentBox: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 15,
  },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 12 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerStats: { color: '#999', fontSize: 12 },
  likesContainer: { flexDirection: 'row', alignItems: 'center' },
  likesText: { color: PURPLE, marginLeft: 5, fontWeight: 'bold' }
});