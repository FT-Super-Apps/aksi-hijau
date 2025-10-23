import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EcoUnityWelcome from '../screens/Welcome';
import LandingScreenMinimal from '../screens/LandingScreenMinimal';
import OnboardingScreen from '../screens/OnboardingScreen';
import MainTabNavigator from './MainTabNavigator';
import MapScreen from '../screens/MapScreen';
import TreeDetailScreen from '../screens/TreeDetailScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import PhotoPreviewScreen from '../screens/PhotoPreviewScreen';
import CarbonCalculatorScreen from '../screens/CarbonCalculatorScreen';
import LearnChallengeScreen from '../screens/LearnChallengeScreen';
import EcoWalletScreen from '../screens/EcoWalletScreen';
import CommunityFeedScreen from '../screens/CommunityFeedScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreenMinimal} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Welcome" component={EcoUnityWelcome} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="TreeDetail" component={TreeDetailScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="PhotoPreview" component={PhotoPreviewScreen} />
        <Stack.Screen name="CarbonCalculator" component={CarbonCalculatorScreen} />
        <Stack.Screen name="LearnChallenge" component={LearnChallengeScreen} />
        <Stack.Screen name="EcoWallet" component={EcoWalletScreen} />
        <Stack.Screen name="CommunityFeed" component={CommunityFeedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


