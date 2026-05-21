import { MenuItem } from "../../domain/entities/MenuItem";
import { MenuItemRepository } from "../../domain/repositories/MenuItemRepository";
import { MenuItemModel } from "../database/MenuItemModel";

export class MongoMenuItemRepository implements MenuItemRepository {
  async create(name: string, parentId: string | null): Promise<MenuItem> {
    const doc = await MenuItemModel.create({ name, parentId });
    return { id: doc._id.toString(), name: doc.name, parentId: doc.parentId };
  }

  async findAll(): Promise<MenuItem[]> {
    const docs = await MenuItemModel.find();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      parentId: doc.parentId,
    }));
  }

  async findById(id: string): Promise<MenuItem | null> {
    const doc = await MenuItemModel.findById(id);
    if (!doc) return null;
    return { id: doc._id.toString(), name: doc.name, parentId: doc.parentId };
  }

  async deleteById(id: string): Promise<void> {
    await MenuItemModel.findByIdAndDelete(id);
  }

  async deleteByParentId(parentId: string): Promise<void> {
    await MenuItemModel.deleteMany({ parentId });
  }
}
