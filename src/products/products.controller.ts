import { ProductsService } from './products.service';
import { Controller, Get, Req } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll(@Req() { query: { page = 1, perPage = 10 } }) {
    return await this.productsService.findAll(+page, +perPage);
  }
}
