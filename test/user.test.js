const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Import the running server
const User = require("../model/User");

chai.use(chaiHttp);
const { expect } = chai;

describe("User Authentication", () => {
  let testUser = { username: "testuser", email: "test@example.com", phone: "1234567890", password: "123456" };
  let token = "";

  // 1. Test User Registration
  it("should register a new user", async () => {
    const res = await chai.request(server).post("/api/users/signup").send(testUser);
    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal("User registered successfully!");
  });

// 2. Test Password Reset Request
it("should send a password reset request", async () => {
    const res = await chai.request(server)
      .post("/api/users/forgot-password")
      .send({ email: testUser.email });

    console.log("Password Reset Response:", res.body); // Debugging Line

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal("Check your Gmail. Reset link has been sent!");

    // Fetch the user from the database and ensure the reset token was generated
    const user = await User.findOne({ email: testUser.email });
    expect(user.resetPasswordToken).to.exist;
  });

  // 3. Test User Login
  it("should log in the user", async () => {
    const res = await chai.request(server).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    token = res.body.token;
  });

  // 4. Reject login with incorrect credentials
  it("should not log in with incorrect password", async () => {
    const res = await chai.request(server).post("/api/users/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Incorrect password");
  });

  // 5. Test Fetch User Profile
  it("should get the logged-in user profile", async () => {
    const res = await chai.request(server).get("/api/users/me").set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("username", testUser.username);
  });

  // 6. Allow user to update profile
  it("should allow the user to update their profile", async () => {
    const updatedUser = { username: "updateduser", email: "updated@example.com", phone: "9876543210" };

    const res = await chai.request(server)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedUser);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal("Profile updated successfully!");
    expect(res.body.user.username).to.equal(updatedUser.username);
    expect(res.body.user.email).to.equal(updatedUser.email);
    expect(res.body.user.phone).to.equal(updatedUser.phone);
  });
});
