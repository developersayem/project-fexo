import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Timer,
  Zap,
} from 'lucide-react-native';
import { useTaskStore } from '@/store/useTaskStore';

// Mock schedule lookup for days with events to support rich visuals instantly
interface ActivityItem {
  title: string;
  category: string;
  timeString: string;
  type: 'Done' | 'Focus';
  iconType: 'CheckSquare' | 'Timer';
}

const MOCK_ACTIVITIES_BY_DAY: Record<number, ActivityItem[]> = {
  3: [
    { title: 'Deep Work Session', category: 'Deep Work', timeString: '1h 45m', type: 'Focus', iconType: 'Timer' }
  ],
  4: [
    { title: 'Configure CI/CD cache', category: 'DevOps', timeString: '2h 10m', type: 'Done', iconType: 'CheckSquare' }
  ],
  5: [
    { title: 'Fix Auth middleware bug', category: 'Backend', timeString: '1h 05m', type: 'Done', iconType: 'CheckSquare' }
  ],
  6: [
    { title: 'Focus Sprint', category: 'Deep Work', timeString: '3h 15m', type: 'Focus', iconType: 'Timer' }
  ],
  9: [
    { title: 'Refactor state store', category: 'Frontend', timeString: '1h 50m', type: 'Done', iconType: 'CheckSquare' }
  ],
  10: [
    { title: 'Setup Test suites', category: 'Testing', timeString: '2h 15m', type: 'Done', iconType: 'CheckSquare' }
  ],
  11: [
    { title: 'Research OAuth', category: 'Backend', timeString: '1h 30m', type: 'Focus', iconType: 'Timer' }
  ],
  12: [
    { title: 'Optimize loading performance', category: 'Performance', timeString: '3h 00m', type: 'Done', iconType: 'CheckSquare' }
  ],
  15: [
    { title: 'Design System Sync', category: 'Design', timeString: '2h 00m', type: 'Focus', iconType: 'Timer' }
  ],
  16: [
    { title: 'Update API Endpoints', category: 'Backend', timeString: '1h 20m', type: 'Done', iconType: 'CheckSquare' }
  ],
  17: [
    { title: 'Review CSS styles layout', category: 'Styling', timeString: '45m', type: 'Done', iconType: 'CheckSquare' }
  ],
  18: [
    { title: 'Drafting documentation', category: 'Docs', timeString: '1h 45m', type: 'Focus', iconType: 'Timer' }
  ],
  19: [
    { title: 'Deploy staging cluster', category: 'DevOps', timeString: '2h 30m', type: 'Done', iconType: 'CheckSquare' }
  ],
  22: [
    { title: 'Fix CSS button alignments', category: 'Frontend', timeString: '50m', type: 'Done', iconType: 'CheckSquare' }
  ],
  23: [
    { title: 'Focus Session', category: 'Deep Work', timeString: '3h 20m', type: 'Focus', iconType: 'Timer' }
  ],
  24: [
    { title: 'Fix Auth Bug', category: 'Backend', timeString: '1h 23m', type: 'Done', iconType: 'CheckSquare' },
    { title: 'Focus Session', category: 'Deep Work', timeString: '2h 14m', type: 'Focus', iconType: 'Timer' },
    { title: 'Update API Docs', category: 'Docs', timeString: '45m', type: 'Done', iconType: 'CheckSquare' },
  ],
  25: [
    { title: 'Setup DB Schema', category: 'Database', timeString: '2h 00m', type: 'Done', iconType: 'CheckSquare' },
    { title: 'Focus Session', category: 'Design System', timeString: '1h 30m', type: 'Focus', iconType: 'Timer' },
  ],
  26: [
    { title: 'Code Refactoring Session', category: 'Refactoring', timeString: '2h 15m', type: 'Focus', iconType: 'Timer' }
  ],
  29: [
    { title: 'Bug triage session', category: 'Testing', timeString: '1h 10m', type: 'Done', iconType: 'CheckSquare' }
  ],
  30: [
    { title: 'End-of-month review', category: 'Planning', timeString: '1h 30m', type: 'Focus', iconType: 'Timer' }
  ]
};

// 12 Weeks Productivity Heatmap Mock Grid (each column has 7 squares)
const HEATMAP_GRID = [
  [2, 0, 1, 3, 2, 0, 4], // Col 1
  [1, 4, 2, 0, 3, 1, 0], // Col 2
  [0, 2, 5, 3, 1, 4, 2], // Col 3
  [3, 0, 2, 4, 1, 0, 3], // Col 4
  [1, 3, 0, 2, 5, 2, 1], // Col 5
  [2, 4, 1, 0, 3, 4, 0], // Col 6
  [0, 1, 3, 2, 0, 1, 4], // Col 7
  [3, 2, 0, 4, 2, 3, 1], // Col 8
  [1, 0, 2, 1, 5, 0, 3], // Col 9
  [4, 2, 3, 0, 1, 4, 2], // Col 10
  [2, 5, 1, 3, 2, 0, 3]  // Col 11
];

