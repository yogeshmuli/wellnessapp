import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome5";
import HomeScreen from "../pages/home";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/auth";
import LoadingOverlay from "../components/loadingOverlay";

const Drawer = createDrawerNavigator();

const Sidebar = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(logout());
    }, 200);
  };

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerActiveTintColor: "white",
        drawerActiveBackgroundColor: "#003CB3",
        drawerStyle: { width: 300 },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
          <LoadingOverlay visible={loading} />
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/logo.png")}
              style={{ height: 130 }}
              resizeMode="contain"
            />
          </View>
          <DrawerItemList {...props} />
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color }) => (
            <Icon name="home" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#d21919",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Sidebar;
