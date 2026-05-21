import { CreateMenuItem } from "../../application/usecases/CreateMenuItem";
import { InMemoryMenuItemRepository } from "../helpers/InMemoryMenuItemRepository";

describe("CreateMenuItem", () => {
  let repository: InMemoryMenuItemRepository;
  let useCase: CreateMenuItem;

  beforeEach(() => {
    repository = new InMemoryMenuItemRepository();
    useCase = new CreateMenuItem(repository);
  });

  it("should create a root item", async () => {
    const result = await useCase.execute("Eletrodomésticos", null);
    expect(result.id).toBeDefined();
    const items = await repository.findAll();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe("Eletrodomésticos");
    expect(items[0].parentId).toBeNull();
  });

  it("should create a child item with valid parentId", async () => {
    const parent = await useCase.execute("Eletrodomésticos", null);
    const child = await useCase.execute("Televisores", parent.id);
    const items = await repository.findAll();
    expect(items).toHaveLength(2);
    expect(items[1].parentId).toBe(parent.id);
    expect(child.id).toBeDefined();
  });

  it("should throw error when parentId does not exist", async () => {
    await expect(useCase.execute("Televisores", "invalid-id")).rejects.toThrow(
      "Parent item not found"
    );
  });
});
