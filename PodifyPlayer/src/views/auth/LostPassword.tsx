import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import SubmitButton from '@components/form/SubmitButton';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from 'src/@types/navigation';
import client from 'src/api/client';
import {FormikHelpers} from 'formik';

const lostPasswordSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Invalid email!')
    .required('Email is required!'),
});

interface Props {}

interface LostPasswordRequest {
  email: string;
}

const initialValues = {
  email: '',
};

const LostPassword: FC<Props> = props => {
  const navigator = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSubmit = async (
    values: LostPasswordRequest,
    actions: FormikHelpers<LostPasswordRequest>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/forgot-password', {
        ...values,
      });
      console.log(data);

      navigator.navigate('SignIn');
    } catch (err) {
      console.log('Lost password error: ', err);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={lostPasswordSchema}>
      <AuthFormContainer
        heading="Forget Password!"
        subHeading="Oops, did you forget your password? Don't worry, we'll help you get back in.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />

          <SubmitButton title="Send link" />

          <View style={styles.linkContainer}>
            <AppLink
              title="Sign in"
              onPressed={() => {
                navigator.navigate('SignIn');
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

export default LostPassword;
