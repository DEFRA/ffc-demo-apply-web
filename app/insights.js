import { useAzureMonitor } from '@azure/monitor-opentelemetry'

const setup = () => {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

  if (connectionString) {
    useAzureMonitor({
      azureMonitorExporterOptions: {
        connectionString
      },
      instrumentationOptions: {
        http: {
          enabled: true,
          ignoreIncomingRequestHook: (request) => {
            const url = request.url ?? ''
            return url.includes('healthz') || url.includes('healthy')
          }
        }
      }
    })

    console.log('Azure Monitor (OpenTelemetry) Running')
  } else {
    console.log('Azure Monitor Not Running!')
  }

  // if (process.env.APPINSIGHTS_CONNECTIONSTRING) {
  //   appInsights.setup(process.env.APPINSIGHTS_CONNECTIONSTRING).start()
  //   console.log('App Insights running')
  //   const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
  //   const appName = process.env.APPINSIGHTS_CLOUDROLE
  //   appInsights.defaultClient.context.tags[cloudRoleTag] = appName
  //   appInsights.defaultClient.addTelemetryProcessor((envelope, context) => {
  //     const data = envelope.data.baseData
  //     if (data.url && data.url.includes('healthz')) {
  //       return false
  //     }
  //     return true
  //   })
  // } else {
  //   console.log('App Insights not running')
  // }
}

export { setup }
