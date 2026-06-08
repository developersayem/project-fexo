import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BarChart3, TrendingUp } from 'lucide-react-native'

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your performance parameters</Text>

        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Activity Level</Text>
            <TrendingUp size={16} color="#a3e635" />
          </View>
          <View style={styles.chartArea}>
            <BarChart3 size={48} color="#a1a1a1" style={{ opacity: 0.5 }} />
            <Text style={styles.chartText}>Analytics tracking dashboard placeholder</Text>
          </View>
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
  chartCard: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  chartArea: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    gap: 12
  },
  chartText: {
    color: '#a1a1a1',
    fontSize: 12
  }
})
