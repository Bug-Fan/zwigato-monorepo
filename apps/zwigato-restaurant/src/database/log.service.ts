import { Inject, Injectable } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { Log } from './entities/log.entity';
import { LogRequestDto } from 'src/interceptors/logging.interceptor';

@Injectable()
export class LogService {
  constructor(@Inject('DataSource') private dataSource: DataSource) {}

  async addlog(logRequestDto: LogRequestDto) {
    try {
      const addedlog = await this.dataSource.manager.insert(Log, logRequestDto);
      return addedlog;
    } catch (error) {
      console.log(`Log not added \n ${error}`);
    }
  }

  async addLogResponse(requestId, response) {
    try {
      const addedresponse = await this.dataSource.manager.update(
        Log,
        { requestId },
        { response },
      );
    } catch (error) {
      console.log(`Log not updated \n ${error}`);
    }
  }
}
