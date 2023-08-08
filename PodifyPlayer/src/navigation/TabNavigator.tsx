/* eslint-disable react/no-unstable-nested-components */
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import colors from '@utils/colors';
import Home from '@views/Home';
import Profile from '@views/Profile';
import Upload from '@views/Upload';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MdiIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.PRIMARY,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: props => {
            return (
              <AntDesignIcon
                name="home"
                size={props.size}
                color={props.color}
              />
            );
          },
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: props => {
            return (
              <AntDesignIcon
                name="user"
                size={props.size}
                color={props.color}
              />
            );
          },
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarIcon: props => {
            return (
              <MdiIcon
                name="account-music-outline"
                size={props.size}
                color={props.color}
              />
            );
          },
          tabBarLabel: 'Upload',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
