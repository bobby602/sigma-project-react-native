const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Block expo-router from being loaded
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-router' || moduleName.startsWith('expo-router/')) {
    return {
      type: 'empty',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;