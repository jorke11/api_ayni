import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '../../domain/ports/token-issuer.port';

export interface AuthenticatedStaff {
  id: string;
  cedula: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'change-this-secret-in-production',
    });
  }

  validate(payload: TokenPayload): AuthenticatedStaff {
    return { id: payload.sub, cedula: payload.cedula, role: payload.role };
  }
}
