import { Global, Module } from '@nestjs/common';
import { DbConnection } from './database.source';
import { LogService } from './log.service';

@Global()
@Module({
  providers: [...DbConnection, LogService],
  exports: [...DbConnection, LogService],
})
export class DatabaseModule {}
