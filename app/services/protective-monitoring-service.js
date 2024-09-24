import { PublishEvent } from 'ffc-protective-monitoring'
import config from '../config/index.js'
class ProtectiveMonitoring {
  constructor () {
    this.publishEvent = new PublishEvent(config.protectiveMonitoringUrl)
  }

  async sendEvent (request, claim, event) {
    // const publishEvent = new PublishEvent(config.protectiveMonitoringUrl)
    await this.publishEvent.sendEvent({
      sessionid: claim.claimId,
      datetime: this.createEventDate(),
      version: '1.1',
      application: 'ffc-demo-apply-web',
      component: 'ffc-demo-apply-web',
      ip: this.getIpAddress(request),
      pmccode: '001',
      priority: '0',
      details: {
        message: event
      }
    })
    console.log(`Protective monitoring event sent: ${event}`)
  }

  getIpAddress (request) {
    // Identifying the originating IP address of a client connecting to a web server through an HTTP proxy or a load balancer
    const xForwardedForHeader = request.headers['x-forwarded-for']
    return xForwardedForHeader ? xForwardedForHeader.split(',')[0] : request.info.remoteAddress
  }

  createEventDate () {
    const eventDate = new Date()
    return eventDate.toISOString()
  }
}
export default ProtectiveMonitoring
