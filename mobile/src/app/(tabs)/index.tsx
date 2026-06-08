import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Platform
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  Flame,
  Pause,
  Play,
  Square,
  Check
} from 'lucide-react-native'
import { useAuthStore } from '@/store/useAuthStore'
import { useTaskStore } from '@/store/useTaskStore'

export default function HomeScreen() {
  const { user, logout } = useAuthStore()
  const tasks = useTaskStore((state) => state.tasks)
  const togglePlayPause = useTaskStore((state) => state.togglePlayPause)
  const toggleComplete = useTaskStore((state) => state.toggleComplete)
  const incrementLoggedTime = useTaskStore((state) => state.incrementLoggedTime)

  // Find active tracking task
  const activeTask = tasks.find((t) => t.isTracking)
  
  // Decide which task the timer card should reference
  const timerCandidate = activeTask || tasks.find((t) => t.status !== 'Completed') || tasks[0]

  // Track seconds for active task countdown/tick smoothly, adjusting during rendering if candidate changes
  const [prevCandidateId, setPrevCandidateId] = useState<string | undefined>(timerCandidate?.id)
  const [seconds, setSeconds] = useState(() => timerCandidate ? Math.round(timerCandidate.loggedTime * 3600) : 0)

  if (timerCandidate?.id !== prevCandidateId) {
    setPrevCandidateId(timerCandidate?.id)
    setSeconds(timerCandidate ? Math.round(timerCandidate.loggedTime * 3600) : 0)
  }

  useEffect(() => {
    let interval: any = null

    if (activeTask && activeTask.isTracking) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
        incrementLoggedTime(activeTask.id, 1 / 3600)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTask, incrementLoggedTime])

  // Stats calculation
  const totalTasksCount = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'Completed')
  const completedCount = completedTasks.length

  const progressPercent = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0
  const progressText = `${completedCount}/${totalTasksCount}`

  // Focus time calculation
  const totalFocusHours = tasks.reduce((sum, t) => sum + t.loggedTime, 0)
  const focusHrs = Math.floor(totalFocusHours)
  const focusMins = Math.round((totalFocusHours - focusHrs) * 60)
  const focusTimeStr = focusHrs > 0 ? `${focusHrs}h ${focusMins}m` : `${focusMins}m`

  // XP level calculation
  const totalXp = 1000 + completedCount * 80
  const currentLevel = Math.floor(totalXp / 500)
  const levelXpProgress = totalXp % 500
  const levelXpPercent = `${(levelXpProgress / 500) * 100}%`

  // Format seconds to HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600)
    const mins = Math.floor((totalSecs % 3600) / 60)
    const secs = totalSecs % 60

    const pad = (num: number) => String(num).padStart(2, '0')
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  }

  const handleProfilePress = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from Fexo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout }
      ]
    )
  }

  const handlePlayPauseTimer = () => {
    if (timerCandidate) {
      togglePlayPause(timerCandidate.id)
    }
  }

  const handleStopTimer = () => {
    if (timerCandidate) {
      toggleComplete(timerCandidate.id)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              Good Morning, {user?.firstName || 'Alex'} 👋
            </Text>
            <Text style={styles.subtitle}>Let&apos;s make today productive</Text>
          </View>
          <Pressable onPress={handleProfilePress}>
            <Image
              source={{
                uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTQ5MjM3Nzd8MA&ixlib=rb-4.1.0&q=80&w=200'
              }}
              style={styles.avatar}
            />
          </Pressable>
        </View>

        {/* Level XP Section */}
        <View style={styles.xpSection}>
          <View style={styles.xpBadge}>
            <Sparkles size={14} color="#a0b4fc" style={{ marginRight: 4 }} />
            <Text style={styles.xpBadgeText}>Level {currentLevel} · {totalXp} XP</Text>
          </View>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={['#4e5ddb', '#a855f7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: levelXpPercent as any }]}
            />
          </View>
        </View>

        {/* Grid Stats Cards */}
        <View style={styles.gridContainer}>
          <View style={styles.row}>
            {/* Card 1: Today's Progress */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>Today&apos;s Progress</Text>
                <Target size={16} color="#10b981" />
              </View>
              <View style={styles.cardBodyRow}>
                {/* Simulated conic circle indicator */}
                <View style={[styles.circleProgress, { borderLeftColor: progressPercent > 0 ? '#10b981' : '#262626', borderTopColor: progressPercent > 25 ? '#10b981' : '#262626' }]}>
                  <Text style={styles.circleProgressText}>{progressText}</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardBoldValue}>Tasks</Text>
                  <Text style={styles.cardSubtitle}>done today</Text>
                </View>
              </View>
            </View>

            {/* Card 2: Focus Time */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>Focus Time</Text>
                <Clock size={16} color="#a855f7" />
              </View>
              <View style={styles.cardBodyCol}>
                <Text style={styles.cardBigVal}>{focusTimeStr}</Text>
                <Text style={styles.cardSubtitle}>focused today</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            {/* Card 3: Productivity */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>Productivity</Text>
                <TrendingUp size={16} color="#a3e635" />
              </View>
              <View style={styles.cardBodyCol}>
                <Text style={styles.cardBigVal}>{progressPercent}%</Text>
                <Text style={styles.cardGreenVal}>{progressPercent > 50 ? '+6% vs yesterday' : '0% vs yesterday'}</Text>
              </View>
            </View>

            {/* Card 4: Streak */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>Streak</Text>
                <Flame size={16} color="#f97316" />
              </View>
              <View style={styles.cardBodyCol}>
                <Text style={styles.cardBigVal}>🔥 7 days</Text>
                <Text style={styles.cardSubtitle}>keep it up!</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Running Timer Card */}
        {timerCandidate ? (
          <LinearGradient
            colors={['#4e5ddb', '#a855f7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.timerCard}
          >
            <View style={styles.timerHeader}>
              <View style={styles.timerStatus}>
                <View style={[styles.timerPulseDot, timerCandidate.isTracking && { backgroundColor: '#10b981' }]} />
                <Text style={styles.timerStatusLabel}>
                  {timerCandidate.isTracking ? 'RUNNING TIMER' : 'TIMER PAUSED'}
                </Text>
              </View>
              <View style={[styles.activeBadge, !timerCandidate.isTracking && { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <Text style={styles.activeBadgeText}>
                  {timerCandidate.isTracking ? 'Active' : 'Paused'}
                </Text>
              </View>
            </View>
            <Text style={styles.timerTaskName}>{timerCandidate.title}</Text>

            <View style={styles.timerControlsRow}>
              <Text style={styles.timerDigits}>{formatTime(seconds)}</Text>
              <View style={styles.timerActions}>
                <Pressable
                  onPress={handlePlayPauseTimer}
                  style={({ pressed }) => [
                    styles.timerActionButton,
                    pressed && styles.buttonPressed
                  ]}
                >
                  {timerCandidate.isTracking ? (
                    <Pause size={20} color="#ffffff" />
                  ) : (
                    <Play size={20} color="#ffffff" style={{ marginLeft: 2 }} />
                  )}
                </Pressable>
                <Pressable
                  onPress={handleStopTimer}
                  style={({ pressed }) => [
                    styles.timerStopButton,
                    pressed && styles.buttonPressed
                  ]}
                >
                  <Square size={20} color="#4e5ddb" fill="#4e5ddb" />
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.timerCard, { backgroundColor: '#171717', alignItems: 'center', justifyContent: 'center', height: 120 }]}>
            <Text style={{ color: '#a1a1a1', fontSize: 15 }}>No tasks created yet</Text>
          </View>
        )}

        {/* Completed Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksHeader}>
            <View style={styles.tasksTitleRow}>
              <Text style={styles.sectionTitle}>Today&apos;s Completed Tasks</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{completedCount}</Text>
              </View>
            </View>
            <Pressable>
              <Text style={styles.seeAllText}>See all</Text>
            </Pressable>
          </View>

          {completedTasks.length === 0 ? (
            <View style={[styles.taskCard, { justifyContent: 'center', opacity: 0.5 }]}>
              <Text style={{ color: '#a1a1a1', fontSize: 14 }}>No completed tasks today</Text>
            </View>
          ) : (
            completedTasks.slice(0, 3).map((task) => {
              const totalMinutes = Math.round(task.loggedTime * 60)
              const durationStr = totalMinutes >= 60 
                ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
                : `${totalMinutes}m`

              let tagBg = 'rgba(78, 93, 219, 0.15)'
              let tagText = '#a0b4fc'
              
              const catLower = task.category.toLowerCase()
              if (catLower === 'backend') {
                tagBg = 'rgba(78, 93, 219, 0.15)'
                tagText = '#a0b4fc'
              } else if (catLower === 'design' || catLower === 'frontend') {
                tagBg = 'rgba(168, 85, 247, 0.15)'
                tagText = '#d8b4fe'
              } else if (catLower === 'testing' || catLower === 'devops') {
                tagBg = 'rgba(163, 230, 53, 0.15)'
                tagText = '#bef264'
              } else {
                tagBg = '#262626'
                tagText = '#a1a1a1'
              }

              return (
                <View key={task.id} style={styles.taskCard}>
                  <View style={styles.taskLeft}>
                    <View style={styles.checkIconBg}>
                      <Check size={16} color="#10b981" strokeWidth={3} />
                    </View>
                    <View style={styles.taskMeta}>
                      <Text style={styles.taskName}>{task.title}</Text>
                      <View style={[styles.taskTag, { backgroundColor: tagBg }]}>
                        <Text style={{ color: tagText, fontSize: 10, fontWeight: '600' }}>
                          {task.category}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.taskDuration}>{durationStr}</Text>
                </View>
              )
            })
          )}
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
    paddingBottom: 100 // Allow extra spacing for bottom tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  greetingContainer: {
    flexDirection: 'column'
  },
  greeting: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    marginBottom: 4
  },
  subtitle: {
    color: '#a1a1a1',
    fontSize: 14
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(78, 93, 219, 0.4)'
  },
  xpSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 93, 219, 0.15)',
    borderColor: 'rgba(78, 93, 219, 0.3)',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  xpBadgeText: {
    color: '#a0b4fc',
    fontSize: 12,
    fontWeight: '600'
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#262626',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4
  },
  gridContainer: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24
  },
  row: {
    flexDirection: 'row',
    gap: 16
  },
  card: {
    flex: 1,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    gap: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardHeaderTitle: {
    color: '#a1a1a1',
    fontSize: 12,
    fontWeight: '500'
  },
  cardBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  cardBodyCol: {
    flexDirection: 'column'
  },
  circleProgress: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3.5,
    borderColor: '#262626',
    borderLeftColor: '#10b981',
    borderTopColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleProgressText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  cardTextCol: {
    flexDirection: 'column'
  },
  cardBoldValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  },
  cardBigVal: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2
  },
  cardGreenVal: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '500'
  },
  cardSubtitle: {
    color: '#a1a1a1',
    fontSize: 12
  },
  timerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  timerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  timerPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    opacity: 0.8
  },
  timerStatusLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8
  },
  activeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  activeBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600'
  },
  timerTaskName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  timerControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timerDigits: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: -0.5
  },
  timerActions: {
    flexDirection: 'row',
    gap: 8
  },
  timerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timerStopButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonPressed: {
    opacity: 0.8
  },
  tasksSection: {
    flexDirection: 'column',
    gap: 12
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  tasksTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  countBadge: {
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  countBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  seeAllText: {
    color: '#a1a1a1',
    fontSize: 12,
    fontWeight: '500'
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
    gap: 12,
    flex: 1
  },
  checkIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskMeta: {
    flexDirection: 'column',
    gap: 4
  },
  taskName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500'
  },
  taskTag: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  backendTag: {
    backgroundColor: 'rgba(78, 93, 219, 0.15)'
  },
  backendTagText: {
    color: '#a0b4fc',
    fontSize: 10,
    fontWeight: '600'
  },
  designTag: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)'
  },
  designTagText: {
    color: '#d8b4fe',
    fontSize: 10,
    fontWeight: '600'
  },
  testingTag: {
    backgroundColor: 'rgba(163, 230, 53, 0.15)'
  },
  testingTagText: {
    color: '#bef264',
    fontSize: 10,
    fontWeight: '600'
  },
  taskDuration: {
    color: '#a1a1a1',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace'
  }
})
