import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}>
      <NativeTabs.Trigger name="index">
        <MaterialIcons name="home" size={24} color={colors.text} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <MaterialIcons name="explore" size={24} color={colors.text} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
