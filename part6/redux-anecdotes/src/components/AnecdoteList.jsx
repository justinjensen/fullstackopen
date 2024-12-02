import { useDispatch, useSelector } from 'react-redux'
import { voteOnAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector((state) => {
    if (state.filter === '') return state.anecdotes
    return state.anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    )
  })

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  const vote = (id) => {
    const anecdote = anecdotes.find((a) => a.id === id)
    dispatch(voteOnAnecdote(id))
    dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
