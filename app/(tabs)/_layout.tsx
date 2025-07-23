import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'カレンダー',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />, // アイコンは仮
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: '記録',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.rectangle.on.rectangle" color={color} />, // アイコンは仮
        }}
      />
      <Tabs.Screen
        name="suggest"
        options={{
          title: '提案',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="lightbulb" color={color} />, // アイコンは仮
        }}
      />
      <Tabs.Screen
        name="stat"
        options={{
          title: '統計',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar" color={color} />, // アイコンは仮
        }}
      />
    </Tabs>
  );
}
