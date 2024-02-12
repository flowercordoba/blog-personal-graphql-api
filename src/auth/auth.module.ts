import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthResolver, AuthService,JwtStrategy],
  exports:[JwtStrategy,PassportModule,JwtModule],

  imports:[
    ConfigModule,
    UsersModule, 
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>{
        // console.log(configService.get('JWT_SECRET'))
        return{
          secret:configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn:'12h'
          }
        }

      }
    })
  ]
})
export class AuthModule {}
