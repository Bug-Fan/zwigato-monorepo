import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Restaurant } from 'src/database/entities/restaurant.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject('DataSource') private dataSource: DataSource,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload) {
    let restaurant = await this.dataSource.manager.findOne(Restaurant, {
      where: {
        restaurantId: payload.restaurantId,
        isDeleted: false,
        isVerified: true,
      },
    });
    
    if (!restaurant) throw new UnauthorizedException();
    return payload;
  }
}
