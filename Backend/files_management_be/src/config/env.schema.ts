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

    MAIL_HOST: z.string(),
    MAIL_PORT: z.coerce.number(),
    MAIL_SECURE: z.string().transform((value) => value.toLowerCase() === "true"),
    MAIL_USER: z.string().email(),
    MAIL_PASSWORD: z.string(),

    REDIS_HOST: z.string().default("localhost"),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional(),
});

export type EnvSchemaType = z.infer<typeof EnvSchema>