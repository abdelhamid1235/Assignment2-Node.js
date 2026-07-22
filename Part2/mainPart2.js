const http = require("http");
const fs = require("fs");
const url = require("url");
const USERS_FILE = "./users.json";

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}
async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      if (!body) {
        return resolve({});
      }

      try {
        const parsedBody = JSON.parse(body);
        resolve(parsedBody);
      } catch (err) {
        reject(new Error("INVALID_JSON"));
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}
function generateId(users) {
  if (users.length === 0) {
    return 1;
  }
  const maxId = Math.max(...users.map((u) => u.id));
  return maxId + 1;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const method = req.method;

  try {
    if (method === "GET" && segments[0] === "user") {
      const users = await readUsers();
      if (segments.length === 1) {
        return sendResponse(res, 200, users);
      }
      if (segments.length === 2) {
        const id = Number(segments[1]);
        const user = users.find((u) => u.id === id);

        if (!user) {
          return sendResponse(res, 404, { message: "User not found." });
        }

        return sendResponse(res, 200, user);
      }
    }

    
    if (method === "POST" && segments[0] === "user" && segments.length === 1) {
      let body;
      try {
        body = await getRequestBody(req);
      } catch (err) {
        return sendResponse(res, 400, { message: "Invalid JSON body." });
      }

      const { name, age, email } = body;
      if (!name || age === undefined || !email) {
        return sendResponse(res, 400, {
          message: "name, age, and email are required.",
        });
      }
      const users = await readUsers();
      const emailExists = users.some((u) => u.email === email);
      if (emailExists) {
        return sendResponse(res, 409, { message: "Email already exists." });
      }
      const newUser = {
        id: generateId(users),
        name,
        age,
        email,
      };

      users.push(newUser);
      await writeUsers(users);

      return sendResponse(res, 201, { message: "User added successfully." });
    }

    
    if (method === "PATCH" && segments[0] === "user" && segments.length === 2) {
      const id = Number(segments[1]);

      let body;
      try {
        body = await getRequestBody(req);
      } catch (err) {
        return sendResponse(res, 400, { message: "Invalid JSON body." });
      }

      const users = await readUsers();
      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        return sendResponse(res, 404, { message: "User ID not found." });
      }

      const { name, age, email } = body;
      if (email) {
        const emailTaken = users.some(
          (u) => u.email === email && u.id !== id
        );
        if (emailTaken) {
          return sendResponse(res, 409, { message: "Email already exists." });
        }
      }
      if (name !== undefined) users[userIndex].name = name;
      if (age !== undefined) users[userIndex].age = age;
      if (email !== undefined) users[userIndex].email = email;

      await writeUsers(users);

      return sendResponse(res, 200, {
        message: "User updated successfully.",
      });
    }

    if (method === "DELETE" && segments[0] === "user" && segments.length === 2) {
      const id = Number(segments[1]);

      const users = await readUsers();
      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        return sendResponse(res, 404, { message: "User ID not found." });
      }
      users.splice(userIndex, 1);
      await writeUsers(users);

      return sendResponse(res, 200, {
        message: "User deleted successfully.",
      });
    }
    return sendResponse(res, 404, { message: "Route not found." });
  } catch (err) {
  
    console.error("Server error:", err);
    return sendResponse(res, 500, { message: "Internal server error." });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
