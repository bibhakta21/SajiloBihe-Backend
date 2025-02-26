const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const { expect } = chai;

chai.use(chaiHttp);

describe("Contact Requests", () => {
    let adminToken;
    let contactId;

    // ✅ Get Admin Token Before Tests Run
    before(async () => {
        const res = await chai.request(server).post("/api/users/login").send({
            email: "bibhakta20@gmail.com",
            password: "bibhakta",
        });
        adminToken = res.body.token;
        console.log("Admin Token:", adminToken); // Debugging Line
    });

    // ✅ 1. Submit Contact Form
    it("should submit a contact request", async () => {
        const res = await chai.request(server).post("/api/contact/submit").send({
            name: "John Doe",
            email: "johndoe@gmail.com",
            phone: "1234567890",
            message: "Hello, I need help!",
        });
    
        console.log("Contact Creation Response:", res.body); // Debugging Line
    
        expect(res.status).to.equal(201);
        contactId = res.body.contact?._id; // ✅ Fix: Get the contact ID properly
        console.log("Saved Contact ID:", contactId); // Debugging Line
    });
    

    // ✅ 2. Get All Contacts (Admin only)
    it("should fetch all contact requests", async () => {
        const res = await chai.request(server)
            .get("/api/contact")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
    });

    // ✅ 3. Delete Contact (Admin only)
    it("should delete a contact request", async () => {
        if (!contactId) {
            console.error("contactId is undefined! Cannot proceed with delete test.");
            return;
        }

        const res = await chai.request(server)
            .delete(`/api/contact/${contactId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Contact request deleted successfully!");
    });
});
