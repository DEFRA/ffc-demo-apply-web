const route = {
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return h.view('home', { path: '/' })
  }
}

export default route
