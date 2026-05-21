import { MenuItemRepository } from "../../domain/repositories/MenuItemRepository";

export class CreateMenuItem {
  constructor(private repository: MenuItemRepository) {}

  async execute(name: string, relatedId: string | null): Promise<{ id: string }> {
    if (relatedId) {
      const parent = await this.repository.findById(relatedId);
      if (!parent) throw new Error("Parent item not found");
    }
    const item = await this.repository.create(name, relatedId);
    return { id: item.id };
  }
}
