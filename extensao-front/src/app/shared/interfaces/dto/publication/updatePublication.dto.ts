import { CreatePublicationDTO, CreateParagraphDTO } from "./createPublication.dto";

export type UpdatePublicationDTO =
  Partial<Omit<CreatePublicationDTO, 'paragrafos'>>
  & { paragrafos?: UpdateParagraphDTO[] };

interface UpdateParagraphDTO extends Partial<CreateParagraphDTO> {
  id?: number;
  posicao: number;
}