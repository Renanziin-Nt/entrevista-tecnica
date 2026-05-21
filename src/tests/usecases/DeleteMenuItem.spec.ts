import { CreateMenuItem } from "../../application/usecases/CreateMenuItem";
import { DeleteMenuItem } from "../../application/usecases/DeleteMenuItem";
import { InMemoryMenuItemRepository } from "../helpers/InMemoryMenuItemRepository";

describe("DeleteMenuItem", () => {
  let repository: InMemoryMenuItemRepository;
  let createUseCase: CreateMenuItem;
  let deleteUseCase: DeleteMenuItem;

  beforeEach(() => {
    repository = new InMemoryMenuItemRepository();
    createUseCase = new CreateMenuItem(repository);
    deleteUseCase = new DeleteMenuItem(repository);
  });

  it("should delete a single item", async () => {
    const item = await createUseCase.execute("Eletrodomésticos", null);
    await deleteUseCase.execute(item.id);
    const items = await repository.findAll();
    expect(items).toHaveLength(0);
  });

  it("should delete item and all its children recursively", async () => {
    const root = await createUseCase.execute("Eletrodomésticos", null);
    const child = await createUseCase.execute("Televisores", root.id);
    await createUseCase.execute("LCD", child.id);
    await createUseCase.execute("Plasma", child.id);

    await deleteUseCase.execute(root.id);
    const items = await repository.findAll();
    expect(items).toHaveLength(0);
  });

  it("should only delete the subtree, not siblings", async () => {
    const root1 = await createUseCase.execute("Eletrodomésticos", null);
    const root2 = await createUseCase.execute("Informática", null);
    await createUseCase.execute("Televisores", root1.id);

    await deleteUseCase.execute(root1.id);
    const items = await repository.findAll();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(root2.id);
  });
});
