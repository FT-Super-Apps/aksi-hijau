/**
 * CustomTabBar - Modern floating tab bar dengan glassmorphism
 * @module components/TabNavigation/CustomTabBar
 */

import React, { useRef, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Text, 
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HomeIcon from './HomeIcon';
import ScanIcon from './ScanIcon';
import ProfileIcon from './ProfileIcon';
import { COLORS, SHADOWS, GRADIENT_COLORS } from '../../constants/colors';
import { FONT_FAMILIES } from '../../constants/typography';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }) {
  const scanButtonAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for scan button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Hide tab bar when on Camera screen
  const currentRoute = state.routes[state.index];
  if (currentRoute.name === 'Camera') {
    return null;
  }

  const handleScanPress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.spring(scanButtonAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        speed: 50,
      }),
      Animated.spring(scanButtonAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
      }),
    ]).start();
    
    navigation.navigate('Camera');
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  return (
    <View style={styles.container}>
      {/* Glass Background */}
      <View style={styles.background}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
          style={styles.backgroundGradient}
        />
      </View>

      {/* Tab buttons */}
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Center placeholder for scan button
          if (route.name === 'Camera') {
            return <View style={styles.centerPlaceholder} key={route.key} />;
          }

          const renderIcon = () => {
            switch (route.name) {
              case 'Home':
                return <HomeIcon focused={isFocused} size={24} />;
              case 'Profile':
                return <ProfileIcon focused={isFocused} size={24} />;
              default:
                return null;
            }
          };

          const getTabLabel = () => {
            switch (route.name) {
              case 'Home':
                return 'Beranda';
              case 'Profile':
                return 'Profil';
              default:
                return '';
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Animated.View 
                style={[
                  styles.iconWrapper,
                  isFocused && styles.iconWrapperFocused,
                ]}
              >
                {renderIcon()}
              </Animated.View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                {getTabLabel()}
              </Text>
              {isFocused && <View style={styles.focusIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating Scan Button */}
      <View style={styles.scanButtonWrapper}>
        {/* Pulse Ring */}
        <Animated.View 
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            },
          ]}
        />
        
        <TouchableOpacity
          onPress={handleScanPress}
          activeOpacity={0.9}
          style={styles.scanButtonTouchable}
        >
          <Animated.View 
            style={[
              styles.scanButtonOuter,
              { transform: [{ scale: scanButtonAnim }] },
            ]}
          >
            <LinearGradient
              colors={GRADIENT_COLORS.PRIMARY}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scanButton}
            >
              <View style={styles.scanButtonGlow} />
              <ScanIcon size={28} color={COLORS.WHITE} />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
        
        <Text style={styles.scanLabel}>Tanam</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: Platform.OS === 'ios' ? 90 : 80,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  background: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    ...SHADOWS.LARGE,
  },
  backgroundGradient: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
    position: 'relative',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 2,
  },
  iconWrapperFocused: {
    backgroundColor: COLORS.PRIMARY + '12',
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: FONT_FAMILIES.SORA.MEDIUM,
    color: COLORS.TEXT_DISABLED,
    marginTop: 2,
  },
  tabLabelFocused: {
    color: COLORS.PRIMARY,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
  },
  focusIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.PRIMARY,
  },
  centerPlaceholder: {
    flex: 1.2,
  },
  scanButtonWrapper: {
    position: 'absolute',
    top: -28,
    left: width / 2 - 36,
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    top: 0,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.PRIMARY,
  },
  scanButtonTouchable: {},
  scanButtonOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    ...SHADOWS.GLOW_PRIMARY,
  },
  scanButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  scanButtonGlow: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  scanLabel: {
    fontSize: 11,
    fontFamily: FONT_FAMILIES.SORA.SEMIBOLD,
    color: COLORS.PRIMARY,
    marginTop: 6,
  },
});
