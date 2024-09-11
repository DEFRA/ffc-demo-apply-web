import config from '../config/index.js'

export function getCurrentPolicy (request, h) {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}

function createDefaultPolicy (h) {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, config.cookieOptions)
  return cookiesPolicy
}

export function updatePolicy (request, h, analytics) {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state('cookies_policy', cookiesPolicy, config.cookieOptions)
}

// export default  {
//   getCurrentPolicy,
//   updatePolicy
// }

export default { getCurrentPolicy, updatePolicy }
