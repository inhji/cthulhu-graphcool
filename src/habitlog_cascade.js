'use latest'

import { fromEvent } from 'graphcool-lib'

export default async event => {
  const graphcool = fromEvent(event)
  const api = graphcool.api('simple/v1')

  const habitLogIds = event.data.Habit.node.logs.map(l => l.id)
  const habitId = event.data.Habit.node.id

  const deleteHabitLogs = habitLogIds.map(id =>
    `${id}: deleteHabitLog(id: "${id}") { id }`
  ).join('\n')

  const deleteHabit = `${habitId}: deleteHabit(id: "${habitId}") { id }`

  const mutation = `mutation {
    ${deleteHabitLogs}
    ${deleteHabit}
  }`

  return api.request(mutation)
    .then(data => console.log(data))
    .catch(err => {
      console.log(err.response.errors)
      console.log(err.response.data)
      return { error: `unexpected error in habitlog_cascade: ${err}` }
    })
}
