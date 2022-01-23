const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestDB", () => done());
});
  
afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
});

test("GET /api/products", async () => {
    const product = await Product.create({ /**TODO */ });
  
    await supertest(app).get("/api/products")
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);
  
        // Check data
        expect(response.body[0]._id).toBe(post.id);
        expect(response.body[0].title).toBe(post.title);
        expect(response.body[0].content).toBe(post.content);
      });
  });
  