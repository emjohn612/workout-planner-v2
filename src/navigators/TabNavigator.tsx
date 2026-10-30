import {StyleSheet, Text, View} from 'react-native';
import Profile from '../app/(tabs)/profile';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../app/(tabs)/home';
import Exercises from '../app/(tabs)/exercises';
import {COLORS} from '../theme/theme';
import { FontAwesome } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name="Workouts"
        component={Home}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome
              name="list"
              color={
                focused ? COLORS.primaryRedHex : COLORS.primaryLightGreyHex
              }
              size={25}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Exercises"
        component={Exercises}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome
              name="th-list"
              color={
                focused ? COLORS.primaryRedHex : COLORS.primaryLightGreyHex
              }
              size={25}
            />
          ),
          tabBarShowLabel: false,
          tabBarActiveTintColor: COLORS.secondaryLightGreyHex,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome
              name="user"
              color={
                focused ? COLORS.primaryRedHex : COLORS.primaryLightGreyHex
              }
              size={25}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    position: 'absolute',
    backgroundColor: COLORS.primaryDarkGreyHex,
  },
});

export default TabNavigator;
