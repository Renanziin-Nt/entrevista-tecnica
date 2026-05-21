import { MenuItem } from "../entities/MenuItem";

export interface MenuItemRepository {
  create(name: string, parentId: string | null): Promise<MenuItem>;
  findAll(): Promise<MenuItem[]>;
  findById(id: string): Promise<MenuItem | null>;
  deleteById(id: string): Promise<void>;
  deleteByParentId(parentId: string): Promise<void>;
}
