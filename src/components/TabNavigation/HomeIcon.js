import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function HomeIcon({ focused, color = '#52a563', size = 24 }) {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36V17.77C2 20.09 3.91 21.99 6.23 21.99H17.77C20.09 21.99 22 20.09 22 17.78V10.5C22 9.29 21.19 7.74 20.2 7.05L14.02 2.72C12.62 1.74 10.37 1.79 9.02 2.84Z"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={focused ? `${color}15` : 'none'}
        />
        <Path
          d="M12 17.99V14.99"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
