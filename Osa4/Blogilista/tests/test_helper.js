const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const testBlogs = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    }
]

const testUser = async () => {
  const testUser =  {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword',
  }

  await api
      .post('/api/users')
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

  return testUser
}

const rightToken = async () => {

  const newUser = await testUser()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  return loginResponse.body.token
}

const nonExistingId = async () => {
    const blog = new Blog({ 
        title: 'Test title',
        author: 'Test author',
        url: 'Test url', 
        likes: 1,
    })
    await blog.save()
    await blog.deleteOne()
  
    return blog.id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  testBlogs,
  testUser,
  rightToken, 
  nonExistingId, 
  blogsInDb,
  usersInDb,
}