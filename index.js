const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs"); // to write files

const app = express();
app.use(express.urlencoded({ extended: false })); // middleware

// route to get all the users
app.get("/api/users", (req, res) => {
  return res.json(users);
}); // this is a static route

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  }) // route to get user with a given id
  .patch((req, res) => {
    const id = Number(req.params.id);
    let index = users.findIndex((user) => user.id === id);
    users[index].first_name = "Changed";
    users[index].last_name = "Name";
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "User updated", userId: users[index].id });
    });
  }) // route to update a user
  .delete((req, res) => {
    const id = Number(req.params.id);
    let index = users.findIndex((user) => user.id === id);
    let removed = users.splice(index, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "User deleted", removed });
    });
  }); // route to delete a user
// we can add multiple requests to the same route with different request types.

// route to add a new user in db
app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

app.listen(5000, (e = console.log("server running")));
