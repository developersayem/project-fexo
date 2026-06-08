import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Settings as SettingsIcon,
  Pencil,
  Zap,
  ListChecks,
  Clock,
  Flame,
  Trophy,
  Bell,
  Palette,
  UserCog,
  Download,
  Info,
  ChevronRight
} from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useTaskStore } from '@/store/useTaskStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const tasks = useTaskStore((state) => state.tasks);

  // Compute dynamic stats from tasks store
  const storeCompletedCount = tasks.filter((t) => t.status === 'Completed').length;
  const storeFocusHours = tasks.reduce((sum, t) => sum + t.loggedTime, 0);

  // Stats combinations with baseline mockup defaults
  const totalTasks = 128 + tasks.length;
  const totalFocusHours = Math.round(214 + storeFocusHours);

  const completedCount = storeCompletedCount;
  const totalXp = 1240 + completedCount * 80;
  const currentLevel = Math.floor(totalXp / 500); // dynamic progression
  const targetLevelXp = (currentLevel + 1) * 500;
  const progressPercent = Math.min(100, Math.round(((totalXp % 500) / 500) * 100));

  // Initials calculation
  const initials = user
    ? `${user.firstName?.[0] || 'A'}${user.lastName?.[0] || 'J'}`.toUpperCase()
    : 'AJ';
  const fullName = user
    ? `${user.firstName || 'Alex'} ${user.lastName || 'Johnson'}`
    : 'Alex Johnson';

  const handleLogoutPress = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from Fexo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleSettingsPress = () => {
    Alert.alert(
      'Settings',
      'Fexo configurations dashboard. Would you like to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleFeatureNotice = (feature: string) => {
    Alert.alert('Info', `${feature} options dashboard is under development.`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable
            onPress={handleSettingsPress}
            style={({ pressed }) => [
              styles.settingsCogBtn,
              pressed && styles.pressed
            ]}
          >
            <SettingsIcon size={20} color="#ffffff" />
          </Pressable>
        </View>

        {/* User Info / Avatar Area */}
        <View style={styles.avatarArea}>
          <View style={styles.avatarWrapper}>
            <LinearGradient
              colors={['#208AEF', '#a855f7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            {/* Pencil edit overlay badge */}
            <Pressable style={styles.pencilOverlay}>
              <Pencil size={12} color="#ffffff" />
            </Pressable>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{fullName}</Text>
            <View style={styles.levelBadge}>
              <Zap size={13} color="#a855f7" style={{ marginRight: 4 }} />
              <Text style={styles.levelBadgeText}>Level {currentLevel}</Text>
            </View>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress to Level {currentLevel + 1}</Text>
            <Text style={styles.progressPercentText}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#4f46e5', '#9333ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progressPercent}%` as any }]}
            />
          </View>
          <View style={styles.xpLabelsRow}>
            <Text style={styles.xpLabelBold}>{totalXp.toLocaleString()} XP</Text>
            <Text style={styles.xpLabelMax}>{targetLevelXp.toLocaleString()} XP</Text>
          </View>
        </View>

        {/* 2x2 Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.row}>
            {/* Stat Card 1: Total Tasks */}
            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(32, 138, 239, 0.15)' }]}>
                <ListChecks size={18} color="#208AEF" />
              </View>
              <Text style={styles.statValue}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </View>

            {/* Stat Card 2: Total Hours */}
            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Clock size={18} color="#a855f7" />
              </View>
              <Text style={styles.statValue}>{totalFocusHours}h</Text>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
          </View>

          <View style={styles.row}>
            {/* Stat Card 3: Current Streak */}
            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Flame size={18} color="#ef4444" />
              </View>
              <Text style={styles.statValue}>7 days</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>

            {/* Stat Card 4: Best Streak */}
            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
                <Trophy size={18} color="#f97316" />
              </View>
              <Text style={styles.statValue}>21 days</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
        </View>

        {/* Settings Menu list */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Settings</Text>
          <View style={styles.menuContainerCard}>
            {/* Notifications option */}
            <Pressable
              onPress={() => handleFeatureNotice('Notifications')}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <Bell size={20} color="#a855f7" style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>Notifications</Text>
              <ChevronRight size={16} color="#71717a" />
            </Pressable>

            {/* Theme option */}
            <Pressable
              onPress={() => handleFeatureNotice('Theme')}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <Palette size={20} color="#a855f7" style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>Theme</Text>
              <ChevronRight size={16} color="#71717a" />
            </Pressable>

            {/* Account option (Logout trigger) */}
            <Pressable
              onPress={handleLogoutPress}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <UserCog size={20} color="#a855f7" style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>Account</Text>
              <ChevronRight size={16} color="#71717a" />
            </Pressable>

            {/* Export Data option */}
            <Pressable
              onPress={() => handleFeatureNotice('Export Data')}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <Download size={20} color="#a855f7" style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>Export Data</Text>
              <ChevronRight size={16} color="#71717a" />
            </Pressable>

            {/* About option */}
            <Pressable
              onPress={() => handleFeatureNotice('About')}
              style={({ pressed }) => [
                styles.menuItem,
                styles.lastMenuItem,
                pressed && styles.menuItemPressed
              ]}
            >
              <Info size={20} color="#a855f7" style={{ marginRight: 12 }} />
              <Text style={styles.menuItemText}>About</Text>
              <ChevronRight size={16} color="#71717a" />
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a'
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 110 // bottom tabs offset
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  settingsCogBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarArea: {
    alignItems: 'center',
    marginBottom: 28,
    gap: 16
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5
  },
  pencilOverlay: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#208AEF',
    borderWidth: 2,
    borderColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center'
  },
  nameContainer: {
    alignItems: 'center',
    gap: 8
  },
  userName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 138, 239, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(32, 138, 239, 0.25)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12
  },
  levelBadgeText: {
    color: '#90caf9',
    fontSize: 12,
    fontWeight: '600'
  },
  progressCard: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'column',
    gap: 12
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500'
  },
  progressPercentText: {
    color: '#a1a1a1',
    fontSize: 12
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27272a',
    overflow: 'hidden',
    width: '100%'
  },
  progressFill: {
    height: '100%',
    borderRadius: 5
  },
  xpLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  xpLabelBold: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  xpLabelMax: {
    color: '#a1a1a1',
    fontSize: 12
  },
  statsGrid: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 28
  },
  row: {
    flexDirection: 'row',
    gap: 16
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    flexDirection: 'column',
    gap: 8
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold'
  },
  statLabel: {
    color: '#a1a1a1',
    fontSize: 12
  },
  settingsSection: {
    flexDirection: 'column',
    gap: 10
  },
  settingsSectionTitle: {
    color: '#a1a1a1',
    fontSize: 14,
    fontWeight: '600',
    paddingLeft: 4
  },
  menuContainerCard: {
    backgroundColor: '#18181b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 8,
    flexDirection: 'column'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  lastMenuItem: {
    borderBottomWidth: 0
  },
  menuItemPressed: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12
  },
  menuItemText: {
    color: '#ffffff',
    fontSize: 15,
    flex: 1
  },
  pressed: {
    opacity: 0.8
  }
});
