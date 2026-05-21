export interface CreateMenuItemRequestDTO {
  name: string;
  relatedId?: string;
}

export function validateCreateMenuItemDTO(body: unknown): { valid: true; data: CreateMenuItemRequestDTO } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body is required" };
  }

  const { name, relatedId } = body as Record<string, unknown>;

  if (!name || typeof name !== "string") {
    return { valid: false, error: "name is required and must be a string" };
  }

  if (relatedId !== undefined && typeof relatedId !== "string") {
    return { valid: false, error: "relatedId must be a string" };
  }

  return { valid: true, data: { name, relatedId: relatedId as string | undefined } };
}
