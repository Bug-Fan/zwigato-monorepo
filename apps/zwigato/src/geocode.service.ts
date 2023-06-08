import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export class GeoCoddingService {
  async findDistance(sourceLat, sourceLon, destinationsLat, destinationsLon) {
    const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${sourceLat},${sourceLon}&destinations=${destinationsLat},${destinationsLon}&travelMode=driving&key=AuE8zDkqUuqja48k9HnCut51UDfic6Ms3uevRCQnrGKgIPB7qnnKw-ptwVD_vTec`;
    try {
      const data = await axios({
        method: 'get',
        url,
      });
      const distance =
        data.data.resourceSets[0].resources[0].results[0].travelDistance;
      return distance;
    } catch (err) {
      throw new BadRequestException(err.msg);
    }
  }
}
