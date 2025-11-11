import { Paragraph } from "./paragraph";

export interface Publication {
  id: number,
  titulo: string,
	subtitulo: string,
	capa_url: string,
	autor_id: number,
	autor_nome: string,
	autor_sobrenome: string,
  paragrafos: Paragraph[],
  criado_em: string,
  atualizado_em: string
};


