import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function NotificationIcon({ focused, color = '#52a563', size = 24 }) {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12.02 2.91C8.71 2.91 6.02 5.6 6.02 8.91V11.8C6.02 12.41 5.76 13.34 5.45 13.86L4.3 15.77C3.59 16.95 4.08 18.26 5.38 18.7C9.69 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.27 13.34 18.02 12.41 18.02 11.8V8.91C18.02 5.61 15.32 2.91 12.02 2.91Z"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeMiterlimit="10"
          strokeLinecap="round"
          fill={focused ? `${color}15` : 'none'}
        />
        <Path
          d="M13.87 3.2C13.56 3.11 13.24 3.04 12.91 3C11.95 2.88 11.03 2.95 10.17 3.2C10.46 2.46 11.18 1.94 12.02 1.94C12.86 1.94 13.58 2.46 13.87 3.2Z"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={focused ? `${color}15` : 'none'}
        />
        <Path
          d="M15.02 19.06C15.02 20.71 13.67 22.06 12.02 22.06C11.2 22.06 10.44 21.72 9.9 21.18C9.36 20.64 9.02 19.88 9.02 19.06"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeMiterlimit="10"
          fill={focused ? `${color}15` : 'none'}
        />
      </Svg>
    </View>
  );
}
