import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {FC, useEffect} from 'react';
import AuthNavigator from './AuthNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAuthState,
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from 'src/store/auth';
import TabNavigator from './TabNavigator';
import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import client from 'src/api/client';
import {StyleSheet, View} from 'react-native';
import Loader from '@ui/Loader';
import colors from '@utils/colors';

interface Props {}

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.CONTRAST,
  },
};

const AppNavigator: FC<Props> = props => {
  const {loggedIn, busy} = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateBusyState(true));
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        if (!token) {
          return dispatch(updateBusyState(false));
        }

        const {data} = await client.get('/auth/is-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(updateProfile(data.user));
        dispatch(updateLoggedInState(true));
      } catch (error) {
        console.log('Auth check error: ', error);
      }

      dispatch(updateBusyState(false));
    };

    fetchAuthInfo();
  }, [dispatch]);

  return (
    <NavigationContainer theme={AppTheme}>
      {busy ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.OVERLAY,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <Loader />
        </View>
      ) : null}
      {loggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
