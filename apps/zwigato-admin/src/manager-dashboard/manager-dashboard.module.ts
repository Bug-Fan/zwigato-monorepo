import { Module } from '@nestjs/common';
import { ManagerController } from './manager-dashboard.controller';
import { ManagerService } from './manager-dashboard.service';

@Module({
  imports: [],
  providers: [ManagerService],
  controllers: [ManagerController],
})
export class ManagerModule { }
