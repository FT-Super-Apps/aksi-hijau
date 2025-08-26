import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

// Simplified icon components using basic SVG shapes
const IconShapes = {
  home: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 22V12H15V22" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  ),
  menu: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M3 6H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M3 18H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  search: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={2} />
      <Path d="M21 21L16.5 16.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  community: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={7} r={4} stroke={color} strokeWidth={2} />
      <Path d="M1 21V19C1 16.7909 2.79086 15 5 15H13C15.2091 15 17 16.7909 17 19V21" stroke={color} strokeWidth={2} />
      <Circle cx={19} cy={7} r={2} stroke={color} strokeWidth={2} />
      <Path d="M23 21V19C23 17.3431 21.6569 16 20 16" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  recycle: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M16 21L19 18L16 15M21 12A9 9 0 0 0 12 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 3L5 6L8 9M3 12A9 9 0 0 0 12 21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  leaf: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2C20 4 20 6 18 8C16 10 13 11 12 12C10.5 13.5 9 17 11 20Z" stroke={color} strokeWidth={2} />
      <Path d="M12.94 13.75L15.25 11.44" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  counseling: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  recycling: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M16 21L19 18L16 15M21 12A9 9 0 0 0 12 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 3L5 6L8 9M3 12A9 9 0 0 0 12 21" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  design: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={color} strokeWidth={2} />
      <Path d="M2 17L12 22L22 17" stroke={color} strokeWidth={2} />
      <Path d="M2 12L12 17L22 12" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  cup: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 11H19L17 21H7L5 11Z" stroke={color} strokeWidth={2} />
      <Path d="M5 11C5 8.79086 6.79086 7 9 7H15C17.2091 7 19 8.79086 19 11" stroke={color} strokeWidth={2} />
      <Path d="M9 7V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  bag: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke={color} strokeWidth={2} />
      <Path d="M3 6H21" stroke={color} strokeWidth={2} />
      <Path d="M16 10C16 11.1046 15.1046 12 14 12H10C8.89543 12 8 11.1046 8 10" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  bottle: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 3H15" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M10 3V6C10 6.55228 10.4477 7 11 7H13C13.5523 7 14 6.55228 14 6V3" stroke={color} strokeWidth={2} />
      <Path d="M11 7V9C11 9.55228 11.4477 10 12 10C13.6569 10 15 11.3431 15 13V19C15 20.1046 14.1046 21 13 21H11C9.89543 21 9 20.1046 9 19V13C9 11.3431 10.3431 10 12 10C12.5523 10 13 9.55228 13 9V7" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  planting: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2C20 4 20 6 18 8C16 10 13 11 12 12C10.5 13.5 9 17 11 20Z" stroke={color} strokeWidth={2} />
      <Path d="M12.94 13.75L15.25 11.44" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  plastic: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6H5H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  earth: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Path d="M2 12H22" stroke={color} strokeWidth={2} />
      <Path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  stats: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 20V10" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 20V4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M6 20V14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  settings: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
      <Path d="M19.4 15C19.1277 15.6171 18.7916 16.2023 18.3955 16.75M19.4 9C19.1277 8.38288 18.7916 7.79767 18.3955 7.25M16.75 18.3955C16.2023 18.7916 15.6171 19.1277 15 19.4M9 19.4C8.38288 19.1277 7.79767 18.7916 7.25 18.3955M5.60449 16.75C5.20844 16.2023 4.87228 15.6171 4.59999 15M5.60449 7.25C5.20844 7.79767 4.87228 8.38288 4.59999 9M7.25 5.60449C7.79767 5.20844 8.38288 4.87228 9 4.59999M15 4.59999C15.6171 4.87228 16.2023 5.20844 16.75 5.60449" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  ),
  favorites: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.64169 1.54871 7.04096 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.0621 22.0329 6.39467C21.7563 5.72723 21.351 5.12087 20.84 4.61V4.61Z" stroke={color} strokeWidth={2} />
    </Svg>
  ),
  profile: ({ size, color }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth={2} />
      <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={2} />
    </Svg>
  ),
};

export default function SvgIcon({ name, size = 24, color = '#000', style }) {
  const IconComponent = IconShapes[name];

  if (!IconComponent) {
    console.warn(`SvgIcon: Icon "${name}" not found`);
    return null;
  }

  return (
    <View style={[{ width: size, height: size }, style]}>
      <IconComponent size={size} color={color} />
    </View>
  );
}
