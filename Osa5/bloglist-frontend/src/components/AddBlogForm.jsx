const createNewBlog = ({
handleSubmit,
handleTittleChange,
handleAuthorChange,
handleUrlChange,
title,
author,
url,
handleCancel

}) =>{
    return (
    <div>
      <h2>Create new</h2>
      <p></p>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type="text"
            value={title}
            onChange={handleTittleChange} 
            />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            onChange={handleAuthorChange}
            />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            onChange={handleUrlChange} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleCancel}>cancel</button>
      </form>
    </div>
  )
}

export default createNewBlog