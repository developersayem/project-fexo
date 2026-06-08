import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  Clock,
  Timer as TimerIcon,
  Pause,
  Play,
  Check,
  Plus
} from 'lucide-react-native'
import { useTaskStore } from '@/store/useTaskStore'

export default function TasksScreen() {
  const router = useRouter()
  const tasks = useTaskStore((state) => state.tasks)
  const togglePlayPause = useTaskStore((state) => state.togglePlayPause)
  const toggleComplete = useTaskStore((state) => state.toggleComplete)
  const incrementLoggedTime = useTaskStore((state) => state.incrementLoggedTime)

  // Filter state: 'Today' | 'All' | 'In Progress' | 'Completed'
  const [activeFilter, setActiveFilter] = useState<'Today' | 'All' | 'In Progress' | 'Completed'>('Today')

  // Timer simulation for active tracking task
  useEffect(() => {
    let interval: any = null

    const trackingTask = tasks.find((t) => t.isTracking)
    if (trackingTask) {
      interval = setInterval(() => {
        // Increment logged time by ~1 minute in hours (0.01 hours)
        incrementLoggedTime(trackingTask.id, 0.01)
      }, 5000) // update every 5 seconds for visual effect
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [tasks, incrementLoggedTime])

  const handlePlayPause = (taskId: string) => {
    togglePlayPause(taskId)
  }

  const handleToggleComplete = (taskId: string) => {
    toggleComplete(taskId)
  }

  const handleAddNewTask = () => {
    router.push('/new-task')
  }

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'Today') return task.status !== 'Completed' // Show active tasks
    if (activeFilter === 'All') return true
    if (activeFilter === 'In Progress') return task.status === 'In Progress'
    if (activeFilter === 'Completed') return task.status === 'Completed'
    return true
  })

  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tasks</Text>
            <Text style={styles.subtitle}>
              {tasks.length} tasks · {inProgressCount} in progress
            </Text>
          </View>
          <Pressable
            onPress={handleAddNewTask}
            style={({ pressed }) => [
              styles.plusButton,
              pressed && styles.pressed
            ]}
          >
            <Plus size={24} color="#ffffff" />
          </Pressable>
        </View>

        {/* Filter Scroll Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersRow}
          contentContainerStyle={styles.filtersContainer}
        >
          {(['Today', 'All', 'In Progress', 'Completed'] as const).map((filter) => {
            const isActive = activeFilter === filter
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip,
                  isActive ? styles.filterChipActive : styles.filterChipInactive
                ]}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {filter}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {/* Task Cards list */}
        <View style={styles.tasksList}>
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed'
            return (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  isCompleted && styles.taskCardCompleted
                ]}
              >
                {/* Priority left border indicator */}
                <View style={[styles.priorityBorder, { backgroundColor: task.priorityColor }]} />

                <View style={styles.cardInner}>
                  <View style={styles.cardContent}>
                    {/* Header tags */}
                    <View style={styles.cardHeader}>
                      <Text style={[styles.priorityText, { color: task.priorityColor }]}>
                        {task.priority.toUpperCase()}
                      </Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{task.category}</Text>
                      </View>
                    </View>

                    {/* Task Title */}
                    <Text
                      style={[
                        styles.taskTitle,
                        isCompleted && styles.taskTitleCompleted
                      ]}
                      numberOfLines={2}
                    >
                      {task.title}
                    </Text>

                    {/* Footer indicators */}
                    <View style={styles.cardFooter}>
                      <View style={styles.metaItem}>
                        <Clock size={14} color="#a1a1a1" />
                        <Text style={styles.metaText}>{task.estimatedTime}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <TimerIcon size={14} color="#a1a1a1" />
                        <Text style={styles.metaText}>{task.loggedTime}h</Text>
                      </View>
                      
                      {/* Status badges */}
                      {task.status === 'In Progress' && (
                        <View style={[styles.statusBadge, styles.inProgressBadge]}>
                          <Text style={styles.inProgressBadgeText}>In Progress</Text>
                        </View>
                      )}
                      {task.status === 'Pending' && (
                        <View style={[styles.statusBadge, styles.pendingBadge]}>
                          <Text style={styles.pendingBadgeText}>Pending</Text>
                        </View>
                      )}
                      {task.status === 'Completed' && (
                        <View style={[styles.statusBadge, styles.completedBadge]}>
                          <Text style={styles.completedBadgeText}>Completed</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Actions column */}
                  <View style={styles.actionColumn}>
                    {isCompleted ? (
                      <Pressable
                        onPress={() => handleToggleComplete(task.id)}
                        style={styles.checkButton}
                      >
                        <Check size={16} color="#10b981" strokeWidth={3} />
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={() => handlePlayPause(task.id)}
                        style={[
                          styles.playPauseButton,
                          task.isTracking && styles.pauseButtonActive
                        ]}
                      >
                        {task.isTracking ? (
                          <Pause size={16} color="#ffffff" />
                        ) : (
                          <Play size={16} color="#ffffff" style={{ marginLeft: 2 }} />
                        )}
                      </Pressable>
                    )}

                    {/* Long press/tap target for completing a pending task */}
                    {!isCompleted && (
                      <Pressable
                        onPress={() => handleToggleComplete(task.id)}
                        style={styles.markCompleteTap}
                      >
                        <Text style={styles.markCompleteTapText}>Done</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            )
          })}
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
    paddingTop: 20,
    paddingBottom: 120 // Allow extra spacing for bottom tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5
  },
  subtitle: {
    color: '#a1a1a1',
    fontSize: 14,
    marginTop: 4
  },
  plusButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6
  },
  pressed: {
    opacity: 0.8
  },
  filtersRow: {
    maxHeight: 50,
    marginBottom: 20,
    paddingLeft: 24
  },
  filtersContainer: {
    paddingRight: 40,
    gap: 8
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filterChipActive: {
    backgroundColor: '#208AEF'
  },
  filterChipInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  filterChipText: {
    color: '#a1a1a1',
    fontSize: 14,
    fontWeight: '500'
  },
  filterChipTextActive: {
    color: '#ffffff'
  },
  tasksList: {
    flexDirection: 'column',
    gap: 16,
    paddingHorizontal: 24
  },
  taskCard: {
    backgroundColor: '#171717',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    position: 'relative'
  },
  taskCardCompleted: {
    opacity: 0.7
  },
  priorityBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6
  },
  cardInner: {
    flexDirection: 'row',
    padding: 16,
    paddingLeft: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cardContent: {
    flex: 1,
    flexDirection: 'column',
    gap: 6
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8
  },
  categoryBadge: {
    backgroundColor: '#262626',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12
  },
  categoryBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500'
  },
  taskTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 4
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#737373'
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metaText: {
    color: '#a1a1a1',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace'
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10
  },
  inProgressBadge: {
    backgroundColor: 'rgba(32, 138, 239, 0.25)'
  },
  inProgressBadgeText: {
    color: '#90caf9',
    fontSize: 11,
    fontWeight: '600'
  },
  pendingBadge: {
    backgroundColor: '#262626'
  },
  pendingBadgeText: {
    color: '#a1a1a1',
    fontSize: 11,
    fontWeight: '600'
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)'
  },
  completedBadgeText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '600'
  },
  actionColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginLeft: 12
  },
  playPauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pauseButtonActive: {
    backgroundColor: '#208AEF' // stays blue
  },
  checkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center'
  },
  markCompleteTap: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  markCompleteTapText: {
    color: '#208AEF',
    fontSize: 12,
    fontWeight: '600'
  }
})
