import { MenuItem } from "../../domain/entities/MenuItem";
import { MenuItemRepository } from "../../domain/repositories/MenuItemRepository";

export class InMemoryMenuItemRepository implements MenuItemRepository {
  private items: MenuItem[] = [];
  private counter = 0;

  async create(name: string, parentId: string | null): Promise<MenuItem> {
    const item: MenuItem = { id: String(++this.counter), name, parentId };
    this.items.push(item);
    return item;
  }

  async findAll(): Promise<MenuItem[]> {
    return [...this.items];
  }

  async findById(id: string): Promise<MenuItem | null> {
    return this.items.find((i) => i.id === id) ?? null;
  }

  async deleteById(id: string): Promise<void> {
    this.items = this.items.filter((i) => i.id !== id);
  }

  async deleteByParentId(parentId: string): Promise<void> {
    this.items = this.items.filter((i) => i.parentId !== parentId);
  }
}
