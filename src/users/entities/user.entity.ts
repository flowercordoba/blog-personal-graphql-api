import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@ObjectType()
@Entity('users')

export class User {

  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id:string;

  
  @Field(() => String)
  @Column()
  fullname:string;

  
  @Field(() => String)
  @Column({unique:true})
  email:string;

  
  // @Field(() => String)
  @Column()
  password:string;
  
  @Field(() => [String])
  @Column({type:'text',array:true,default:['user']})
  roles:string[];


  @Column({
    type:'boolean',
    default:true
  })
  @Field(() => Boolean)
  isActive:boolean
}
