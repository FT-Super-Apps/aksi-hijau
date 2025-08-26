# EcoUnity - Green Mobile App

A React Native mobile application for environmental awareness and green initiatives, designed with professional structure and modern design patterns.

## 🚀 Project Structure

```
figma-test/
├── src/                          # Source code directory
│   ├── components/               # Reusable UI components
│   │   ├── buttons/             # Button components
│   │   │   ├── Button.js        # Main button component
│   │   │   ├── IconButton.js    # Icon-only button
│   │   │   ├── FloatingActionButton.js
│   │   │   └── index.js         # Button exports
│   │   ├── common/              # Common/shared components
│   │   │   ├── BackgroundIllustration.js
│   │   │   ├── ProductIcons.js
│   │   │   └── index.js
│   │   ├── TabNavigation/       # Tab navigation components
│   │   └── index.js             # All component exports
│   ├── constants/               # App constants
│   │   ├── colors.js            # Color palette (from Figma)
│   │   ├── typography.js        # Typography system
│   │   ├── spacing.js           # Spacing and layout constants
│   │   └── index.js             # Constants exports
│   ├── theme/                   # Theme system
│   │   └── index.js             # Main theme configuration
│   ├── navigation/              # Navigation configuration
│   │   ├── AppNavigator.js      # Main app navigator
│   │   └── MainTabNavigator.js  # Tab navigation
│   ├── screens/                 # Screen components
│   │   ├── Welcome.js           # Welcome/onboarding screen
│   │   └── MainTabs/            # Tab screens
│   ├── config/                  # App configuration
│   │   └── fonts.js             # Font loading configuration
│   └── utils/                   # Utility functions
├── assets/                      # Static assets (images, fonts, etc.)
├── App.js                       # Root component
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

## 🎨 Design System

### Colors (Based on Figma Design)
- **Primary Green**: `#549B79` - Main brand color from Figma
- **Dark Green**: `#1F5F5B` - Darker variant for contrast
- **Background**: `#F8FDF8` - Eco-friendly light green background
- **Text Primary**: `#292B2D` - Main text color from Figma
- **Text on Primary**: `#F5F5F5` - Text color for primary backgrounds

### Typography
- **Primary Font**: Sora (for headings and buttons)
- **Secondary Font**: Kulim Park (for body text)
- Standardized font sizes and line heights
- Consistent letter spacing

### Components

#### Button Component
Professional button component with multiple variants:
- **Variants**: primary, secondary, outline, ghost
- **Sizes**: small, medium, large
- **States**: normal, disabled, loading
- **Features**: gradient support, icon placement, custom styling

```jsx
import { Button } from './src/components';

<Button 
  title="Join Now"
  variant="primary"
  size="large"
  onPress={handlePress}
  icon={MyIcon}
  iconPosition="right"
/>
```

#### Icon Button
Circular button for icon-only actions:
```jsx
import { IconButton } from './src/components';

<IconButton 
  icon={MyIcon}
  variant="primary"
  size="medium"
  onPress={handlePress}
/>
```

#### Floating Action Button
Material Design-style FAB:
```jsx
import { FloatingActionButton } from './src/components';

<FloatingActionButton 
  icon={PlusIcon}
  size="large"
  onPress={handleAdd}
/>
```

## 🛠 Development Guidelines

### File Organization
- All source code in `src/` directory
- Components organized by type (buttons, common, etc.)
- Constants separated by concern (colors, typography, spacing)
- Consistent export patterns using index.js files

### Styling Patterns
- Use theme constants instead of hardcoded values
- Consistent spacing using predefined values
- Standardized shadows and border radius
- Color system based on design tokens

### Best Practices
- Import from constants for consistency
- Use professional component structure
- Follow React Native performance guidelines
- Maintain clean separation of concerns

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on device/simulator:
   ```bash
   npm run android  # for Android
   npm run ios      # for iOS
   ```

## 📱 Features

- Professional component architecture
- Design system based on Figma specifications
- Consistent color palette and typography
- Reusable button components
- Clean folder structure
- Modern React Native patterns

## 🎯 Future Enhancements

- [ ] Add more component variants
- [ ] Implement dark theme support
- [ ] Add animation and micro-interactions
- [ ] Create component documentation
- [ ] Add unit tests for components
- [ ] Implement accessibility features

---

Built with ❤️ for environmental awareness and green initiatives.
