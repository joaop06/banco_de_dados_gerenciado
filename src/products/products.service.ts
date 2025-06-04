import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) { }

  async findAll(): Promise<Product[]> {
    return await this.repository.find();
  }
}
