import z from 'zod';
import dotenv from 'dotenv';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(['dev', 'test', 'staging', 'prod']),
  PORT: z.coerce.number().int().positive(),
  REDIS_PORT: z.coerce.number(),
  REDIS_HOST: z.string(),
  JWT_SECRET: z.string().min(5),
});

type envVars = z.infer<typeof envSchema>;

class EnvironmentService {
  private env: envVars | null = null;
  loadEnv() {
    if (this.env) {
      return this.env;
    }
    dotenv.config();

    try {
      this.env = envSchema.parse(process.env);
      console.log('Environment variables loaded successfully:', this.env);
    } catch (error: unknown) {
      console.error(
        'Error parsing environment variables:',
        error instanceof Error ? error.message : error,
      );
    }
  }
  get(): envVars {
    if (!this.env) {
      throw new Error('Environment variables not loaded');
    }
    return this.env;
  }
}

export const environmentService = new EnvironmentService();
