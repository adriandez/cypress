export const wrapPageActions = (actions, pageName) => {
  const wrappedActions = {}

  Object.keys(actions).forEach((actionKey) => {
    const originalAction = actions[actionKey]

    wrappedActions[actionKey] = (...args) => {
      const actionDescription = `${pageName}.${actionKey}`
      cy.customLog(`Starting action: ${actionDescription}`, { type: 'start' })

      return cy
        .then(() => {
          console.log(`Attempting action: ${actionDescription}`)
          try {
            const result = originalAction(...args)
            console.log(`Successfully executed action: ${actionDescription}`)
            return result
          } catch (error) {
            console.error(`Error caught in action: ${actionDescription}`, error)
            cy.customLog(
              `Error in action: ${actionDescription} - ${error.message}`,
              { type: 'error' }
            )
            throw error
          }
        })
        .then((result) => {
          cy.customLog(`Completed action: ${actionDescription}`, {
            type: 'end'
          })
          return result
        })
    }
  })

  return wrappedActions
}
