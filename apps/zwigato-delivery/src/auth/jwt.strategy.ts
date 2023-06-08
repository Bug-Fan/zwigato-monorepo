import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DeliveryAgent } from 'src/db/entities/deliveryAgent.entity';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private manager: EntityManager;
  constructor(
    @Inject('DataSource')
    private dataSource: DataSource,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'key',
    });
    this.manager = this.dataSource.manager;
  }
  async validate(payload: any) {
    let deliveragent = await this.dataSource.manager.findOne(DeliveryAgent, {
      where: {
        agentId: payload.payload.id,
        isVerified: true,
        isEmailVerified: true,
        isDeposited: true,
        isDeleted: false,
      },
    });

    if (!deliveragent) throw new UnauthorizedException();
    return payload;
  }
}
