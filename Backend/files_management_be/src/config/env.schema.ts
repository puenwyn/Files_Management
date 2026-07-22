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
});

export type EnvSchemaType = z.infer<typeof EnvSchema>