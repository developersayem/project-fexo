import { Tabs } from 'expo-router'
import { StyleSheet, View, Platform } from 'react-native'
import {
  Home,
  CheckSquare,
  BarChart3,
  Calendar,
  User
} from 'lucide-react-native'
import { AnimatedSplashOverlay } from '@/components/animated-icon'

export default function TabLayout() {
  return (
    <>
      <AnimatedSplashOverlay />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#208AEF',
          tabBarInactiveTintColor: '#a1a1a1',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Home size={22} color={color} />
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tasksIconContainer,
                  focused ? styles.tasksIconContainerActive : styles.tasksIconContainerInactive
                ]}
              >
                <CheckSquare size={22} color={focused ? '#ffffff' : color} />
              </View>
            )
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => <Calendar size={22} color={color} />
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User size={22} color={color} />
          }}
        />
      </Tabs>
    </>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#121212',
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 74,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4
  },
  tabBarIcon: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  tasksIconContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  tasksIconContainerActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#208AEF',
    marginTop: -20,
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5
  },
  tasksIconContainerInactive: {
    width: 'auto',
    height: 'auto',
    backgroundColor: 'transparent',
    marginTop: 0
  }
})
