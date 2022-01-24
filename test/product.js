const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

beforeEach((done) => {
    mongoose.connect(process.env.MONGODB_CNN, () => done());
});
  
afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done())
    });
});

test("GET /api/products/all", async () => {
    const product = await Product.create({ /**TODO */ });
  
    await supertest(app).get("/api/products/all")
      .expect(200)
      .then((response) => {

        // expect(Array.isArray(response.body)).toBeTruthy();
        // expect(response.body.length).toEqual(1);
  
        // expect(response.body[0]._id).toBe(post.id);
        // expect(response.body[0].title).toBe(post.title);
        // expect(response.body[0].content).toBe(post.content);
      });
  });
  