import { Module } from '@nestjs/common';
import { CustomerController } from './customers.controller';

@Module({
  controllers: [CustomerController],
})
export class CustomersModule {}
