let baseURL = 'http://11.11.74.38:8777/redtripapi'
if (process.env.NODE_ENV === 'development') {
  baseURL = '/redtripapi'
}
const websocketUrl = 'ws://11.11.74.38:8777/redtripapi/websocket/'

export {
  baseURL,
  websocketUrl
}
