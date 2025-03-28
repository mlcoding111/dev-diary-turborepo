export type AuthJwtPayload = {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
};
