const { Client } = require('@notionhq/client');
require('dotenv').config(); // Add this line to load environment variables from a .env file

// Initialize the Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getUsers() {
    const response = await notion.users.list();
    console.log(response);
}

getUsers();