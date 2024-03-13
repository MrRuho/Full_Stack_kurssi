import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const testBlog = {
  title: 'Test title',
  author: 'Test author',
  url: 'http://example.com',
  likes: 0,
  user: { username: 'testuser',
          name: 'Test User' }
}

test('renders content', () => {

  render(<Blog blog={testBlog} />)

  const titleElement = screen.getByText(/Test title/i)
  const authorElement = screen.getByText(/Test author/i)
  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()

})

test('User see extra info, by clicking view button', async () => {

  const mockHandler = vi.fn()

  render(
    <Blog blog={testBlog} handleView={mockHandler} loggedUser={{ username: 'testuser' }} />
  )
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element1 = screen.getByText('http://example.com')
  expect(element1).toBeDefined()

  const element2 = screen.getByText('likes: 0')
  expect(element2).toBeDefined()

  const element3 = screen.getByText('testuser')
  expect(element3).toBeDefined()
})

test('User press like button', async () => {

  const mockHandleLike = vi.fn(() => Promise.resolve({ ...testBlog, likes: testBlog.likes + 1 }))
  const mockHandleView =  vi.fn()

  render(
    <Blog blog={testBlog}  handleView={mockHandleView} handleLike={mockHandleLike} loggedUser={{ username: 'testuser' }} />
  )
  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)

  expect(mockHandleLike).toHaveBeenCalledTimes(1)
  expect(mockHandleView).toHaveBeenCalledTimes(1)

})

test('User press view button', async () => {

  const mockHandler =  vi.fn()

  render(
    <Blog blog={testBlog} handleView={mockHandler} loggedUser={{ username: 'testuser' }} />
  )
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
