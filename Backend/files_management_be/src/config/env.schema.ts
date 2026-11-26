import z from "zod";

export const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    APP_PORT: z.coerce.number().default(3000),
    ENABLE_SWAGGER: z.coerce.boolean().default(true),

    DB_NAME: z.string(),
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.coerce.number().default(5432),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DATABASE_URL: z.string(),

    JWT_ACCESS_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),
    JWT_HIDDEN_SECRET: z.string(),

    MAIL_HOST: z.string(),
    MAIL_PORT: z.coerce.number(),
    MAIL_SECURE: z.string().transform((value) => value.toLowerCase() === "true"),
    MAIL_USER: z.string().email(),
    MAIL_PASSWORD: z.string(),

    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional(),

    MINIO_API_PORT: z.coerce.number().default(9000),
    MINIO_CONSOLE_PORT: z.coerce.number().default(9001),
    MINIO_ENDPOINT: z.string().url(),
    MINIO_ROOT_USER: z.string(),
    MINIO_ROOT_PASSWORD: z.string(),
    MINIO_BUCKET: z.string(),

    CLAMAV_HOST: z.string().default("localhost"),
    CLAMAV_PORT: z.coerce.number(),
});

export type EnvSchemaType = z.infer<typeof EnvSchema>