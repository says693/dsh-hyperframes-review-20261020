import { readFile, writeFile } from 'node:fs/promises'
const root = process.cwd() + '/'
const { url } = JSON.parse(await readFile(root + 'evidence/host-host-local.json', 'utf8'))
const origin = new URL(url).origin
const token = new URL(url).searchParams.get('token')

// 用带 token 的 URL 换 cookie（与浏览器同路径）
const boot = await fetch(url, { redirect: 'manual' })
const cookie = (boot.headers.get('set-cookie') || '').split(';')[0]
const results = []
const post = async (name, headers, body) => {
  const res = await fetch(origin + '/api/dsh-hyperframes/workbench', {
    method: 'POST',
    headers: { cookie, ...headers },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  results.push({ name, status: res.status, body: text.slice(0, 200) })
}

// 正向：合法 list
await post('list_ok', { 'content-type': 'application/json', 'x-dsh-media': '1' }, { action: 'list' })
// 负向判据
await post('no_header', { 'content-type': 'application/json' }, { action: 'list' })
await post('cross_site', { 'content-type': 'application/json', 'x-dsh-media': '1', 'sec-fetch-site': 'cross-site' }, { action: 'list' })
await post('bad_origin', { 'content-type': 'application/json', 'x-dsh-media': '1', origin: 'http://evil.test' }, { action: 'list' })
await post('bad_action', { 'content-type': 'application/json', 'x-dsh-media': '1' }, { action: '__proto__' })
await post('traversal_id', { 'content-type': 'application/json', 'x-dsh-media': '1' }, { action: 'update', id: '../../escape', revision: 1, fields: {} })

await writeFile(root + 'evidence/probes.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify(results.map(r => ({ name: r.name, status: r.status }))))
