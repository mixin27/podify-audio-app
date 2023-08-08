import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitButton from '@components/form/SubmitButton';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppLink from '@ui/AppLink';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import {Keys, saveToAsyncStorage} from '@utils/asyncStorage';
import {FormikHelpers} from 'formik';
import {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthStackParamList} from 'src/@types/navigation';
import client from 'src/api/client';
import {updateLoggedInState, updateProfile} from 'src/store/auth';
import * as yup from 'yup';

const signInSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Invalid email!')
    .required('Email is required!'),
  password: yup
    .string()
    .trim('Password is missing!')
    .min(8, 'Password is too short!')
    .required('Password is required!'),
});

interface Props {}

interface SignInUserRequest {
  email: string;
  password: string;
}

const initialValues = {
  email: '',
  password: '',
};

const SignIn: FC<Props> = props => {
  const navigator = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const [secureEntry, setSecureEntry] = useState(true);

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: SignInUserRequest,
    actions: FormikHelpers<SignInUserRequest>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/sign-in', {
        ...values,
      });

      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);

      dispatch(updateProfile(data.user));
      dispatch(updateLoggedInState(true));
    } catch (err) {
      console.log('Sign in error: ', err);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signInSchema}>
      <AuthFormContainer heading="Welcome back!">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="********"
            label="Password"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            containerStyle={styles.marginBottom}
            rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPressed={togglePasswordView}
          />
          <SubmitButton title="Sign in" />

          <View style={styles.linkContainer}>
            <AppLink
              title="I Lost My Password"
              onPressed={() => {
                navigator.navigate('LostPassword');
              }}
            />
            <AppLink
              title="Sign up"
              onPressed={() => {
                navigator.navigate('SignUp');
              }}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SignIn;
