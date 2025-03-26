import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: config.get('DB_TYPE') as string,
        host: config.get('PG_HOST') as string,
        port: parseInt(config.get('PG_PORT') as string),
        username: config.get('PG_USER') as string,
        password: config.get('PG_PASSWORD') as string,
        database: config.get('PG_DB') as string,
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
