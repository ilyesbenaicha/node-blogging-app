const db = require('../database');

class Post {
  // Create a new post
  static async create(postData) {
    const { title, content, author } = postData;
    const sql = `INSERT INTO posts (title, content, author) VALUES (?, ?, ?)`;
    
    try {
      const result = await db.run(sql, [title, content, author]);
      return { id: result.id, ...postData };
    } catch (error) {
      throw error;
    }
  }

  // Get all posts with optional search filter
  static async getAll(searchTerm = '') {
    let sql = `SELECT * FROM posts`;
    let params = [];
    
    if (searchTerm) {
      sql += ` WHERE title LIKE ? OR content LIKE ? OR author LIKE ?`;
      params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
    }
    
    sql += ` ORDER BY created_at DESC`;
    
    try {
      const posts = await db.all(sql, params);
      return posts;
    } catch (error) {
      throw error;
    }
  }

  // Get single post by ID
  static async getById(id) {
    const sql = `SELECT * FROM posts WHERE id = ?`;
    
    try {
      const post = await db.get(sql, [id]);
      return post;
    } catch (error) {
      throw error;
    }
  }

  // Update post
  static async update(id, postData) {
    const { title, content, author } = postData;
    const sql = `UPDATE posts SET title = ?, content = ?, author = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    try {
      const result = await db.run(sql, [title, content, author, id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Delete post
  static async delete(id) {
    const sql = `DELETE FROM posts WHERE id = ?`;
    
    try {
      const result = await db.run(sql, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get posts by author
  static async getByAuthor(author) {
    const sql = `SELECT * FROM posts WHERE author = ? ORDER BY created_at DESC`;
    
    try {
      const posts = await db.all(sql, [author]);
      return posts;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Post;