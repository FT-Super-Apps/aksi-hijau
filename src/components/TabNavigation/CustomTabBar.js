import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import HomeIcon from './HomeIcon';
import ScanIcon from './ScanIcon';
import ProfileIcon from './ProfileIcon';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }) {
  // Hide tab bar when on Scan or Camera screen
  const currentRoute = state.routes[state.index];
  if (currentRoute.name === 'Scan' || currentRoute.name === 'Camera') {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Background with modern curved design */}
      <View style={styles.background} />

      {/* Scanner button notch background */}
      <View style={styles.scanNotch} />

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

          // Skip rendering the scan button here, it will be rendered separately
          if (route.name === 'Scan') {
            return <View style={styles.scanPlaceholder} key={route.key} />;
          }

          const renderIcon = () => {
            switch (route.name) {
              case 'Home':
                return <HomeIcon focused={isFocused} size={22} />;
              case 'Profile':
                return <ProfileIcon focused={isFocused} size={22} />;
              default:
                return null;
            }
          };

          const getTabLabel = () => {
            switch (route.name) {
              case 'Home':
                return 'Home';
              case 'Profile':
                return 'Profile';
              default:
                return '';
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.6}
            >
              <View style={[styles.iconContainer, isFocused && styles.focusedIconContainer]}>
                {renderIcon()}
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.focusedTabLabel]}>
                {getTabLabel()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modern Floating Scanner Button */}
      <TouchableOpacity
        style={styles.scanButtonContainer}
        onPress={() => navigation.navigate('Camera')}
        activeOpacity={0.8}
      >
        <View style={styles.scanButtonOuter}>
          <View style={styles.scanButton}>
            <ScanIcon size={28} />
          </View>
        </View>
        <Text style={styles.scanLabel}>Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 85,
  },
  background: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 85,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
  },
  scanNotch: {
    position: 'absolute',
    top: -15,
    left: width / 2 - 35,
    width: 70,
    height: 30,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  focusedIconContainer: {
    backgroundColor: '#f0f9f1',
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  focusedTabLabel: {
    color: '#52a563',
    fontWeight: '600',
  },
  scanPlaceholder: {
    flex: 1,
  },
  scanButtonContainer: {
    position: 'absolute',
    top: -25,
    left: width / 2 - 30,
    alignItems: 'center',
  },
  scanButtonOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#52a563',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#52a563',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  scanLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#52a563',
    marginTop: 4,
    textAlign: 'center',
  },
});
