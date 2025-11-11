export interface CreatePublicationDTO {
  titulo: string;
  subtitulo: string;
  autor_id: number;
  paragrafos: CreateParagraphDTO[];
}

export interface CreateParagraphDTO {
  posicao: number;
  conteudo: string;
  imagem_apos_paragrafo: number;
}
