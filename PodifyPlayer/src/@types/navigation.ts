import {NewUserRequest} from '@views/auth/SignUp';

export type AuthStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  LostPassword: undefined;
  Verification: {userInfo: NewUserResponse};
};

export interface NewUserResponse {
  id: string;
  name: string;
  email: string;
}
