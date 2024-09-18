import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  private readonly items: { name: string }[] = []

  create(item) {
    this.items.push(item)
  }

  findAll(): { name: string }[] {
    return this.items
  }
}