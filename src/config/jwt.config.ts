import { registerAs } from "@nestjs/config";

export interface JwtConfig {
    readonly secret: string;
    readonly expiresIn: string;
}

export const DEFAULT_SECRET = "default_insecure_secret_key_for_development";
export const DEFAULT_EXPIRES_IN = "1d";

export const jwtConfig = registerAs(
    "jwt",
    (): JwtConfig => ({
        secret: process.env.JWT_SECRET ?? DEFAULT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN ?? DEFAULT_EXPIRES_IN,
    }),
);
