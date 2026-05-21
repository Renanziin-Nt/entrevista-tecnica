import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { MenuItemModel } from "../../infrastructure/database/MenuItemModel";

describe("Menu API (e2e)", () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/api-menu-test";
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await MenuItemModel.deleteMany({});
  });

  describe("POST /api/v1/menu", () => {
    it("should create a root item and return 201", async () => {
      const res = await request(app)
        .post("/api/v1/menu")
        .send({ name: "Eletrodomésticos" });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
    });

    it("should create a child item with relatedId", async () => {
      const parent = await request(app)
        .post("/api/v1/menu")
        .send({ name: "Eletrodomésticos" });

      const res = await request(app)
        .post("/api/v1/menu")
        .send({ name: "Televisores", relatedId: parent.body.id });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
    });

    it("should return 400 when name is missing", async () => {
      const res = await request(app).post("/api/v1/menu").send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it("should return 400 when relatedId is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/menu")
        .send({ name: "Televisores", relatedId: "000000000000000000000000" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/menu", () => {
    it("should return empty array when no items", async () => {
      const res = await request(app).get("/api/v1/menu");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return nested menu tree", async () => {
      const root = await request(app)
        .post("/api/v1/menu")
        .send({ name: "Eletrodomésticos" });

      await request(app)
        .post("/api/v1/menu")
        .send({ name: "Televisores", relatedId: root.body.id });

      const res = await request(app).get("/api/v1/menu");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe("Eletrodomésticos");
      expect(res.body[0].submenus).toHaveLength(1);
      expect(res.body[0].submenus[0].name).toBe("Televisores");
    });
  });

  describe("DELETE /api/v1/menu/:id", () => {
    it("should delete item and return 200", async () => {
      const item = await request(app)
        .post("/api/v1/menu")
        .send({ name: "Eletrodomésticos" });

      const res = await request(app).delete(`/api/v1/menu/${item.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Item deleted");

      const menu = await request(app).get("/api/v1/menu");
      expect(menu.body).toEqual([]);
    });

    it("should delete item and all children recursively", async () => {
      const root = await request(app)
        .post("/api/v1/menu")
        .send({ name: "Eletrodomésticos" });

      const child = await request(app)
        .post("/api/v1/menu")
        .send({ name: "Televisores", relatedId: root.body.id });

      await request(app)
        .post("/api/v1/menu")
        .send({ name: "LCD", relatedId: child.body.id });

      const res = await request(app).delete(`/api/v1/menu/${root.body.id}`);
      expect(res.status).toBe(200);

      const menu = await request(app).get("/api/v1/menu");
      expect(menu.body).toEqual([]);
    });
  });
});
