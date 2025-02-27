import React from 'react';
import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from "@expo/vector-icons/Ionicons";
import useTranslation from "@/app/i8n/useTranslationHook";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0369A1',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 90,
          paddingBottom: 10,
          paddingTop: 15,
          position: 'absolute',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderTopWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: '#0369A1',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 10,
          height: 75,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 14,
          marginTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="Aid"
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontWeight: '700', fontSize: 14 }}>
              {t('tabs.aid')}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <View style={{
              padding: 1,
              marginTop: -20,
              borderRadius: 16,
              backgroundColor: color === '#0369A1' ? 'rgba(3, 105, 161, 0.1)' : 'transparent',
            }}>
              <Ionicons name="help-buoy" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="NewsMagazine"
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontWeight: '700', fontSize: 14 }}>
              {t('tabs.newsMagazine')}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <View style={{
              padding: 1,
              marginTop: -20,
              borderRadius: 16,
              backgroundColor: color === '#0369A1' ? 'rgba(3, 105, 161, 0.1)' : 'transparent',
            }}>
              <Ionicons name="newspaper" size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ChatSupport"
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontWeight: '700', fontSize: 14 }}>
              {t('tabs.chat')}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <View style={{
              padding: 1,
              marginTop: -20,
              borderRadius: 16,
              backgroundColor: color === '#0369A1' ? 'rgba(3, 105, 161, 0.1)' : 'transparent',
            }}>
              <Ionicons name="chatbubbles" size={28} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
