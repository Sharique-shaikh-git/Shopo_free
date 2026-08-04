import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * SettingsRow — a single list row for settings screens.
 * Matches the STITCH design-system: minimal, shadow-less, large tap target,
 * no nested-button nesting (root is the only pressable).
 */

export interface SettingsRowProps {
  /** MaterialIcons ligature name (e.g. "notifications"). Rendered on the left. */
  icon?: keyof typeof MaterialIcons.glyphMap;
  /** Icon color — defaults to muted outline. Use '#BA1A1A' for destructive rows. */
  iconColor?: string;
  label: string;
  /** Optional muted right-side value (e.g. "English", "Light"). */
  value?: string;
  /** Optional custom right-side element (e.g. a Switch). Takes precedence over value/chevron. */
  right?: React.ReactNode;
  /** When provided the row becomes pressable and shows a chevron (unless `right` is set). */
  onPress?: () => void;
  /** Show a divider below this row (use everywhere except the last row). */
  divider?: boolean;
  /** Danger styling — text + icon tinted error red. */
  danger?: boolean;
}

export function SettingsRow({
  icon,
  iconColor,
  label,
  value,
  right,
  onPress,
  divider = false,
  danger = false,
}: SettingsRowProps) {
  const Wrapper: React.ComponentType<any> = onPress || right ? TouchableOpacity : View;
  const labelColor = danger ? 'text-error-red' : 'text-on-surface';
  const resolvedIconColor = danger ? '#BA1A1A' : iconColor || '#6e7976';

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className={`flex-row items-center justify-between p-4 min-h-[64px] bg-surface-container-lowest ${
        divider ? 'border-b border-border-subtle' : ''
      }`}
    >
      <View className="flex-row items-center gap-4 flex-1">
        {icon ? <MaterialIcons name={icon} size={22} color={resolvedIconColor} /> : null}
        <Text className={`text-[16px] ${labelColor} ${danger ? 'font-medium' : ''}`}>{label}</Text>
      </View>

      {right ? (
        right
      ) : (
        <View className="flex-row items-center gap-2">
          {value ? <Text className="text-[16px] text-on-surface-variant">{value}</Text> : null}
          {onPress ? <MaterialIcons name="chevron-right" size={20} color="#6e7976" /> : null}
        </View>
      )}
    </Wrapper>
  );
}

/** Section container that groups SettingsRows in a rounded, bordered card. */
export function SettingsSection({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-col bg-surface-container-lowest rounded-xl border border-border-subtle overflow-hidden">
      {children}
    </View>
  );
}
