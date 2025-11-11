import { Publication } from "./entities/publication";
import { User } from "./entities/user";
import { Pagination } from "./pagination";

export interface ApiResponse {
  mensagem: string,
  token_de_acesso?: string,
  usuario?: User,
  usuarios?: User[],
  publicacao?: Publication,
  publicacoes?: Publication[],
  paginacao?: Pagination
}