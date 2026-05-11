import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppBackground from './src/components/AppBackground';
import BottomNav from './src/components/BottomNav';
import { colors } from './src/constants/theme';
import { WeatherAlertProvider } from './src/contexts/WeatherAlertContext';
import CartScreen from './src/screens/CartScreen';
import HomeScreen from './src/screens/HomeScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import type { RootStackParamList, RootTabParamList } from './src/types/navigation';
import RestaurantList from './src/screens/RestaurantList';
import RestaurantDetails from './src/screens/RestaurantDetails';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';
import OrderConfirmedScreen from './src/screens/OrderConfirmedScreen';
import OrderFailedScreen from './src/screens/OrderFailedScreen';
import WalletHistoryScreen from './src/screens/WalletHistoryScreen';
import AddressListScreen from './src/screens/AddressListScreen';
import CouponListScreen from './src/screens/CouponListScreen';
import SelectAddressScreen from './src/screens/SelectAddressScreen';
import AddAddressScreen from './src/screens/AddAddressScreen';
import MyCircleScreen from './src/screens/MyCircleScreen';
import LoginScreen from './src/screens/LoginScreen';
import OtpAuthScreen from './src/screens/OtpAuthScreen';
import RatingScreen from './src/screens/RatingScreen';
import ReferEarnScreen from './src/screens/ReferEarnScreen';
import PlanScreen from './src/screens/PlanScreen';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import AboutScreen from './src/screens/AboutScreen';
import HelpCenterScreen from './src/screens/HelpCenterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
      tabBar={props => <BottomNav {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Restaurants" component={RestaurantList} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
function App() {
  const [currentRouteName, setCurrentRouteName] = React.useState('Login');

  const updateCurrentRoute = () => {
    const routeName = navigationRef.getCurrentRoute()?.name;
    if (routeName && routeName !== currentRouteName) {
      setCurrentRouteName(routeName);
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <WeatherAlertProvider>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <View style={styles.container}>
            {currentRouteName !== 'Login' && currentRouteName !== 'OtpAuth' ? <AppBackground /> : null}
            <View style={styles.mobileCanvas}>
              <NavigationContainer
                ref={navigationRef}
                theme={navigationTheme}
                onReady={updateCurrentRoute}
                onStateChange={updateCurrentRoute}
              >
                <Stack.Navigator
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' },
                  }}
                >
                  <Stack.Screen name="Tabs" component={MainTabs} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="OtpAuth" component={OtpAuthScreen} />
                  <Stack.Screen name="Search" component={SearchScreen} />
                  <Stack.Screen name="MyCircle" component={MyCircleScreen} />
                  <Stack.Screen name="RateExperience" component={RatingScreen} />
                  <Stack.Screen name="ReferEarn" component={ReferEarnScreen} />
                  <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
                  <Stack.Screen name="OrderConfirmed" component={OrderConfirmedScreen} />
                  <Stack.Screen name="OrderFailed" component={OrderFailedScreen} />
                  <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
                  <Stack.Screen name="WalletHistory" component={WalletHistoryScreen} />
                  <Stack.Screen name="Plan" component={PlanScreen} />
                  <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
                  <Stack.Screen name="About" component={AboutScreen} />
                  <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
                  <Stack.Screen name="AddressList" component={AddressListScreen} />
                  <Stack.Screen name="CouponList" component={CouponListScreen} />
                  <Stack.Screen name="SelectAddress" component={SelectAddressScreen} />
                  <Stack.Screen name="AddAddress" component={AddAddressScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </View>
          </View>
        </WeatherAlertProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mobileCanvas: {
    flex: 1,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
});

export default App;
