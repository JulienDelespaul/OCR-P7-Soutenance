## ROUTES DOCUMENTATION

## USER ROUTES

- Signup, POST, /api/auth/signup, {email: string, password: string}
- Login, POST, /api/auth/login, {email: string, password: string}

## POST ROUTES

- Create a post, POST, /api/post, {name: string, title: string, content: string, imageUrl: string}
- Get all posts, GET, /api/post
- Get one post, GET, /api/post/:id
- Edit a post, PUT, /api/post/:id, {content: string, imageUrl: string}
- Delete a post, DELETE, /api/post/:id
- Like a post, POST, /api/post/:id/like
