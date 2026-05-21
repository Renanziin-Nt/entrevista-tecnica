export interface MenuItem {
  id: string;
  name: string;
  parentId: string | null;
}

export interface MenuItemTree {
  id: string;
  name: string;
  submenus?: MenuItemTree[];
}
