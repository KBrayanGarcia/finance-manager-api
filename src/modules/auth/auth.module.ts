import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { DEFAULT_EXPIRES_IN, DEFAULT_SECRET } from "../../config/jwt.config";

@Global()
@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("jwt.secret") ?? DEFAULT_SECRET,
                signOptions: {
                    expiresIn: configService.get<string>("jwt.expiresIn") ?? DEFAULT_EXPIRES_IN,
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    exports: [AuthService, JwtModule, PassportModule, JwtAuthGuard],
})
export class AuthModule {}
