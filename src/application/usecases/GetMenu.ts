import { MenuItemTree } from "../../domain/entities/MenuItem";
import { MenuItemRepository } from "../../domain/repositories/MenuItemRepository";

export class GetMenu {
  constructor(private repository: MenuItemRepository) {}

  async execute(): Promise<MenuItemTree[]> {
    const items = await this.repository.findAll();
    const buildTree = (parentId: string | null): MenuItemTree[] => {
      return items
        .filter((item) => item.parentId === parentId)
        .map((item) => {
          const children = buildTree(item.id);
          const node: MenuItemTree = { id: item.id, name: item.name };
          if (children.length > 0) node.submenus = children;
          return node;
        });
    };
    return buildTree(null);
  }
}
