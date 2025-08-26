import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function ProfileIcon({ focused, color = '#52a563', size = 24 }) {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12.16 10.87C12.06 10.86 11.94 10.86 11.83 10.87C9.45 10.79 7.56 8.84 7.56 6.44C7.56 3.99 9.54 2 12 2C14.45 2 16.44 3.99 16.44 6.44C16.43 8.84 14.54 10.79 12.16 10.87Z"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={focused ? `${color}15` : 'none'}
        />
        <Path
          d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
          stroke={focused ? color : '#9CA3AF'}
          strokeWidth={focused ? "2" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={focused ? `${color}15` : 'none'}
        />
      </Svg>
    </View>
  );
}