export default function CalendarScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [currentMonth, setCurrentMonth] = useState<string>('June 2025');

  // Days mapping sets
  const taskDays = new Set([4, 5, 9, 10, 12, 16, 17, 19, 22, 25, 29]);
  const focusDays = new Set([3, 6, 11, 15, 18, 23, 26, 30]);

  // Compute tasks done dynamically for the selected day from the store
  const getActivitiesForSelectedDay = (): ActivityItem[] => {
    // If selected day is 24, combine store completed tasks + static mock tasks
    const matchedMock = MOCK_ACTIVITIES_BY_DAY[selectedDay] || [];
    
    if (selectedDay === 24) {
      // Find completed tasks from store
      const storeCompleted = tasks
        .filter((t) => t.status === 'Completed')
        .map((t) => ({
          title: t.title,
          category: t.category,
          timeString: `${Math.floor(t.loggedTime)}h ${Math.round((t.loggedTime % 1) * 60)}m`,
          type: 'Done' as const,
          iconType: 'CheckSquare' as const
        }));
      
      // Filter out duplicate titles
      const finalItems: ActivityItem[] = [...storeCompleted];
      matchedMock.forEach((m) => {
        if (!finalItems.some((f) => f.title.toLowerCase() === m.title.toLowerCase())) {
          finalItems.push(m);
        }
      });
      return finalItems;
    }

    return matchedMock;
  };

  const selectedActivities = getActivitiesForSelectedDay();

  // Grid layout parameters for June 2025 (Starts Sunday, 30 days)
  const totalDays = 30;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const trailingEmpty = Array.from({ length: 5 }, (_, i) => i + 1); // Monday is 30, Tuesday-Saturday blank

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };

  const handleMonthToggle = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentMonth(currentMonth === 'June 2025' ? 'July 2025' : 'June 2025');
    } else {
      setCurrentMonth(currentMonth === 'June 2025' ? 'May 2025' : 'June 2025');
    }
  };

  // Helper to determine contribution color
  const getContributionColor = (level: number) => {
    switch (level) {
      case 0: return 'rgba(255, 255, 255, 0.04)';
      case 1: return 'rgba(32, 138, 239, 0.15)';
      case 2: return 'rgba(32, 138, 239, 0.35)';
      case 3: return 'rgba(32, 138, 239, 0.55)';
      case 4: return 'rgba(32, 138, 239, 0.75)';
      case 5: return 'rgba(32, 138, 239, 1.0)';
      default: return 'rgba(255, 255, 255, 0.04)';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title & Navigation Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Calendar</Text>
            <Text style={styles.monthLabel}>{currentMonth}</Text>
          </View>
          <View style={styles.navButtons}>
            <Pressable
              onPress={() => handleMonthToggle('prev')}
              style={({ pressed }) => [styles.navBtn, pressed && styles.pressed]}
            >
              <ChevronLeft size={16} color="#ffffff" />
            </Pressable>
            <Pressable
              onPress={() => handleMonthToggle('next')}
              style={({ pressed }) => [styles.navBtn, pressed && styles.pressed]}
            >
              <ChevronRight size={16} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Week Headers */}
          <View style={styles.weekHeadersRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <Text key={idx} style={styles.weekHeaderCell}>{day}</Text>
            ))}
          </View>

          {/* Grid Cells */}
          <View style={styles.daysGrid}>
            {daysArray.map((day) => {
              const isSelected = day === selectedDay;
              const hasTask = taskDays.has(day);
              const hasFocus = focusDays.has(day);
              
              return (
                <Pressable
                  key={day}
                  onPress={() => handleDaySelect(day)}
                  style={styles.gridCell}
                >
                  <View style={[
                    styles.dayNumberWrapper,
                    isSelected && styles.dayNumberWrapperSelected
                  ]}>
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      (day === 1 || day === 7 || day === 8 || day === 13 || day === 14 || day === 20 || day === 21 || day === 27 || day === 28) && !isSelected && styles.weekendText
                    ]}>
                      {day}
                    </Text>
                  </View>
                  
                  {/* Dot Indicators */}
                  {!isSelected && (
                    <View style={styles.dotsRow}>
                      {hasTask && <View style={[styles.dot, styles.taskDot]} />}
                      {hasFocus && <View style={[styles.dot, styles.focusDot]} />}
                    </View>
                  )}
                </Pressable>
              );
            })}
            
            {/* Trailing empty cells to fill the row grid */}
            {trailingEmpty.map((val) => (
              <View key={`empty-${val}`} style={styles.gridCell} />
            ))}
          </View>

          {/* Legend divider line & badges */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, styles.taskDot]} />
              <Text style={styles.legendText}>Tasks</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, styles.focusDot]} />
              <Text style={styles.legendText}>Focus</Text>
            </View>
          </View>
        </View>

        {/* Selected Activity Section */}
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>{"Today's Activity"}</Text>
            <Text style={styles.activityDateLabel}>Jun {selectedDay}</Text>
          </View>

          <View style={styles.activityList}>
            {selectedActivities.length > 0 ? (
              selectedActivities.map((act, idx) => (
                <View key={idx} style={styles.activityItem}>
                  <View style={[
                    styles.activityIconBox,
                    act.type === 'Done' ? styles.taskIconBoxBg : styles.focusIconBoxBg
                  ]}>
                    {act.iconType === 'CheckSquare' ? (
                      <CheckSquare size={16} color={act.type === 'Done' ? '#208AEF' : '#10b981'} />
                    ) : (
                      <Timer size={16} color={act.type === 'Done' ? '#208AEF' : '#10b981'} />
                    )}
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityItemTitle} numberOfLines={1}>{act.title}</Text>
                    <Text style={styles.activityItemSub}>{act.category} · {act.timeString}</Text>
                  </View>
                  <View style={[
                    styles.badge,
                    act.type === 'Done' ? styles.doneBadge : styles.focusBadge
                  ]}>
                    <Text style={[
                      styles.badgeText,
                      act.type === 'Done' ? styles.doneBadgeText : styles.focusBadgeText
                    ]}>
                      {act.type}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noActivitiesBox}>
                <Text style={styles.noActivitiesText}>No logged task or focus activities for this day.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Productivity Heatmap Section */}
        <View style={styles.heatmapCard}>
          <View style={styles.heatmapHeader}>
            <Text style={styles.heatmapTitle}>Productivity Heatmap</Text>
            <Text style={styles.heatmapSub}>Last 12 weeks</Text>
          </View>
          
          {/* Months labels row */}
          <View style={styles.monthsLabelRow}>
            <Text style={[styles.monthText, { marginLeft: 26 }]}>Apr</Text>
            <Text style={styles.monthText}>May</Text>
            <Text style={styles.monthText}>Jun</Text>
          </View>

          <View style={styles.heatmapContent}>
            {/* Weekday Row Labels */}
            <View style={styles.weekdayLabels}>
              <Text style={styles.weekdayText}>M</Text>
              <Text style={styles.weekdayText}>W</Text>
              <Text style={styles.weekdayText}>F</Text>
            </View>

            {/* Matrix Columns */}
            <View style={styles.heatmapGridContainer}>
              {HEATMAP_GRID.map((col, cIdx) => (
                <View key={cIdx} style={styles.heatmapColumn}>
                  {col.map((val, rIdx) => (
                    <View
                      key={rIdx}
                      style={[
                        styles.heatmapSquare,
                        { backgroundColor: getContributionColor(val) }
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Heatmap Legend */}
          <View style={styles.heatmapLegendRow}>
            <View style={styles.heatmapLegendItems}>
              <Text style={styles.legendSideLabel}>Less</Text>
              {[1, 2, 3, 5].map((lvl, index) => (
                <View
                  key={index}
                  style={[
                    styles.heatmapSquareLegend,
                    { backgroundColor: getContributionColor(lvl) }
                  ]}
                />
              ))}
              <Text style={styles.legendSideLabel}>More</Text>
            </View>
            <Text style={styles.heatmapCountText}>142 contributions</Text>
          </View>
        </View>

        {/* Focus Sessions list */}
        <View style={styles.focusSessionsCard}>
          <View style={styles.focusSessionsHeader}>
            <Text style={styles.focusSessionsTitle}>Focus Sessions</Text>
            <Text style={styles.focusSessionsSub}>This week</Text>
          </View>
          
          <View style={styles.sessionsList}>
            {/* Session 1 */}
            <View style={styles.sessionItem}>
              <View style={[styles.sessionIconBox, { backgroundColor: 'rgba(32, 138, 239, 0.15)' }]}>
                <Zap size={15} color="#208AEF" />
              </View>
              <View style={styles.sessionProgressWrapper}>
                <View style={styles.sessionInfoRow}>
                  <Text style={styles.sessionDayLabel}>Mon, Jun 23</Text>
                  <Text style={styles.sessionDurationLabel}>3h 20m</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '83%', backgroundColor: '#208AEF' }]} />
                </View>
              </View>
            </View>

            {/* Session 2 */}
            <View style={styles.sessionItem}>
              <View style={[styles.sessionIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Zap size={15} color="#a855f7" />
              </View>
              <View style={styles.sessionProgressWrapper}>
                <View style={styles.sessionInfoRow}>
                  <Text style={styles.sessionDayLabel}>Tue, Jun 24</Text>
                  <Text style={styles.sessionDurationLabel}>2h 14m</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '56%', backgroundColor: '#a855f7' }]} />
                </View>
              </View>
            </View>

            {/* Session 3 */}
            <View style={styles.sessionItem}>
              <View style={[styles.sessionIconBox, { backgroundColor: 'rgba(32, 138, 239, 0.15)' }]}>
                <Zap size={15} color="#208AEF" />
              </View>
              <View style={styles.sessionProgressWrapper}>
                <View style={styles.sessionInfoRow}>
                  <Text style={styles.sessionDayLabel}>Wed, Jun 25</Text>
                  <Text style={styles.sessionDurationLabel}>4h 05m</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '100%', backgroundColor: '#208AEF' }]} />
                </View>
              </View>
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
    paddingBottom: 110 // offset for navigation tabs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  monthLabel: {
    color: '#a1a1a1',
    fontSize: 14,
    marginTop: 4
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  calendarCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24
  },
  weekHeadersRow: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-between'
  },
  weekHeaderCell: {
    color: '#71717a',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 12,
    width: '14.28%',
    paddingVertical: 4
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8
  },
  gridCell: {
    width: '14.28%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  dayNumberWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayNumberWrapperSelected: {
    backgroundColor: '#208AEF'
  },
  dayText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500'
  },
  dayTextSelected: {
    fontWeight: 'bold',
    color: '#ffffff'
  },
  weekendText: {
    color: '#71717a'
  },
  dotsRow: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 3,
    width: '100%'
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2
  },
  taskDot: {
    backgroundColor: '#208AEF'
  },
  focusDot: {
    backgroundColor: '#10b981'
  },
  legendContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 16,
    paddingTop: 16,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'flex-start'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  legendText: {
    color: '#71717a',
    fontSize: 12
  },
  activityCard: {
    backgroundColor: '#121212',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    marginBottom: 24
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  activityTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  },
  activityDateLabel: {
    color: '#71717a',
    fontSize: 12
  },
  activityList: {
    flexDirection: 'column',
    gap: 10
  },
  activityItem: {
    backgroundColor: '#18181b',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  activityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  },
  taskIconBoxBg: {
    backgroundColor: 'rgba(32, 138, 239, 0.15)'
  },
  focusIconBoxBg: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)'
  },
  activityInfo: {
    flex: 1,
    minWidth: 0
  },
  activityItemTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500'
  },
  activityItemSub: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  doneBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)'
  },
  focusBadge: {
    backgroundColor: 'rgba(32, 138, 239, 0.1)'
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500'
  },
  doneBadgeText: {
    color: '#10b981'
  },
  focusBadgeText: {
    color: '#208AEF'
  },
  noActivitiesBox: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noActivitiesText: {
    color: '#71717a',
    fontSize: 13,
    textAlign: 'center'
  },
  heatmapCard: {
    backgroundColor: '#121212',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    marginBottom: 24
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  heatmapTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  },
  heatmapSub: {
    color: '#71717a',
    fontSize: 12
  },
  monthsLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8
  },
  monthText: {
    color: '#71717a',
    fontSize: 10,
    flex: 1,
    textAlign: 'center'
  },
  heatmapContent: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  weekdayLabels: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 98,
    paddingVertical: 4
  },
  weekdayText: {
    color: '#71717a',
    fontSize: 10,
    lineHeight: 12
  },
  heatmapGridContainer: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
    justifyContent: 'space-between'
  },
  heatmapColumn: {
    flexDirection: 'column',
    gap: 4
  },
  heatmapSquare: {
    width: 18,
    height: 11,
    borderRadius: 2
  },
  heatmapLegendRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 16,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heatmapLegendItems: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  legendSideLabel: {
    color: '#71717a',
    fontSize: 10
  },
  heatmapSquareLegend: {
    width: 12,
    height: 12,
    borderRadius: 2
  },
  heatmapCountText: {
    color: '#71717a',
    fontSize: 10
  },
  focusSessionsCard: {
    backgroundColor: '#121212',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20
  },
  focusSessionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  focusSessionsTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  },
  focusSessionsSub: {
    color: '#208AEF',
    fontSize: 12
  },
  sessionsList: {
    flexDirection: 'column',
    gap: 14
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  sessionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0
  },
  sessionProgressWrapper: {
    flex: 1
  },
  sessionInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  sessionDayLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500'
  },
  sessionDurationLabel: {
    color: '#71717a',
    fontSize: 12
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#18181b',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  pressed: {
    opacity: 0.8
  }
});
