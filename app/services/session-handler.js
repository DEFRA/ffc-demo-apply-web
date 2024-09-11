import { merge } from '@hapi/hoek'

class SessionHandler {
  get (request, key) {
    let object = request.yar.get(key)
    if (object == null) {
      object = {}
    }
    return object
  }

  set (request, key, value) {
    request.yar.set(key, value)
  }

  update (request, key, object) {
    const existing = this.get(request, key)
    merge(existing, object, { mergeArrays: false })
    this.set(request, key, existing)
  }

  clear (request, key) {
    request.yar.clear(key)
  }
}
export default SessionHandler
