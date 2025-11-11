import { CreateUserDTO } from "./createUser.dto";

export type UpdateUserDTO = Partial<Omit<CreateUserDTO, 'senha'>>
