import { Controller, Get, HttpCode } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @HttpCode(200)
  async handle() {
    this.appService.create({ name: "item1" });
    this.appService.create({ name: "item2" });

    return this.appService.findAll()
  }
}