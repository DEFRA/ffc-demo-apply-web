function createMessage (claim) {
  return {
    body: claim,
    type: 'uk.gov.demo.claim.submitted',
    source: 'ffc-demo-apply-web'
  }
}

module.exports = createMessage
