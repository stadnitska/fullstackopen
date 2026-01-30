const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author',
    url: 'http://example.com',
    likes: 5,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
}
