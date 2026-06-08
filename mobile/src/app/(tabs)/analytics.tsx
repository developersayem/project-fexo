import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Clock,
  CheckCircle2,
  Timer as TimerIcon
} from 'lucide-react-native';
import { useTaskStore } from '@/store/useTaskStore';

const screenWidth = Dimensions.get('window').width;

// Custom Line Segment vector rendering helper
const AreaLineSegment = ({ x1, y1, x2, y2 }: { x1: number, y1: number, x2: number, y2: number }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return (
    <View
      style={{
        position: 'absolute',
        left: x1,
        top: y1 + dy / 2 - 1, // centered vertical line offset
        width: distance,
        height: 2.5,
        backgroundColor: '#208AEF',
        transform: [{ rotate: `${angle}deg` }],
        zIndex: 5
      }}
    />
  );
};

export default function AnalyticsScreen() {
  const tasks = useTaskStore((state) => state.tasks);

  // Time Period tab filter state
  const [activeTab, setActiveTab] = useState<'Week' | 'Month' | 'Year'>('Week');

  // Dynamic statistics calculations
  const storeCompletedCount = tasks.filter((t) => t.status === 'Completed').length;
  const storePendingCount = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const storeFocusHours = tasks.reduce((sum, t) => sum + t.loggedTime, 0);

  // Combine with realistic mock baselines to match UI design layouts
  const totalHours = Math.round(38 + storeFocusHours);
  const completedCount = 42 + storeCompletedCount;
  const pendingCount = 12 + storePendingCount;
  const totalTasksCount = completedCount + pendingCount;
  
  const completionRatePercent = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 78;
  const avgTaskMinutes = completedCount > 0 ? Math.round((totalHours * 60) / completedCount) : 54;

  // Render Daily Hours Bar data
  const baseDailyData = [
    { day: 'Mon', hours: 6 },
    { day: 'Tue', hours: 8 },
    { day: 'Wed', hours: 5 },
    { day: 'Thu', hours: 7 },
    { day: 'Fri', hours: 9 },
    { day: 'Sat', hours: 3 },
    { day: 'Sun', hours: 2 },
  ];

  // Dynamically add store hours to today's bar
  const getTodayName = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
  };

  const todayName = getTodayName();
  const dailyData = baseDailyData.map((d) => {
    if (d.day === todayName) {
      return { ...d, hours: Number((d.hours + storeFocusHours).toFixed(1)) };
    }
    return d;
  });

  const maxDailyHours = Math.max(...dailyData.map((d) => d.hours), 10);

  // Area Chart Data Points (x & y coordinates mapping in container box)
  // Area Chart container Dimensions: width = screenWidth - 88 (paddings), height = 120
  const chartWidth = screenWidth - 88;
  const chartHeight = 110;
  
  const rawAreaPoints = [
    { label: 'W1', hours: 28 },
    { label: 'W2', hours: 34 },
    { label: 'W3', hours: 30 },
    { label: 'W4', hours: totalHours } // dynamically tracks total hours
  ];

  const maxAreaHours = Math.max(...rawAreaPoints.map((p) => p.hours), 45);

  // Map raw data points to container coordinates
  const areaPoints = rawAreaPoints.map((p, idx) => {
    const xStep = chartWidth / (rawAreaPoints.length - 1);
    const x = idx * xStep;
    const y = chartHeight - (p.hours / maxAreaHours) * chartHeight;
    return { x, y, label: p.label };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Title & Tab Filter */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <View style={styles.tabCapsule}>
            {(['Week', 'Month', 'Year'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabButton,
                    isActive && styles.tabButtonActive
                  ]}
                >
                  <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Top 3 Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Card 1: Total Hours */}
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Clock size={16} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{totalHours}h</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>

          {/* Card 2: Tasks Done */}
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <CheckCircle2 size={16} color="#a855f7" />
            </View>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>

          {/* Card 3: Avg Task */}
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
              <TimerIcon size={16} color="#f97316" />
            </View>
            <Text style={styles.statValue}>{avgTaskMinutes}m</Text>
            <Text style={styles.statLabel}>Avg Task</Text>
          </View>
        </View>

        {/* Daily Hours Bar Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.chartCardTitle}>Daily Hours</Text>
            <Text style={styles.chartCardSubtitle}>Hours tracked per day</Text>
          </View>

          <View style={styles.barChartContainer}>
            {/* Horizontal Grid lines */}
            <View style={styles.gridLinesContainer}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={[styles.gridLine, { borderBottomWidth: 0 }]} />
            </View>

            {/* Bars row */}
            <View style={styles.barsRow}>
              {dailyData.map((d) => {
                const barFillHeight = `${(d.hours / maxDailyHours) * 100}%`;
                const isToday = d.day === todayName;

                return (
                  <View key={d.day} style={styles.barColumn}>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                           styles.barFill,
                           { height: barFillHeight as any },
                           isToday && { backgroundColor: '#a855f7' } // Highlight today
                         ]}
                      />
                    </View>
                    <Text style={[styles.barLabel, isToday && styles.barLabelActive]}>
                      {d.day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Completion Rate Donut Card */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.chartCardTitle}>Completion Rate</Text>
            <Text style={styles.chartCardSubtitle}>Completed vs pending tasks</Text>
          </View>

          <View style={styles.donutRow}>
            {/* Donut circle container */}
            <View style={styles.donutContainer}>
              <View style={styles.donutBaseRing} />
              <View
                style={[
                  styles.donutProgressArc,
                  {
                    borderTopColor: '#208AEF',
                    borderRightColor: '#208AEF',
                    borderBottomColor: completionRatePercent >= 75 ? '#208AEF' : 'transparent',
                    borderLeftColor: completionRatePercent >= 50 ? '#208AEF' : 'transparent',
                    transform: [{ rotate: '-45deg' }] // Rotates empty slot to bottom-left
                  }
                ]}
              />
              <View style={styles.donutCenter}>
                <Text style={styles.donutPercentText}>{completionRatePercent}%</Text>
                <Text style={styles.donutDoneLabel}>Done</Text>
              </View>
            </View>

            {/* Donut Legend */}
            <View style={styles.donutLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#208AEF' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendTitle}>Completed</Text>
                  <Text style={styles.legendCount}>{completedCount} tasks</Text>
                </View>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#27272a' }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendTitle}>Pending</Text>
                  <Text style={styles.legendCount}>{pendingCount} tasks</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Hours Area Chart Card */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.chartCardTitle}>Monthly Hours</Text>
            <Text style={styles.chartCardSubtitle}>Past 4 weeks trend</Text>
          </View>

          <View style={styles.areaChartWrapper}>
            {/* Horizontal Grid lines */}
            <View style={styles.gridLinesContainer}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={[styles.gridLine, { borderBottomWidth: 0 }]} />
            </View>

            {/* Area Vector and fills */}
            <View style={[styles.vectorAreaContainer, { height: chartHeight }]}>
              {/* Lines drawing overlay */}
              {areaPoints.map((p, idx) => {
                if (idx === areaPoints.length - 1) return null;
                const nextPoint = areaPoints[idx + 1];
                return (
                  <AreaLineSegment
                    key={idx}
                    x1={p.x}
                    y1={p.y}
                    x2={nextPoint.x}
                    y2={nextPoint.y}
                  />
                );
              })}

              {/* Shaded Area Columns underneath */}
              <View style={styles.gradientAreaColumns}>
                {areaPoints.map((p, idx) => {
                  const columnHeight = chartHeight - p.y;
                  return (
                    <View key={idx} style={styles.gradientColumn}>
                      <LinearGradient
                        colors={['rgba(32, 138, 239, 0.4)', 'rgba(32, 138, 239, 0.0)']}
                        style={{ height: columnHeight, width: 24, borderRadius: 4 }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Labels Row */}
            <View style={styles.xAxisRow}>
              {areaPoints.map((p, idx) => (
                <Text key={idx} style={styles.xAxisLabel}>
                  {p.label}
                </Text>
              ))}
            </View>
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
    paddingBottom: 110 // Space for tabs bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5
  },
  tabCapsule: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 3
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16
  },
  tabButtonActive: {
    backgroundColor: '#208AEF'
  },
  tabButtonText: {
    color: '#a1a1a1',
    fontSize: 12,
    fontWeight: '600'
  },
  tabButtonTextActive: {
    color: '#ffffff'
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'column',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  statLabel: {
    color: '#a1a1a1',
    fontSize: 11
  },
  chartCard: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'column',
    gap: 16
  },
  cardHeader: {
    flexDirection: 'column',
    gap: 4
  },
  chartCardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  chartCardSubtitle: {
    color: '#a1a1a1',
    fontSize: 12
  },
  barChartContainer: {
    height: 160,
    position: 'relative',
    justifyContent: 'flex-end'
  },
  gridLinesContainer: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'space-between',
    paddingBottom: 24 // Align above bottom day labels
  },
  gridLine: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    borderStyle: 'dashed'
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    zIndex: 2,
    paddingHorizontal: 4
  },
  barColumn: {
    alignItems: 'center',
    width: 32,
    height: '100%',
    justifyContent: 'flex-end',
    gap: 8
  },
  barTrack: {
    flex: 1,
    justifyContent: 'flex-end',
    width: 14
  },
  barFill: {
    width: 14,
    backgroundColor: '#208AEF',
    borderRadius: 6
  },
  barLabel: {
    color: '#71717a',
    fontSize: 11
  },
  barLabelActive: {
    color: '#a855f7',
    fontWeight: '600'
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 10
  },
  donutContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  donutBaseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 12,
    borderColor: 'rgba(255, 255, 255, 0.05)'
  },
  donutProgressArc: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 12,
    borderColor: 'transparent'
  },
  donutCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  donutPercentText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5
  },
  donutDoneLabel: {
    color: '#a1a1a1',
    fontSize: 10,
    marginTop: 2
  },
  donutLegend: {
    flex: 1,
    flexDirection: 'column',
    gap: 12
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  legendTextContainer: {
    flexDirection: 'column'
  },
  legendTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  },
  legendCount: {
    color: '#a1a1a1',
    fontSize: 12,
    marginTop: 1
  },
  areaChartWrapper: {
    height: 160,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingHorizontal: 4
  },
  vectorAreaContainer: {
    position: 'absolute',
    left: 4,
    right: 4,
    top: 0,
    zIndex: 2
  },
  gradientAreaColumns: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 0
  },
  gradientColumn: {
    width: 24,
    alignItems: 'center'
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    marginTop: 110, // places below the chart height
    paddingHorizontal: 4
  },
  xAxisLabel: {
    color: '#71717a',
    fontSize: 11
  }
});
