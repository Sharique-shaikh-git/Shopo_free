import { Tabs } from 'expo-router';

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
          paddingTop: 8
        },
        tabBarActiveTintColor: '#006b5e', // Growth Green from Stitch
        tabBarInactiveTintColor: '#6e7976', // Outline color
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
          title: 'My Shop',
        }}
      />
      <Tabs.Screen
        name="products/index"
        options={{
          title: 'Products',
        }}
      />
      <Tabs.Screen
        name="orders/index"
        options={{
          title: 'Orders',
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
