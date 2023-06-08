import { Global, Module } from '@nestjs/common';
import { DbConnection } from './database.source';

@Global()
@Module({
  providers: [...DbConnection],
  exports: [...DbConnection],
})
export class DatabaseModule {}
