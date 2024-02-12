import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';


import { SignupInput } from './dto/signup-auth.input';
import { AuthResponse } from './types/auth.response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/login-auth.input';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor( 
    private readonly userServices:UsersService,
    private readonly jwtService: JwtService,
    
    ){}

    private getJwtToken( userId: string ) {
      return this.jwtService.sign({ id: userId });
  }
 async register(signupInput: SignupInput):Promise<AuthResponse>{
    const user = await this.userServices.create(signupInput) 
    const token = this.getJwtToken( user.id );
        return {
      token,
      user
    }
    // throw new Error ('No implementado')
  }


  async login( loginInput: LoginInput ): Promise<AuthResponse>{
        
    const { email, password } = loginInput;
    const user = await this.userServices.findOneByEmail( email );

    // if( !bcrypt.compareSync( password, user.password) ){
    //     throw new BadRequestException('Email / Password do not match');
    // }
    
    const token = this.getJwtToken( user.id );
    
    return {
        token,
        user
    }
}

async validateUser( id: string ): Promise<User> {

    const user = await this.userServices.findOneById( id );

    if( !user.isActive ){
        throw new UnauthorizedException(`User is inactive, talk with an admin`);
    }

    delete user.password;

    return user;
}

revalidateToken( user: User ): AuthResponse {

    const token = this.getJwtToken( user.id );

    return { token, user }

}
}
