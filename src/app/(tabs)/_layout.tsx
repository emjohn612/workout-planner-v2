import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { COLORS } from "../../theme/theme"

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBarStyle,
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Workouts",
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome
                            name="list"
                            size={25}
                            color={
                                focused ? COLORS.primaryRedHex : COLORS.primaryLightGreyHex
                            }
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="exercises"
                options={{
                    title: "Exercises",
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome
                            name="th-list"
                            size={25}
                            color={
                                focused ? COLORS.primaryRedHex : COLORS.primaryLightGreyHex
                            }
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome
                            name="user"
                            size={25}
                            color={
                                focused ? COLORS.primaryRedHex : COLORS.primaryLightGreyHex
                            }
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarStyle: {
        height: 80,
        position: "absolute",
        backgroundColor: COLORS.primaryDarkGreyHex,
    },
});