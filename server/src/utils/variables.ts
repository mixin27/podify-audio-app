const { env } = process as { env: { [key: string]: string } };

export const {
  PORT,
  MONGO_URI,
  M_TRAP_USER,
  M_TRAP_PASS,
  M_TRAP_HOST,
  M_TRAP_PORT,
  VERIFICATION_EMAIL,
  PASSWORD_RESET_LINK,
  SIGN_IN_URL,
} = env;
