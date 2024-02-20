const request = require("supertest");

const app = require("../src/app");

const database = require("../database");

afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});
it("should return no user", async () => {
  const response = await request(app).get("/api/users/0");

  expect(response.status).toEqual(404);
});

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "",
      lastname: "",
      email: `${crypto.randomUUID()}@test.co`,
      city: "",
      language: null, // indiqué comme NULL donc pas obligatoire
    };

    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [userInDatabase] = result;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase).toStrictEqual(newUser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase).toStrictEqual(newUser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase).toStrictEqual(newUser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase).toStrictEqual(newUser.city);
  });

  it("should return an error", async () => {
    const userWithMissingProps = {
      firstname: "Fine",
    };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(244);
  });
});
describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newMovie = {
      firstname: "Gisèle",
      lastname: "Nope",
      email: `${crypto.randomUUID()}@test.co`,
      city: "Paris",
      language: "English",
    };

    const [result] = await database.query(
      "INSERT INTO movies(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "Pierre",
      lastname: "Nipe",
      email: `${crypto.randomUUID()}@test.co`,
      city: "Paris",
      language: "English",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);

    const [movies] = await database.query(
      "SELECT * FROM movies WHERE id=?",
      id
    );

    const [userInDatabase] = users;

    expect(userInDatabase).toHaveProperty("id");

    expect(userInDatabase).toHaveProperty("firstname");
    expect(userInDatabase.firstname).toStrictEqual(updatedUser.firstname);

    expect(userInDatabase).toHaveProperty("lastname");
    expect(userInDatabase.lastname).toStrictEqual(updatedUser.lastname);

    expect(userInDatabase).toHaveProperty("email");
    expect(userInDatabase.email).toStrictEqual(updatedUser.email);

    expect(userInDatabase).toHaveProperty("city");
    expect(userInDatabase.city).toStrictEqual(updatedUser.city);

    expect(userInDatabase).toHaveProperty("language");
    expect(userInDatabase.language).toStrictEqual(updatedUser.language);
  });

  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Aurore"};

    const response = await request(app)
    .put(`/api/users/1`)
    .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Or",
      lastname: "Chouquette",
      email: `${crypto.randomUUID()}@test.co`,
      city: "Paris",
      language: "English",
    };

    const response = (await request(app).put("/api/users/0")).setEncoding(newUser);

    expect(response.status).toEqual(404);
  })
});
