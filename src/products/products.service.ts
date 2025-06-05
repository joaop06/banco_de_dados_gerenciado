import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProductsService {

  static insertInProgress = false;
  private logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) { }

  async findAll(page: number = 1, perPage: number = 10): Promise<Product[]> {
    return await this.repository.find({
      take: perPage,
      skip: (page - 1) * perPage,
      order: {
        id: 'DESC'
      }
    });
  }


  @Cron(CronExpression.EVERY_SECOND)
  async create() {
    if (ProductsService.insertInProgress) return;
    ProductsService.insertInProgress = true;


    console.log('\n\n');
    this.logger.log('*************************************** Novo Produto ***************************************');


    // Monta o objeto do novo Produto
    const productDto = await this.generateInsertQuery();

    // Insere o novo Produto
    const newProduct = await this.repository.save(productDto);
    this.logger.log(newProduct);


    /**
     * O laço inicia com o ID do novo Produto
     * A cada iteração regride 1 ID, consulta e exibe o resultado
    */
    const startId = newProduct.id - 1;
    const stopId = newProduct.id - 10;
    for (let id = startId; id >= stopId; id--) {
      const product = await this.repository.findOneBy({ id });

      if (!product) this.logger.error(`Produto ${id} não encontrado`);
      else this.logger.log(`Produto ${product.id}: Descrição ${product.descricao} // Categoria ${product.categoria} // Criado em ${this.formatDate(product.criado_em)}`);
    };


    ProductsService.insertInProgress = false;
  }

  async generateInsertQuery(): Promise<Product> {
    const descriptionPrefix = 'Descrição Produto JPR';

    const count = await this.repository.count({
      where: {
        descricao: Like(`%${descriptionPrefix}%`)
      }
    });

    const productDto = {
      criado_em: new Date(),
      criado_por: 'joao_pedro_e_raul',
      categoria: `Categ.${count + 1}`,
      valor: Math.random() * (5000 - 10) + 10,
      descricao: `${descriptionPrefix} ${count + 1}`,
    };

    return this.repository.create(productDto);
  }

  formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}
