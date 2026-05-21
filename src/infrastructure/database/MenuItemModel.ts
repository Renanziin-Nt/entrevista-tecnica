import mongoose, { Schema, Document } from "mongoose";

export interface MenuItemDocument extends Document {
  name: string;
  parentId: string | null;
}

const MenuItemSchema = new Schema<MenuItemDocument>({
  name: { type: String, required: true, unique: true },
  parentId: { type: String, default: null },
});

export const MenuItemModel = mongoose.model<MenuItemDocument>("MenuItem", MenuItemSchema);
