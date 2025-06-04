import { config } from 'dotenv';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';

config();
const configService = new ConfigService();

@Module({
  providers: [],
  controllers: [],
  imports: [
    ProductsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      synchronize: true,
      entities: [Product],
      replication: {
        master: {
          host: configService.get('DB_HOST_MASTER'), // Escrita
          database: configService.get('DB_NAME_MASTER'),
          username: configService.get('DB_USER_MASTER'),
          password: configService.get('DB_PASSWORD_MASTER'),
          port: parseInt(configService.get('DB_PORT_MASTER') as string, 10),
        },
        slaves: [{
          host: configService.get('DB_HOST_SLAVE'), // Leitura
          database: configService.get('DB_NAME_SLAVE'),
          username: configService.get('DB_USER_SLAVE'),
          password: configService.get('DB_PASSWORD_SLAVE'),
          port: parseInt(configService.get('DB_PORT_SLAVE') as string, 10),
        }]
      },
    })
  ],
})
export class AppModule { }
