import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

export default function ScanIcon({ focused, color = '#FFFFFF', size = 24 }) {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Corner brackets for scan frame */}
        <Path
          d="M2 8V6C2 3.79 3.79 2 6 2H8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 2H18C20.21 2 22 3.79 22 6V8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M22 16V18C22 20.21 20.21 22 18 22H16"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8 22H6C3.79 22 2 20.21 2 18V16"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center scanning line */}
        <Path
          d="M6 12H18"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />

        {/* Center dot for focus */}
        <Circle
          cx="12"
          cy="12"
          r="1.5"
          fill={color}
          fillOpacity="0.8"
        />
      </Svg>
    </View>
  );
}
