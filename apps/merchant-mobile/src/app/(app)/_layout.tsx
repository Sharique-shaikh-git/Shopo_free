import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f9f9fc',
          borderTopColor: '#E1E3E5',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 20,
          elevation: 8,
        },
        tabBarActiveTintColor: '#006B5E', // growth-green
        tabBarInactiveTintColor: '#6e7976', // outline
        tabBarLabelStyle: {
          fontFamily: 'Be Vietnam Pro',
          fontSize: 12,
          fontWeight: '500'
        }
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarLabel: 'Store',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="storefront" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="receipt-long" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
      
      {/* Hide screens that aren't in bottom nav */}
      <Tabs.Screen name="products" options={{ href: null }} />
      <Tabs.Screen name="customers" options={{ href: null }} />
    </Tabs>
  );
}
