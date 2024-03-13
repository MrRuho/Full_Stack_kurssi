import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs }) => {
  const [visible, setVisible] = useState(false)

  const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
  const loggedUser = JSON.parse(loggedUserJSON)

  const handleView = () => {
    console.log('handleView called!')
    setVisible(!visible)
  }

  const handleLike = async () => {
    console.log('handleLike called!')
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 }
      await blogService.updateLikes(blog.id, updatedBlog)

      const updatedBlogs = await blogService.getAll()
      console.log('handleLike set!')
      setBlogs(updatedBlogs)

    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (confirmDelete) {
      try {
        if (loggedUser.username === blog.user.username) {
          await blogService.deleteBlog(blog.id)
          const updatedBlogs = await blogService.getAll()
          setBlogs(updatedBlogs)
        } else {
          console.error('Only owner can delete blog')
        }
      } catch(error){
        console.error('Error delete blog:', error)
      }
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {!visible && (
        <div>
          {blog.title} {blog.author}
          <button onClick={handleView}>{visible ? 'hide' : 'view'}</button>
        </div>
      )}
      {visible && (
        <div>
          <p>{blog.title} {blog.author}<button onClick={handleView}>{visible ? 'hide' : 'view'}</button></p>
          <p>{blog.url}</p>
          <p>likes: {blog.likes}<button onClick={handleLike}>like</button></p>
          <p>{blog.user.username}</p>
          {loggedUser && loggedUser.username === blog.user.username && (
            <p>
              <button onClick={handleDelete}>remove</button>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
