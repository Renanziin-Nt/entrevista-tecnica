import { CreateMenuItem } from "../../application/usecases/CreateMenuItem";
import { GetMenu } from "../../application/usecases/GetMenu";
import { InMemoryMenuItemRepository } from "../helpers/InMemoryMenuItemRepository";

describe("GetMenu", () => {
  let repository: InMemoryMenuItemRepository;
  let createUseCase: CreateMenuItem;
  let getMenuUseCase: GetMenu;

  beforeEach(() => {
    repository = new InMemoryMenuItemRepository();
    createUseCase = new CreateMenuItem(repository);
    getMenuUseCase = new GetMenu(repository);
  });

  it("should return empty array when no items exist", async () => {
    const menu = await getMenuUseCase.execute();
    expect(menu).toEqual([]);
  });

  it("should return flat items without submenus property", async () => {
    await createUseCase.execute("Eletrodomésticos", null);
    const menu = await getMenuUseCase.execute();
    expect(menu).toHaveLength(1);
    expect(menu[0].name).toBe("Eletrodomésticos");
    expect(menu[0].submenus).toBeUndefined();
  });

  it("should build nested tree structure", async () => {
    const root = await createUseCase.execute("Eletrodomésticos", null);
    const child = await createUseCase.execute("Televisores", root.id);
    await createUseCase.execute("LCD", child.id);
    await createUseCase.execute("Plasma", child.id);

    const menu = await getMenuUseCase.execute();
    expect(menu).toHaveLength(1);
    expect(menu[0].submenus).toHaveLength(1);
    expect(menu[0].submenus![0].name).toBe("Televisores");
    expect(menu[0].submenus![0].submenus).toHaveLength(2);
    expect(menu[0].submenus![0].submenus![0].name).toBe("LCD");
    expect(menu[0].submenus![0].submenus![1].name).toBe("Plasma");
  });

  it("should handle multiple root items", async () => {
    await createUseCase.execute("Eletrodomésticos", null);
    await createUseCase.execute("Informática", null);
    const menu = await getMenuUseCase.execute();
    expect(menu).toHaveLength(2);
  });
});
