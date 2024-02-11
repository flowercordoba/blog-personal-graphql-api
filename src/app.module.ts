import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import {ConfigModule  } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],

    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // 'localhost'
      port: +process.env.DB_PORT, // 5432, asegúrate de convertirlo a número con el operador +
      username: process.env.POSTGRES_USER, // 'any_list'
      password: process.env.POSTGRES_PASSWORD, // 'api'
      database: process.env.POSTGRES_DB, // 'anylist'
      synchronize: true, // Cuidado con esta opción en producción
      autoLoadEntities:true
    }),
    ItemsModule,
  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
