import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: string;
  MONGO_URL: string;
  SECRETORPRIVATEKEY: string;
  STRIPE_SECRET: string;
  STRIPE_ENDPOINT_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  MAIL_FROM: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_URL: joi.string().required(),
    SECRETORPRIVATEKEY: joi.string().required(),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    SMTP_HOST: joi.string().required(),
    SMTP_PORT: joi.string().required(),
    SMTP_USER: joi.string().required(),
    SMTP_PASS: joi.string().required(),
    MAIL_FROM: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  mongoUrl: envVars.MONGO_URL,
  secretKey: envVars.SECRETORPRIVATEKEY,
  stripeSecret: envVars.STRIPE_SECRET,
  stripeEndpointSecret: envVars.STRIPE_ENDPOINT_SECRET,
  stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
  smtpHost: envVars.SMTP_HOST,
  smtpPort: envVars.SMTP_PORT,
  smtpUser: envVars.SMTP_USER,
  smtpPass: envVars.SMTP_PASS,
  smtpFrom: envVars.MAIL_FROM,
};
