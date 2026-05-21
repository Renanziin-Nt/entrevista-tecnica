import { MenuItemRepository } from "../../domain/repositories/MenuItemRepository";

export class DeleteMenuItem {
  constructor(private repository: MenuItemRepository) {}

  async execute(id: string): Promise<void> {
    await this.deleteRecursive(id);
  }

  private async deleteRecursive(id: string): Promise<void> {
    const allItems = await this.repository.findAll();
    const children = allItems.filter((item) => item.parentId === id);
    for (const child of children) {
      await this.deleteRecursive(child.id);
    }
    await this.repository.deleteById(id);
  }
}
