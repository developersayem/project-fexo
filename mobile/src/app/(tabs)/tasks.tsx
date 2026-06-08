import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Circle, Play } from 'lucide-react-native'

export default function TasksScreen() {
  const pendingTasks = [
    { id: '1', title: 'Design user onboarding flow', category: 'Design', duration: '2h' },
    { id: '2', title: 'Fix OAuth callback redirect bug', category: 'Backend', duration: '1h 30m' },
    { id: '3', title: 'Optimize SQLite database indexes', category: 'Database', duration: '45m' }
  ]

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Tasks</Text>
        <Text style={styles.subtitle}>Manage your work agenda for today</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Tasks</Text>
          {pendingTasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskLeft}>
                <Circle size={20} color="#a1a1a1" style={{ marginRight: 12 }} />
                <View style={styles.meta}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.category}>{task.category} · {task.duration}</Text>
                </View>
              </View>
              <View style={styles.playButton}>
                <Play size={14} color="#ffffff" fill="#ffffff" />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a'
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100
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
  section: {
    flexDirection: 'column',
    gap: 12
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  meta: {
    flexDirection: 'column',
    gap: 2
  },
  taskTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500'
  },
  category: {
    color: '#a1a1a1',
    fontSize: 11
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
