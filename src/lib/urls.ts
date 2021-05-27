export function ioServer() {
  return window.location.href.includes(':3000') ? 'localhost:8000' : undefined
}
export function gameServer() {
  return window.location.href.includes(':3000')
    ? 'http://localhost:8000'
    : undefined
}
