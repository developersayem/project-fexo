import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Pause,
  Play,
  Check,
  Square,
  Tag
} from 'lucide-react-native';
import { useTaskStore } from '@/store/useTaskStore';

export default function FocusModeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tasks = useTaskStore((state) => state.tasks);
  const togglePlayPause = useTaskStore((state) => state.togglePlayPause);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const incrementLoggedTime = useTaskStore((state) => state.incrementLoggedTime);

  // Find target task: from query params, or the active tracking task, or the first available task
  const targetId = typeof params.taskId === 'string' ? params.taskId : undefined;
  const activeTask = tasks.find((t) => t.isTracking);
  const task = tasks.find((t) => t.id === targetId) || activeTask || tasks.find((t) => t.status !== 'Completed') || tasks[0];

  // Track seconds count locally for smooth UI ticks
  const [seconds, setSeconds] = useState(0);
  const [prevTaskId, setPrevTaskId] = useState<string | undefined>(undefined);

  // Adjust local seconds dynamically on rendering if target task changes
  if (task && task.id !== prevTaskId) {
    setPrevTaskId(task.id);
    setSeconds(Math.round(task.loggedTime * 3600));
  }

  useEffect(() => {
    let interval: any = null;

    if (task && task.isTracking) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        incrementLoggedTime(task.id, 1 / 3600);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task, incrementLoggedTime]);

  // Format seconds to HH:MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const handlePlayPause = () => {
    if (task) {
      togglePlayPause(task.id);
    }
  };

  const handleComplete = () => {
    if (task) {
      toggleComplete(task.id);
      router.back();
    }
  };

  const handleStop = () => {
    if (task) {
      // Pause task if active
      if (task.isTracking) {
        togglePlayPause(task.id);
      }
      router.back();
    }
  };

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No task selected for Focus Mode</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Back Button Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBackBtn}>
          <ChevronLeft size={24} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} scrollEnabled={false}>
        {/* Screen Title Label */}
        <Text style={styles.focusModeLabel}>FOCUS MODE</Text>

        {/* Task Title */}
        <Text style={styles.taskTitle} numberOfLines={2}>
          {task.title}
        </Text>

        {/* Category Tag Badge */}
        <View style={styles.tagBadge}>
          <Tag size={12} color="#a1a1a1" style={{ marginRight: 6 }} />
          <Text style={styles.tagText}>{task.category}</Text>
        </View>

        {/* Concentric Circle Dial */}
        <View style={styles.dialWrapper}>
          <LinearGradient
            colors={['#8b5cf6', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.outerCircle}
          >
            <View style={styles.innerCircle}>
              <Text style={styles.timerDigits}>{formatTime(seconds)}</Text>
              <Text style={styles.elapsedLabel}>ELAPSED</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Control Button Row */}
        <View style={styles.controlsRow}>
          {/* Pause/Resume Button */}
          <Pressable
            onPress={handlePlayPause}
            style={({ pressed }) => [
              styles.controlBtn,
              styles.pauseBtn,
              pressed && styles.pressed
            ]}
          >
            {task.isTracking ? (
              <>
                <Pause size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.controlBtnText}>Pause</Text>
              </>
            ) : (
              <>
                <Play size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.controlBtnText}>Resume</Text>
              </>
            )}
          </Pressable>

          {/* Complete Button */}
          <Pressable
            onPress={handleComplete}
            style={({ pressed }) => [
              styles.controlBtn,
              styles.completeBtn,
              pressed && styles.pressed
            ]}
          >
            <Check size={18} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={[styles.controlBtnText, { color: '#ffffff' }]}>Complete</Text>
          </Pressable>

          {/* Stop Button */}
          <Pressable
            onPress={handleStop}
            style={({ pressed }) => [
              styles.controlBtn,
              styles.stopBtn,
              pressed && styles.pressed
            ]}
          >
            <Square size={16} color="#ef4444" fill="#ef4444" style={{ marginRight: 6 }} />
            <Text style={[styles.controlBtnText, { color: '#ef4444' }]}>Stop</Text>
          </Pressable>
        </View>

        {/* Footer Encouragement */}
        <Text style={styles.footerEncouragement}>
          Stay focused. You&apos;re doing great 🚀
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// Custom view scroll wrapper layout targeting full Screen presentation dimensions
const ScrollView = (props: any) => <View style={{ flex: 1, justifyContent: 'center' }} {...props} />;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a'
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80
  },
  focusModeLabel: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
    textAlign: 'center',
    marginBottom: 16
  },
  taskTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 40,
    marginBottom: 12
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 40
  },
  tagText: {
    color: '#a1a1a1',
    fontSize: 13,
    fontWeight: '500'
  },
  dialWrapper: {
    marginBottom: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  outerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    padding: 6, // Renders circular ring borders
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerCircle: {
    width: 248,
    height: 248,
    borderRadius: 124,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timerDigits: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: -0.5
  },
  elapsedLabel: {
    color: '#52525b',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 8
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    marginBottom: 40
  },
  controlBtn: {
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  pauseBtn: {
    flex: 1.1,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  completeBtn: {
    flex: 1.3,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  stopBtn: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)'
  },
  controlBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  },
  pressed: {
    opacity: 0.8
  },
  footerEncouragement: {
    color: '#71717a',
    fontSize: 13,
    textAlign: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  emptyText: {
    color: '#a1a1a1',
    fontSize: 16,
    marginBottom: 20
  },
  backButton: {
    backgroundColor: '#208AEF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  }
});
