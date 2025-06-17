import React, { useContext } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext"; // import AuthContext

// Import all screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import UserHome from "../screens/user/UserHome";
import AdminDashboard from "../screens/admin/AdminDashboard";
import ManageUsers from "../screens/admin/ManageUsers";
import MenuList from "../screens/user/MenuList";
import AddMenu from "../screens/admin/AddMenu";
import EditMenu from "../screens/admin/EditMenu";
import MenuDetail from "../screens/user/MenuDetail";
import TipsScreen from '../screens/info/TipsScreen';
import DietScreen from '../screens/info/DietScreen';
import MudahScreen from '../screens/info/MudahScreen';
import InfoScreen from '../screens/user/InfoScreen';
import FavoriteMenu from "../screens/user/FavoriteMenu";
[]

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { userInfo } = useContext(AuthContext); // Getting login status from context

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Always register Login & Register */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {userInfo && userInfo.role ? (
        userInfo.role === "admin" ? (
          <>
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            <Stack.Screen name="AddMenu" component={AddMenu} />
            <Stack.Screen name="EditMenu" component={EditMenu} />
            <Stack.Screen name="ManageUsers" component={ManageUsers} />
            <Stack.Screen name="MenuDetail" component={MenuDetail} />
          </>
        ) : (
          <>
            <Stack.Screen name="UserHome" component={UserHome} />
            <Stack.Screen name="MenuList" component={MenuList} />
            <Stack.Screen name="MenuDetail" component={MenuDetail} />
            <Stack.Screen name="Tips" component={TipsScreen} />
            <Stack.Screen name="Diet" component={DietScreen} />
            <Stack.Screen name="Mudah" component={MudahScreen} />
            <Stack.Screen name="Info" component={InfoScreen} />
            <Stack.Screen name="FavoriteMenu" component={FavoriteMenu} />
            
          </>
        )
      ) : null}
    </Stack.Navigator>
  );
};

export default AppNavigator;
