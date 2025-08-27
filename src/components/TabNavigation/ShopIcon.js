import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function ShopIcon({ focused, color = '#52a563', size = 24 }) {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M7.5 7.67V6.7C7.5 4.45 9.31 2.24 11.56 2.03C14.24 1.77 16.5 3.88 16.5 6.51V7.89"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={focused ? `${color}15` : 'none'}
        />
        <Path
          d="M9.00021 22H15.0002C19.0202 22 19.7402 20.39 19.9502 18.43L20.7002 12.43C20.9702 9.99 20.2702 8 16.0002 8H8.00021C3.73021 8 3.03021 9.99 3.30021 12.43L4.05021 18.43C4.26021 20.39 4.98021 22 9.00021 22Z"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={focused ? `${color}15` : 'none'}
        />
        <Path
          d="M15.4955 12H15.5045"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.49451 12H8.50349"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
