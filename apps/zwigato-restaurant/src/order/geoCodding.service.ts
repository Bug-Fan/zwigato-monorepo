import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DeliveryAgent } from '../database/entities/deliveryAgent.entity';
import { Restaurant } from '../database/entities/restaurant.entity';

@Injectable()
export class GeoCoddingService {
  async findDistance(deliveryBoys, restaurant) {
    
    const pairs = new LatLonPairs(deliveryBoys, restaurant)
    let contentLength = JSON.stringify(pairs).length
    const headers = {
      'Content-Length': contentLength,
      'Content-Type': 'application/json',
    };
    
    const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?key=AuE8zDkqUuqja48k9HnCut51UDfic6Ms3uevRCQnrGKgIPB7qnnKw-ptwVD_vTec`;
    try {
      const data = await axios({
        method: 'post',
        url,
        headers,
        data: pairs
      });

      const distance = data.data.resourceSets[0].resources[0].results;
      return distance;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.msg);
    }
  }
}

export class LatLonPairs {
  origins: { latitude: string; longitude: string }[] = [];
  destinations: { latitude: string; longitude: string }[] = [];
  travelMode = 'driving';

  constructor(origin: [], restaurant: Restaurant) {
    origin.forEach((deliveryAgent: DeliveryAgent) => {
      this.origins.push({
        latitude: deliveryAgent.agentLatitude,
        longitude: deliveryAgent.agentLongitude,
      });
      const { restaurantLatitude, restaurantLongitude } = restaurant;
      this.destinations = [
        { latitude: restaurantLatitude, longitude: restaurantLongitude },
      ];
    });
  }
}
