import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname } from 'node:path'

const root = resolve('.')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    const filename = resolve(root, '.' + (pathname === '/' ? '/tests/fixture.html' : pathname.startsWith('/storybook/') ? '/storybook-static/' + pathname.slice(10) : pathname))
    if (!filename.startsWith(root + '/')) { response.writeHead(403).end(); return }
    const body = await readFile(filename)
    response.writeHead(200, { 'Content-Type': types[extname(filename)] || 'application/octet-stream' }).end(body)
  } catch { response.writeHead(404).end('Not found') }
}).listen(4174, '127.0.0.1')
