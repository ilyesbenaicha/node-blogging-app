const readline = require('readline');
const db = require('./database');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Blog Database CLI');
console.log('Commands: list, count, exit');

function prompt() {
  rl.question('> ', async (input) => {
    const [command, ...args] = input.split(' ');
    
    switch(command.toLowerCase()) {
      case 'list':
        try {
          const posts = await db.all('SELECT * FROM posts');
          console.log('\nPosts:');
          posts.forEach(post => {
            console.log(`[${post.id}] ${post.title} by ${post.author}`);
          });
        } catch (error) {
          console.error('Error:', error.message);
        }
        break;
        
      case 'count':
        try {
          const result = await db.get('SELECT COUNT(*) as count FROM posts');
          console.log(`\nTotal posts: ${result.count}`);
        } catch (error) {
          console.error('Error:', error.message);
        }
        break;
        
      case 'exit':
        console.log('Goodbye!');
        rl.close();
        process.exit(0);
        break;
        
      default:
        console.log('Unknown command. Available: list, count, exit');
    }
    
    prompt();
  });
}

prompt();