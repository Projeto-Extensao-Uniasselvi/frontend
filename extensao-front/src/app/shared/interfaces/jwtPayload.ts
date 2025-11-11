export interface JwtPayload {
  id: number;
  email: string;
  primeiro_nome: string;
  sobrenome: string;
  administrador: boolean | number;
  criado_em: string;
  atualizado_em: string;
  iat: number;
  exp: number;
}
