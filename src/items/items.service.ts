import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepositity: Repository<Item>,
  ) {}
  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = this.itemsRepositity.create(createItemInput);
    return await this.itemsRepositity.save(newItem);
  }

  async findAll():Promise<Item[]> {
    return this.itemsRepositity.find()
  }

  async findOne(id: string) {
    const itemByI = await this.itemsRepositity.findOneBy({id});

    if (!itemByI) throw new NotFoundException ( `Item  no encontrado ${id}`)
    return itemByI
  }

  async update(id: string, updateItemInput: UpdateItemInput):Promise<Item> {

    const itemUpdate = await this.itemsRepositity.preload(updateItemInput);

    return  this.itemsRepositity.save(itemUpdate)
  }

 async  remove(id: string) {
    const item = await this.findOne(id)

    await this.itemsRepositity.remove(item)

    return {...item,id}

  }
}
