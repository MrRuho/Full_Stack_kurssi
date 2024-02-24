const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
      }, 0)
}

const favoriteBlog = (blogs) => {
    
    const mostLikedBlog = blogs.reduce((mostLiked, blog)=> {
        return blog.likes > mostLiked.likes ? blog : mostLiked
    }, blogs[0])

    return {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes
    }

}

const mostBlogs = (blogs) => {

    const groupedByAuthor = _.groupBy(blogs, 'author')

    const mostBlogsAuthor = Object.keys(groupedByAuthor).reduce((most, author) => {
        if (groupedByAuthor[author].length > most.blogs) {
        return {
            author: author,
            blogs: groupedByAuthor[author].length
        }
        } else {
        return most
        }
    }, { author: '', blogs: 0 })

    return mostBlogsAuthor
}

const mostLikes = (blogs) => {

    const groupedByAuthor = _.groupBy(blogs, 'author')
    
    const likesByAuthor = Object.keys(groupedByAuthor).map(author => ({
        author: author,
        likes: _.sumBy(groupedByAuthor[author], 'likes'),
    }))

    const mostLikesAuthor = _.maxBy(likesByAuthor, 'likes')

    return mostLikesAuthor;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
