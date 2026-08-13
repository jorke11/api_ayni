export const TOKEN_ISSUER = Symbol('TOKEN_ISSUER');

export interface TokenPayload {
  sub: string;
  cedula: string;
  role: string;
}

export interface TokenIssuerPort {
  issue(payload: TokenPayload): string;
}
