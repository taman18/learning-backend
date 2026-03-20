// const http = require("http");
// const fs = require("fs");

// const myServer = http.createServer((req, res) => {
//   if (req.url === "/favicon.ico") {
//     res.end();
//     return;
//   }
//   fs.appendFile(
//     "./files/logs.txt",
//     `Request received at ${new Date()} with path ${req.url}\n`,
//     (err) => {
//       if (err) {
//         console.log(err);
//       }
//       switch (req.url) {
//         case "/":
//           res.end("Home Page");
//           break;
//         case "/about-us":
//           res.end("About Us Page");
//           break;
//         case "/contact-us":
//           res.end("Contact Us Page");
//           break;
//         case "/get-all-logs":
//           fs.readFile("./files/logs.txt", "utf-8", (err, data) => {
//             if (err) {
//               console.log(err);
//               res.end("Error reading logs");
//             } else {
//               res.end(data);
//             }
//           });
//           break;
//         default:
//           res.end("Page Not Found");
//       }
//     },
//   );
// });

// myServer.listen(8000, () => {
//   console.log("Server is running on port 8000");
// });

const express = require('express');
const app = express();
const fs = require('fs');
const router = express.Router();
require('dotenv').config()

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded())

// routing define tyes
// 1. app.method
app.get('/', (req, res) => {
  res.end('Home route');
})

// 2. router.method()
router.get('/about-us', (req, res) => {
  res.end('About Us route');
})
app.use('/', router);

app.get('/all-users', async (req, res) => {
  const data = await readFileAsync('./files/users.txt');
  res.end(data);
})

app.get('/all-users', async (req, res) => {
  const data = await readFileAsync('./files/users.txt');
  res.end(data);
})

app.post('/create-user', async (req, res) => {
  try {
    const data = req.body;

    if (!data?.name || !data?.email || !data?.password) {
      return res.status(400).send('Name, email and password are required');
    }

    const userObj = {
      _id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password
    };

    const filePath = './files/users.txt';

    let users = [];

    const fileData = await readFileAsync(filePath);

    if (fileData) {
      users = JSON.parse(fileData);
    }
    // check email exist in the file or not
    if (users.find((item) => item.email === data.email)) {
      return res.status(400).send('User with this email already exist in the DB')
    }
    users.push(userObj);

    await writeFileAsync(filePath, JSON.stringify(users, null, 2));

    return res.status(201).json({
      message: 'User created successfully',
      data: userObj
    });

  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong',
      error: err.message
    });
  }
});

app.delete('/delete-user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const filePath = './files/users.txt';

    const usersData = await readFileAsync(filePath);

    if (!usersData) {
      return res.status(404).send('No users found');
    }

    const users = JSON.parse(usersData);

    const userExists = users.some((item) => item._id === userId);

    if (!userExists) {
      return res.status(404).send('User Id does not exist in DB');
    }

    const filteredUsers = users.filter((item) => item._id !== userId);

    await writeFileAsync(filePath, JSON.stringify(filteredUsers, null, 2));

    return res.status(200).send('User deleted successfully');

  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong',
      error: err.message
    });
  }
});

app.put('/update-users-info/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { name, email, password } = req.body;
    const filePath = './files/users.txt';

    const fileDataRaw = await readFileAsync(filePath);

    if (!fileDataRaw) {
      return res.status(404).send('No users found');
    }

    const users = JSON.parse(fileDataRaw);

    const index = users.findIndex((item) => item._id === userId);

    if (index === -1) {
      return res.status(404).send('UserId does not exist');
    }

    const updatedUser = {
      ...users[index],
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password }),
    };

    users[index] = updatedUser;

    await writeFileAsync(filePath, JSON.stringify(users, null, 2));

    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });

  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong',
      error: err.message
    });
  }
});

const readFileAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFileAsync = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};



app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
})