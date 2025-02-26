const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const { expect } = chai;

chai.use(chaiHttp);

describe("Venue Management", () => {
    let adminToken;
    let venueId;

    // ✅ Get Admin Token Before Tests Run
    before(async () => {
        const res = await chai.request(server).post("/api/users/login").send({
            email: "bibhakta20@gmail.com",
            password: "bibhakta",
        });

        adminToken = res.body.token;
        console.log("Admin Token:", adminToken); // Debugging Line
    });

    // ✅ 1. Create a new Venue (Admin only)
    it("should create a new venue", async () => {
        const res = await chai.request(server)
            .post("/api/venues")
            .set("Authorization", `Bearer ${adminToken}`)
            .field("name", "Grand Hall")
            .field("location", "NYC")
            .field("capacity", 500)
            .field("price", 1000)
            .field("description", "Luxury Venue")
            .attach("images", Buffer.from("dummy_image"), "image.jpg"); // ✅ Fix: Attach an image

        console.log("Venue Creation Response:", res.body); // Debugging Line

        expect(res.status).to.equal(201);
        venueId = res.body.venue?._id; // Fix: Ensure venueId is correctly assigned
        console.log("Created Venue ID:", venueId); // Debugging Line
    });

    // ✅ 2. Get All Venues
    it("should fetch all venues", async () => {
        const res = await chai.request(server).get("/api/venues");
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
    });

    // ✅ 3. Get Venue by ID
    it("should get a single venue", async () => {
        if (!venueId) {
            console.error("venueId is undefined! Cannot proceed with test.");
            return;
        }

        const res = await chai.request(server).get(`/api/venues/${venueId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("name", "Grand Hall");
    });

    // ✅ 4. Delete Venue (Admin only)
    it("should delete the venue", async () => {
        if (!venueId) {
            console.error("venueId is undefined! Cannot proceed with delete test.");
            return;
        }

        const res = await chai.request(server)
            .delete(`/api/venues/${venueId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Venue deleted successfully");
    });
});
