import { CRUD_METHODS } from '../contansts/CRUD_METHODS';

export type CrudMethod = (typeof CRUD_METHODS)[number];
