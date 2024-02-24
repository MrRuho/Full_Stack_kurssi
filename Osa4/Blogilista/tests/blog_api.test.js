const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
// const { get } = require('lodash')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.testBlogs)
    await User.deleteMany({})
})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are tree blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, 3)
})

test('each blog has an id field', async () => {
  const response = await api
    .get('/api/blogs')

  const blogs = response.body

  blogs.forEach(blog => {
    assert.ok(blog.id, 'Each blog should have an "id" field')
 })
})

test('create new user and login', async ()=>{
  const newUser =  {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const loginResponse = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const userResponse = await api.get('/api/users');
  const user = userResponse.body.find((u) => u.username === newUser.username);
  assert.strictEqual(user.blogs.length, 0)

})

test('add new blog', async ()=>{

  const token = await helper.rightToken()

  const newBlog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.testBlogs.length + 1)
  
  const title = response.body.map((r) => r.title)
  assert(title.includes('Test title'))
  
  const author = response.body.map((r) => r.author)
  assert(author.includes('Test author'))
  
  const url = response.body.map((r) => r.url)
  assert(url.includes('Test url'))
})

test('null likes value is 0', async ()=> {

  const token = await helper.rightToken()

  const newBlog = {
    title: 'Test title',
    author: 'Test author',
    url: 'Test url', 
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  const addedBlog = response.body.find(blog => blog.title === newBlog.title)
  assert.strictEqual(addedBlog.likes, 0)
})

test('No title: 400 bad request', async ()=>{

  const token = await helper.rightToken()

  const newBlog = {
    author: 'Test author',
    ulr: 'Test url',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.testBlogs.length)
})

test('No url: 400 bad request', async ()=>{

  const token = await helper.rightToken()

  const newBlog = {
    title: 'Test title',
    author: 'Test author',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
  
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.testBlogs.length)
})

test('delete blog', async () => {

  const token = await helper.rightToken()

  const blogs = await api.get('/api/blogs')
  const blogToDelete = blogs.body[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
  
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, blogs.body.length - 1)
})

test('update blog', async () => {

  const blogs = await api.get('/api/blogs')
  const blogToUpdate = blogs.body[0]

  const updatedBlog = {
    title: 'Updated Title',
    author: 'Updated Author',
    url: 'Updated URL',
    likes: 100,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const updatedBlogs = await api.get('/api/blogs')
  const updatedBlogResponse = updatedBlogs.body.find(blog => blog.id === blogToUpdate.id)
  
  assert.strictEqual(updatedBlogResponse.title,updatedBlog.title)
  assert.strictEqual(updatedBlogResponse.author,updatedBlog.author)
  assert.strictEqual(updatedBlogResponse.url,updatedBlog.url)
  assert.strictEqual(updatedBlogResponse.likes,updatedBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})
