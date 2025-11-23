// src/navigation/AppNavigator.js
// 🧭 Main Navigation Configuration

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { checkAuth } from '../store/authSlice';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import SplashScreen from '../screens/Auth/SplashScreen';

// Main Screens
import HomeScreen from '../screens/Home/HomeScreen';
import ProductListScreen from '../screens/Product/ProductListScreen';
import ProductDetailScreen from '../screens/Product/ProductDetailScreen';
import PriceListScreen from '../screens/Price/PriceListScreen';
import CustomerListScreen from '../screens/Customer/CustomerListScreen';
import CustomerDetailScreen from '../screens/Customer/CustomerDetailScreen';
import ReservationScreen from '../screens/Reservation/ReservationScreen';
import SalesScreen from '../screens/Sales/SalesScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🔐 Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// 🏠 Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Products':
            iconName = focused ? 'cube' : 'cube-outline';
            break;
          case 'Prices':
            iconName = focused ? 'pricetag' : 'pricetag-outline';
            break;
          case 'Customers':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'ellipse';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#0ea5e9',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ title: 'หน้าหลัก' }}
    />
    <Tab.Screen 
      name="Products" 
      component={ProductListScreen}
      options={{ title: 'สินค้า' }}
    />
    <Tab.Screen 
      name="Prices" 
      component={PriceListScreen}
      options={{ title: 'ราคา' }}
    />
    <Tab.Screen 
      name="Customers" 
      component={CustomerListScreen}
      options={{ title: 'ลูกค้า' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'โปรไฟล์' }}
    />
  </Tab.Navigator>
);

// 📱 Main Stack Navigator
const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen}
      options={{ 
        title: 'รายละเอียดสินค้า',
        headerBackTitle: 'กลับ'
      }}
    />
    <Stack.Screen 
      name="CustomerDetail" 
      component={CustomerDetailScreen}
      options={{ 
        title: 'รายละเอียดลูกค้า',
        headerBackTitle: 'กลับ'
      }}
    />
    <Stack.Screen 
      name="Reservation" 
      component={ReservationScreen}
      options={{ 
        title: 'รายการจอง',
        headerBackTitle: 'กลับ'
      }}
    />
    <Stack.Screen 
      name="Sales" 
      component={SalesScreen}
      options={{ 
        title: 'สรุปยอดขาย',
        headerBackTitle: 'กลับ'
      }}
    />
  </Stack.Navigator>
);

// 🎯 Root Navigator
export default function AppNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useSelector(state => state.auth);

  // ✅ เช็ค auth status เมื่อ app เริ่มต้น
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // แสดง Splash Screen ขณะกำลังเช็ค auth
  if (!isInitialized) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
