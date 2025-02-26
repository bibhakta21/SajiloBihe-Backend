const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const { expect } = chai;

chai.use(chaiHttp);

describe("Booking Management", () => {
  let userToken;
  let bookingId;
  let venueId;

  //  Get User Token Before Tests Run
  before(async () => {
    const userRes = await chai.request(server).post("/api/users/login").send({
      email: "bibhakta20@gmail.com", 
      password: "bibhakta", 
    });
    userToken = userRes.body.token;
    console.log("User Token:", userToken); 

    //  Fetch a Venue ID to Use for Booking
    const venueRes = await chai.request(server).get("/api/venues");
    expect(venueRes.status).to.equal(200);
    expect(venueRes.body).to.be.an("array");
    
    venueId = venueRes.body.length > 0 ? venueRes.body[0]._id : null;
    console.log("Selected Venue ID:", venueId); // Debugging Line
  });

  // 1. Create a new Booking
  it("should create a booking", async () => {
    if (!venueId) {
      console.error("No venue available for booking. Skipping test.");
      return;
    }

    const res = await chai.request(server)
      .post("/api/bookings")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ venueId });

    console.log("Booking Creation Response:", res.body); // Debugging Line

    expect(res.status).to.equal(201);
    bookingId = res.body.booking?._id;
    console.log("Created Booking ID:", bookingId); // Debugging Line
  });

  // 2. Get User Bookings
  it("should fetch user's bookings", async () => {
    const res = await chai.request(server)
      .get("/api/bookings/my-bookings")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  // ✅ 3. Cancel Booking
  it("should cancel a booking", async () => {
    if (!bookingId) {
      console.error("No booking found to cancel. Skipping test.");
      return;
    }

    const res = await chai.request(server)
      .put(`/api/bookings/${bookingId}/cancel`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Booking successfully canceled and removed.");
  });
});
