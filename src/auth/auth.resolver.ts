import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignupInput } from './dto/signup-auth.input';
import { AuthResponse } from './types/auth.response.type';
import { UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { LoginInput } from './dto/login-auth.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ValidRoles } from './enum/valid-roles.enum';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse,{name:'signup'})
  async signup(@Args('signupInput') signupInput: SignupInput):Promise<AuthResponse> {
    return this.authService.register(signupInput);


  }

  @Mutation( () => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse>{
    return this.authService.login(loginInput)
  }

  @Query( () => AuthResponse, { name: 'revalidate' })
  @UseGuards( JwtAuthGuard )
  revalidateToken(
    @CurrentUser( [ ValidRoles.admin ] ) user: User
  ): AuthResponse{
    return this.authService.revalidateToken( user );
  }

 


}
