import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: string;
  MONGO_URL: string;
  SECRETORPRIVATEKEY: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_URL: joi.string().required(),
    SECRETORPRIVATEKEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  mongoUrl: envVars.MONGO_URL,
  secretKey: envVars.SECRETORPRIVATEKEY,
};
