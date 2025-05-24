// src/components/AppText.js
import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

// --- IMPORTANT ---
// The font family names used here MUST match how iOS and Android recognize them.
// For Poppins, these are typically the PostScript names.
// e.g., "Poppins-Regular", "Poppins-Bold", "Poppins-Medium"
// You might need to verify these (e.g., using Font Book on macOS for PostScript names).
// Android often converts filenames (e.g., poppins_regular for Poppins-Regular.ttf).
// The `react-native-asset` tool often handles this, but be aware.

const FONT_FAMILY_REGULAR = 'Poppins-Regular';
const FONT_FAMILY_BOLD = 'Poppins-Bold';
const FONT_FAMILY_MEDIUM = 'Poppins-Medium';
const FONT_FAMILY_SEMIBOLD = 'Poppins-SemiBold';
const FONT_FAMILY_LIGHT = 'Poppins-Light';
// Add other weights/styles as needed
//PoppinsItalic
const AppText = (props) => {
  const { style, children, bold, medium, semiBold, light, ...restProps } = props;

  let fontFamily = FONT_FAMILY_REGULAR; // Default to regular

  if (bold) {
    fontFamily = FONT_FAMILY_BOLD;
  } else if (medium) {
    fontFamily = FONT_FAMILY_MEDIUM;
  } else if (semiBold) {
    fontFamily = FONT_FAMILY_SEMIBOLD;
  } else if (light) {
    fontFamily = FONT_FAMILY_LIGHT;
  }
  // Add more conditions for other weights/styles

  const textStyle = [
    styles.defaultText,
    { fontFamily },
    style, // Allow custom styles to override
  ];

  return (
    <Text style={textStyle} {...restProps}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    // You can set a default color or other properties here
    // color: '#333333',
  },
  // No need for separate regularText, boldText styles if handled by props
});

export default AppText;
