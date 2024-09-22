process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let items = require("../fakeDb");
let apples = { name: "apples", price: 1.5 };

beforeEach(() => items.push(apples));
afterEach(() => (items.length = 0));

describe("GET /items", () => {
  test("Gets a list of items", async function () {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual([apples]);
  });
});

describe("GET /items/:name", () => {
  test("Get grocery item by name", async function () {
    const resp = await request(app).get(`/items/${apples.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ item: apples });
  });
  test("Responds with 404 for invalid item", async () => {
    const resp = await request(app).get("/items/bananas");
    expect(resp.statusCode).toBe(404);
  });
});

describe(" POST /items", () => {
  test("Creating an item", async () => {
    const resp = await request(app).post("/items").send({
      name: "cereal",
      price: 5,
    });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ added: { name: "cereal", price: 5 } });
  });

  test("Responds with 404 if name is missing", async () => {
    const resp = await request(app).post("/items").send({
      name: "",
      price: 5,
    });
    expect(resp.statusCode).toBe(404);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating the item's name", async () => {
    const resp = await request(app)
      .patch(`/items/${apples.name}`)
      .send({ name: "pears", price: 1 });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ updated: { name: "pears", price: 1 } });
  });

  test("Responds with 404 for invalid name", async () => {
    const resp = await request(app)
      .patch("/items/chips")
      .send({ name: "pears", price: 1 });
    expect(resp.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
    test("Deleting a item", async () => {
      const resp = await request(app).delete(`/items/${apples.name}`);
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ message: 'Deleted' })
    })
    test("Responds with 404 for deleting invalid item", async () => {
      const res = await request(app).delete(`/items/flour`);
      expect(res.statusCode).toBe(404);
    })
  })