import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setTitle] = useState('')
  const [blogAuthor, setAuthor] = useState('')
  const [blogUrl, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog ({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <p></p>
      <form onSubmit={addBlog}>
        <div>
                title:
          <input
            type="text"
            value={blogTitle}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
                author:
          <input
            type="text"
            value={blogAuthor}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
                url:
          <input
            type="text"
            value={blogUrl}
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
