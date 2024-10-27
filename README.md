# Social Media Platform API

This project is a robust and feature-rich API designed to power a modern social media platform. It supports a variety of essential functionalities to enable user engagement and content sharing, including profile creation, posting, user interactions, and much more.

## Features

- **User Profiles**: Create and manage user profiles with customizable information.
- **Posts**: Share messages and content with followers.
- **Following**: Follow other users to stay updated on their posts and activities.
- **Likes and Comments**: Engage with posts by liking and commenting, building a social network.
- **User Interaction**: Interact with others through likes, comments, and follows.

## Getting Started

### Prerequisites

- **Node.js** (>= v14.x.x)
- **npm** or **yarn**
- **MongoDB** for data storage

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/techlateef/social-media-api.git
   cd social-media-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory and define the required environment variables, such as `DATABASE_URL`, `JWT_SECRET`, etc.

4. Start the server:

   ```bash
   yarn run buirl
   yarn run start
   ```

   The API should now be running on `http://localhost:3000`.

## API Endpoints

Here's an overview of the main API endpoints:

- **User Profile**
  - `POST /api/users` - Register a new user.
  - `GET /api/users/:id` - Retrieve user profile details.
  - `PUT /api/users/:id` - Update user profile information.

- **Posts**
  - `POST /api/posts` - Create a new post.
  - `GET /api/posts/:id` - Retrieve post details.
  - `DELETE /api/posts/:id` - Delete a post.

- **Social Interactions**
  - `POST /api/follow/:id` - Follow a user.
  - `POST /api/like/:id` - Like a post.
  - `POST /api/comment/:id` - Comment on a post.

## Built With

- **Node.js** - JavaScript runtime
- **Typescript** - 
- **Express** - Web framework for Node.js
- **MongoDB** - Database for storing user, post, and interaction data

## Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests.

