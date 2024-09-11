const generateId = () => {
  const timestamp = new Date().getUTCMilliseconds()
  return `MINE${timestamp}`
}
export default generateId
