/**
 * App Navigator - Main navigation configuration with auth flow
 * @module navigation/AppNavigator
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Auth Screens
import LandingScreen from '../screens/Auth/LandingScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

// Main Tab Navigator
import MainTabNavigator from './MainTabNavigator';

// Feature Screens
import CarbonCalculatorScreen from '../screens/Features/CarbonCalculatorScreen';
import EcoWalletScreen from '../screens/Features/EcoWalletScreen';
import LearnChallengeScreen from '../screens/Features/LearnChallengeScreen';
import MapScreen from '../screens/Features/MapScreen';
import StatisticsScreen from '../screens/Features/StatisticsScreen';
import TreeDetailScreen from '../screens/Features/TreeDetailScreen';
import PhotoPreviewScreen from '../screens/Features/PhotoPreviewScreen';

// Community Screens
import CommunityFeedScreen from '../screens/Community/CommunityFeedScreen';
import LeaderboardScreen from '../screens/Community/LeaderboardScreen';

// Store
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();

// Auth Stack - untuk user yang belum login
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// Main Stack - untuk user yang sudah login
function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      
      {/* Feature Screens */}
      <Stack.Screen name="CarbonCalculator" component={CarbonCalculatorScreen} />
      <Stack.Screen name="EcoWallet" component={EcoWalletScreen} />
      <Stack.Screen name="LearnChallenge" component={LearnChallengeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
      <Stack.Screen name="TreeDetail" component={TreeDetailScreen} />
      <Stack.Screen name="PhotoPreview" component={PhotoPreviewScreen} />
      
      {/* Community Screens */}
      <Stack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Stack.Navigator>
  );
}

// Loading Screen
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
    </View>
  );
}

export default function AppNavigator() {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, isOnboarded } = useAuthStore();

  useEffect(() => {
    // Simulasi hydration dari AsyncStorage
    const prepare = async () => {
      // Tunggu store rehydrate
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsReady(true);
    };

    prepare();
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
});
