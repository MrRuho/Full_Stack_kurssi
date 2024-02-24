const { request, response } = require('../shared')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blogId = request.params.id

  try {
    const blog = await Blog.findById(blogId)

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    response.json(blog)
  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body

  const rightUser = request.user;

  if (!rightUser) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!title || !url) {
    return response.status(400).send({ error: 'Title and URL must be provided' })
  }
  const likesValue = likes !== undefined && !isNaN(likes) ? likes : 0

  const blog = new Blog({
    title,
    author,
    url,
    likes: likesValue,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const rightUser = request.user;

  if (!rightUser) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blogId = request.params.id
  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  await Blog.findByIdAndUpdate(request.params.id, blog)
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter
