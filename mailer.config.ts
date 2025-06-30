import { envs } from './src/config';

export const mailerConfig = {
  host: envs.smtpHost || 'smtp.gmail.com',
  port: parseInt(envs.smtpPort || '465', 10),
  secure: true,
  auth: {
    user: envs.smtpUser,
    pass: envs.smtpPass,
  },
  from: envs.smtpFrom,
};
