import { Request, Response } from "express";
import { CreateMenuItem } from "../../application/usecases/CreateMenuItem";
import { DeleteMenuItem } from "../../application/usecases/DeleteMenuItem";
import { GetMenu } from "../../application/usecases/GetMenu";
import { MongoMenuItemRepository } from "../../infrastructure/repositories/MongoMenuItemRepository";
import { validateCreateMenuItemDTO } from "../dtos/CreateMenuItemDTO";
import { CreateMenuItemResponseDTO, DeleteMenuItemResponseDTO } from "../dtos/MenuItemResponseDTO";

const repository = new MongoMenuItemRepository();
const createMenuItem = new CreateMenuItem(repository);
const deleteMenuItem = new DeleteMenuItem(repository);
const getMenu = new GetMenu(repository);

export class MenuController {
  async create(req: Request, res: Response): Promise<void> {
    const validation = validateCreateMenuItemDTO(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }
    const { name, relatedId } = validation.data;
    const result = await createMenuItem.execute(name, relatedId ?? null);
    const response: CreateMenuItemResponseDTO = { id: result.id };
    res.status(201).json(response);
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await deleteMenuItem.execute(id);
    const response: DeleteMenuItemResponseDTO = { message: "Item deleted" };
    res.status(200).json(response);
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const menu = await getMenu.execute();
    res.status(200).json(menu);
  }
}
