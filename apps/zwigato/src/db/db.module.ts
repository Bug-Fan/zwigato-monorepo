import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbConnection } from './database.connection';
import { LogService } from './log.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...DbConnection, LogService],
  exports: [...DbConnection, LogService],
})
export class DbModule {}
