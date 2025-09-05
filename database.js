const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, 'blog.db');
    this.init();
  }

  init() {
    // Check if database file exists, create if not
    if (!fs.existsSync(this.dbPath)) {
      console.log('Creating new database file...');
      fs.writeFileSync(this.dbPath, '');
    }

    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
      } else {
        console.log('Connected to SQLite database.');
        this.createTables();
      }
    });
  }

  createTables() {
    const createPostsTable = `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createPostsTable, (err) => {
      if (err) {
        console.error('Error creating posts table:', err.message);
      } else {
        console.log('Posts table ready.');
        
        // Insert sample data if table is empty
        this.insertSampleData();
      }
    });

    this.db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table ready.');
      }
    });
  }

  insertSampleData() {
    // Check if posts table is empty
    this.db.get("SELECT COUNT(*) as count FROM posts", (err, row) => {
      if (err) {
        console.error('Error checking posts count:', err.message);
        return;
      }

      if (row.count === 0) {
        console.log('Inserting sample data...');
        
        const samplePosts = [
          {
            title: 'Welcome to My Blog',
            content: 'This is my first blog post. Welcome everyone!',
            author: 'Admin'
          },
          {
            title: 'Getting Started with Node.js',
            content: 'Node.js is a powerful JavaScript runtime...',
            author: 'Developer'
          },
          {
            title: 'REST API Best Practices',
            content: 'Here are some best practices for building RESTful APIs...',
            author: 'API Expert'
          }
        ];

        const insertSql = `INSERT INTO posts (title, content, author) VALUES (?, ?, ?)`;
        
        samplePosts.forEach(post => {
          this.db.run(insertSql, [post.title, post.content, post.author], (err) => {
            if (err) {
              console.error('Error inserting sample data:', err.message);
            }
          });
        });

        console.log('Sample data inserted successfully.');
      }
    });
  }

  // Helper method for promises
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

// Create singleton instance
const database = new Database();
module.exports = database;