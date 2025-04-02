export interface IBaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
