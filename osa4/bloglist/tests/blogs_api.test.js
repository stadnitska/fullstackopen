const { test, describe, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')
const config = require('../utils/config')

before(async () => {
  await mongoose.connect(config.MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('GET /api/blogs', () => {
  test('returns blogs as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blogs have id field', async () => {
    const res = await api.get('/api/blogs')
    assert.ok(res.body[0].id)
  })
})

describe('POST /api/blogs', () => {
  test('adds a valid blog', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'Me',
      url: 'http://test.com',
      likes: 10,
    }

    await api.post('/api/blogs').send(newBlog).expect(201)

    const blogs = await helper.blogsInDb()
    assert.strictEqual(blogs.length, helper.initialBlogs.length + 1)
  })

  test('likes defaults to 0', async () => {
    const res = await api.post('/api/blogs').send({
      title: 'No likes',
      author: 'Me',
      url: 'http://nolikes.com',
    })

    assert.strictEqual(res.body.likes, 0)
  })

  test('missing title or url returns 400', async () => {
    await api.post('/api/blogs').send({ author: 'Me' }).expect(400)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('deletes a blog', async () => {
    const blogs = await helper.blogsInDb()
    await api.delete(`/api/blogs/${blogs[0].id}`).expect(204)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('updates likes', async () => {
    const blogs = await helper.blogsInDb()
    const res = await api
      .put(`/api/blogs/${blogs[0].id}`)
      .send({ likes: 99 })

    assert.strictEqual(res.body.likes, 99)
  })
})

after(async () => {
  await mongoose.connection.close()
})
