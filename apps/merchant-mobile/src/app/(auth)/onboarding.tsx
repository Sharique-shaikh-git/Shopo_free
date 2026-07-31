import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: 'phone-portrait-outline' as const,
    title: 'Welcome to Digital Dukaan',
    subtitle: 'Build your online business in seconds',
    color: '#005147',
  },
  {
    icon: 'camera' as const,
    title: 'Add Products with AI',
    subtitle: 'Just take a photo, AI does the rest',
    color: '#006B5E',
  },
  {
    icon: 'chatbubbles' as const,
    title: 'Get Orders Instantly',
    subtitle: 'Receive orders and notify customers',
    color: '#0B57A4',
  },
  {
    icon: 'trending-up' as const,
    title: 'Grow Your Business',
    subtitle: 'Track sales and grow faster',
    color: '#7B4F1E',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < SLIDES.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  const slide = SLIDES[currentStep];

  return (
    <View className="flex-1 bg-white">
      {/* Illustration Area */}
      <View className="flex-1 bg-[#F2F0F4] rounded-b-[2rem] items-center justify-center px-8 relative overflow-hidden">
        {/* Decorative circles */}
        <View className="absolute top-0 right-0 w-40 h-40 bg-[#CCE8E4] rounded-full opacity-30 blur-3xl" />
        <View className="absolute bottom-10 left-0 w-32 h-32 bg-[#F5E6D0] rounded-full opacity-30 blur-3xl" />

        <Animated.View entering={FadeIn.duration(500)} key={currentStep} className="items-center z-10">
          <View className="w-32 h-32 rounded-full items-center justify-center mb-8" style={{ backgroundColor: `${slide.color}15` }}>
            <Ionicons name={slide.icon} size={64} color={slide.color} />
          </View>
        </Animated.View>
      </View>

      {/* Content Area */}
      <View className="bg-white px-6 pt-8 pb-4">
        {/* Typography */}
        <Animated.View entering={FadeInDown.duration(400)} key={`text-${currentStep}`} className="items-center mb-8 gap-3">
          <Text className="text-[28px] font-bold text-[#1a1c1e] text-center tracking-tight">{slide.title}</Text>
          <Text className="text-[18px] text-[#75797E] text-center px-4">{slide.subtitle}</Text>
        </Animated.View>

        {/* Progress Indicator */}
        <View className="flex-row gap-2 justify-center items-center mb-8">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === currentStep ? 'h-2.5 w-8 bg-[#005147]' : 'h-2 w-2 bg-[#E0E3DE]'
              }`}
            />
          ))}
        </View>

        {/* Primary Action */}
        <TouchableOpacity
          onPress={handleNext}
          className="w-full h-[56px] bg-[#005147] rounded-xl items-center justify-center mb-4"
        >
          <Text className="text-[14px] font-semibold text-white">
            {currentStep === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        {/* Skip */}
        {currentStep < SLIDES.length - 1 && (
          <TouchableOpacity onPress={handleSkip} className="w-full h-[48px] items-center justify-center">
            <Text className="text-[14px] text-[#75797E]">Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
