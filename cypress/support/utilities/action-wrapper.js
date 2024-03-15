export const wrapPageActions = (actions, pageName) => {
  const wrappedActions = {}

  Object.keys(actions).forEach((actionKey) => {
    const originalAction = actions[actionKey]

    wrappedActions[actionKey] = (...args) => {
      const actionDescription = `${pageName}.${actionKey}`
      cy.customLog(`Starting action: ${actionDescription}`, { type: 'start' })

      return cy
        .then(() => {
          return new Promise((resolve, reject) => {
            try {
              cy.customLog(`Attempting action: ${actionDescription}`, {
                type: 'attempting', enabled: true
              })
              Promise.resolve(originalAction(...args))
                .then((actionResult) => {
                  resolve(actionResult)
                })
                .catch((error) => {
                  cy.customLog(`Error in action: ${actionDescription}`, {
                    type: 'error'
                  })
                  reject(error)
                })
            } catch (error) {
              cy.customLog(
                `Error in action: ${actionDescription} - ${error.message}`,
                { type: 'error' }
              )
              throw error
            }
          })
        })
        .then((finalResult) => {
          cy.customLog(`Completed action: ${actionDescription}`, {
            type: 'end'
          })
          return finalResult
        })
    }
  })

  return wrappedActions
}
