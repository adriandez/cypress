export const withLogging = (action, actionName) => {
  return (...args) => {
    cy.customLog(`Starting execution: ${actionName}`, { type: 'start' })
    return action(...args).then((returnValue) => {
      cy.customLog(`Completed execution: ${actionName}`, { type: 'end' })
      return returnValue
    })
  }
}
