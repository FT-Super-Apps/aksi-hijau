import React from 'react';
import { SvgXml } from 'react-native-svg';

// Drink Cup SVG Icon
export const DrinkCupIcon = (props) => {
  const svgContent = `
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="15" width="30" height="35" rx="5" fill="#4CAF50"/>
      <rect x="8" y="13" width="34" height="4" rx="2" fill="#2E7D32"/>
      <rect x="15" y="22" width="20" height="2" rx="1" fill="#81C784"/>
      <rect x="15" y="27" width="15" height="2" rx="1" fill="#81C784"/>
      <circle cx="35" cy="20" r="8" fill="#E8F5E8" stroke="#4CAF50" stroke-width="2"/>
      <path d="M35 16 L35 24 M31 20 L39 20" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  return <SvgXml xml={svgContent} {...props} />;
};

// Eco Bag SVG Icon
export const EcoBagIcon = (props) => {
  const svgContent = `
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 20 L45 20 L42 50 L18 50 Z" fill="#4CAF50"/>
      <path d="M20 20 C20 15 25 10 30 10 C35 10 40 15 40 20" stroke="#2E7D32" stroke-width="3" fill="none"/>
      <rect x="20" y="25" width="20" height="2" rx="1" fill="#81C784"/>
      <rect x="20" y="30" width="15" height="2" rx="1" fill="#81C784"/>
      <path d="M25 35 L35 35" stroke="#81C784" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  return <SvgXml xml={svgContent} {...props} />;
};

// Water Bottle SVG Icon
export const BottleIcon = (props) => {
  const svgContent = `
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="10" width="16" height="5" rx="2" fill="#2E7D32"/>
      <rect x="20" y="15" width="20" height="40" rx="8" fill="#81C784"/>
      <rect x="22" y="20" width="16" height="30" rx="6" fill="#4CAF50"/>
      <ellipse cx="30" cy="25" rx="6" ry="3" fill="#E3F2FD"/>
      <ellipse cx="30" cy="27" rx="4" ry="2" fill="#BBDEFB"/>
      <path d="M26 35 Q30 32 34 35" stroke="#2E7D32" stroke-width="1" fill="none"/>
    </svg>
  `;
  return <SvgXml xml={svgContent} {...props} />;
};

// Service Icons
export const CounselingIcon = (props) => {
  const svgContent = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="15" width="24" height="20" rx="3" fill="#4CAF50"/>
      <rect x="6" y="13" width="28" height="4" rx="2" fill="#2E7D32"/>
      <rect x="12" y="20" width="16" height="2" rx="1" fill="#81C784"/>
      <rect x="12" y="24" width="12" height="2" rx="1" fill="#81C784"/>
      <rect x="12" y="28" width="14" height="2" rx="1" fill="#81C784"/>
      <circle cx="20" cy="8" r="3" fill="#FF9800"/>
    </svg>
  `;
  return <SvgXml xml={svgContent} {...props} />;
};

export const RecyclingIcon = (props) => {
  const svgContent = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8 L24 16 L16 16 Z" fill="#4CAF50"/>
      <path d="M32 24 L28 32 L36 32 Z" fill="#4CAF50"/>
      <path d="M8 24 L12 32 L4 32 Z" fill="#4CAF50"/>
      <path d="M20 12 Q28 12 28 20" stroke="#2E7D32" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
      <path d="M28 28 Q20 32 12 28" stroke="#2E7D32" stroke-width="2" fill="none"/>
      <path d="M12 28 Q8 20 16 16" stroke="#2E7D32" stroke-width="2" fill="none"/>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#2E7D32"/>
        </marker>
      </defs>
    </svg>
  `;
  return <SvgXml xml={svgContent} {...props} />;
};

export const EcoDesignIcon = (props) => {
  const svgContent = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="24" height="24" rx="3" fill="#E8F5E8" stroke="#4CAF50" stroke-width="2"/>
      <circle cx="15" cy="15" r="3" fill="#4CAF50"/>
      <circle cx="25" cy="15" r="3" fill="#81C784"/>
      <circle cx="20" cy="25" r="3" fill="#2E7D32"/>
      <path d="M15 18 L20 22 L25 18" stroke="#4CAF50" stroke-width="2" fill="none"/>
      <rect x="5" y="32" width="30" height="3" rx="1.5" fill="#8BC34A"/>
    </svg>
  `;
  return <SvgXml xml={svgContent} {...props} />;
};
