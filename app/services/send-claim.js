import SessionHandler from './session-handler'
import { publishClaim } from '../messaging/publish-claim'

const submit = async (request) => {
  try {
    const claim = new SessionHandler().get(request, 'claim')
    console.log(`Submitting claim ${claim.claimId}`)
    await publishClaim(claim)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

export default submit
