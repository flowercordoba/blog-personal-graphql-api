import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/signup-auth.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  private logger = new Logger('userServices')
  constructor(
    @InjectRepository(User)
    private readonly userReposity:Repository<User>
  ){}

  async create(signupInput: SignupInput):Promise<User>  {
   try {
    const newUser = this.userReposity.create({ 
      ...signupInput,
      password: bcrypt.hashSync( signupInput.password, 10 )
     });

    return await this.userReposity.save( newUser ); 
   } catch (error) {
    this.handleErrors(`${error}`)
   }
  }
  

 async findAll():Promise<User[]>  {
    return []
  }

  findOne(id: string):Promise<User> {
    throw new Error (`method findOne not implemented`)
  }
  async findOneById( id: string ): Promise<User> {
   
    try {
      return await this.userReposity.findOneByOrFail({ id })
    } catch (error) {
      throw new NotFoundException(`${ id } not found`);
    }

  }

  async findOneByEmail( email: string ): Promise<User> {
   
    try {
      return await this.userReposity.findOneByOrFail({ email })
    } catch (error) {
      
      throw new NotFoundException(`${ email } not found`);

      // this.handleDBErrors({
      //   code: 'error-001',
      //   detail: `${ email } not found`
      // });
    }

  }


  block(id: string):Promise<User> {
    throw new Error (`method block not implemented`)
  }

  private handleErrors ( error:any):never{
    if(error.code === '23505'){
      throw new BadRequestException(error.detail.replace('key',''))
    }
    this.logger.error(error);
    throw new InternalServerErrorException('revisa el log');


  }
}
