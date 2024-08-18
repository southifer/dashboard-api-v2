const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Import cors

const app = express();
const port = 5000;

// Create MySQL connection
const db = mysql.createConnection({
  host: '93.113.180.31',
  user: 'root',
  password: 'sayasenang@123', // Update with your database password
  database: 'noir' // Update with your database name
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Could not connect to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Route to handle POST request
app.post('/api/users', (req, res) => {
    const user = req.body;
  
    // Check if record with same index exists
    const checkQuery = 'SELECT * FROM users WHERE `index` = ?';
    db.query(checkQuery, [user.index], (err, results) => {
      if (err) {
        console.error('Error checking existing data:', err);
        return res.status(500).json({ error: 'Error checking existing data' });
      }
  
      if (results.length > 0) {
        // Record exists, update it
        const updateQuery = `
          UPDATE users
          SET username = ?, level = ?, ping = ?, status = ?, rotation_status = ?, proxy = ?, world = ?, position = ?, gems = ?, obtained_gems = ?, playtime = ?, online_time = ?, age = ?
          WHERE \`index\` = ?
        `;
        const updateValues = [
          user.username, user.level, user.ping, user.status, user.rotation_status,
          user.proxy, user.world, user.position, user.gems, user.obtained_gems,
          user.playtime, user.online_time, user.age, user.index
        ];
        db.query(updateQuery, updateValues, (err, results) => {
          if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json({ error: 'Error updating data' });
          }
          res.status(200).json({ message: 'Data updated successfully' });
        });
      } else {
        // Record does not exist, insert new
        const insertQuery = `
          INSERT INTO users (\`index\`, username, level, ping, status, rotation_status, proxy, world, position, gems, obtained_gems, playtime, online_time, age)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [
          user.index, user.username, user.level, user.ping, user.status,
          user.rotation_status, user.proxy, user.world, user.position,
          user.gems, user.obtained_gems, user.playtime, user.online_time, user.age
        ];
        db.query(insertQuery, insertValues, (err, results) => {
          if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Error inserting data' });
          }
          res.status(200).json({ message: 'Data inserted successfully' });
        });
      }
    });
  });  

// Route to handle GET request
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
