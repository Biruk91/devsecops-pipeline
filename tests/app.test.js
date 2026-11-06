const request = require("supertest");
const app = require("../src/app");

describe("API Endpoints Test Suite", () => {
  describe("GET /api/health", () => {
    it("should return 200 OK with UP status", async () => {
      const res = await request(app).get("/api/health");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status", "UP");
      expect(res.body).toHaveProperty("uptime");
      expect(res.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/items", () => {
    it("should return 200 OK with item list", async () => {
      const res = await request(app).get("/api/items");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(2);
    });
  });

  describe("POST /api/items", () => {
    it("should create a new item when valid payload is sent", async () => {
      const payload = { name: "CI/CD Pipeline Gate", category: "Automation" };
      const res = await request(app).post("/api/items").send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("CI/CD Pipeline Gate");
    });

    it("should return 400 Bad Request when name is missing", async () => {
      const res = await request(app)
        .post("/api/items")
        .send({ category: "Automation" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("404 Handling for undefined routes", () => {
    it("should return 404 for unknown endpoints", async () => {
      const res = await request(app).get("/api/unknown-route");
      expect(res.statusCode).toBe(404);
    });
  });
});
