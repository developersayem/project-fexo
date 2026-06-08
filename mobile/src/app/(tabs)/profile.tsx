import React from 'react'
import { StyleSheet, Text, View, Image, Pressable, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut } from 'lucide-react-native'

export default function ProfileScreen() {
  const { user, logout } = useAuthStore()

  const handleLogoutPress = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from Fexo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.subtitle}>Manage your settings and sessions</Text>

        <View style={styles.profileCard}>
          <Image
            source={{
              uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTQ5MjM3Nzd8MA&ixlib=rb-4.1.0&q=80&w=200'
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.firstName || 'Alex'} {user?.lastName || ''}</Text>
          <Text style={styles.email}>{user?.email || 'alex@example.com'}</Text>
        </View>

        <Pressable
          onPress={handleLogoutPress}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed
          ]}
        >
          <LogOut size={18} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out from Account</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a'
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  subtitle: {
    color: '#a1a1a1',
    fontSize: 14,
    marginBottom: 28
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(78, 93, 219, 0.4)',
    marginBottom: 16
  },
  name: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  email: {
    color: '#a1a1a1',
    fontSize: 14
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 16,
    paddingVertical: 14
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600'
  },
  pressed: {
    opacity: 0.8
  }
})
