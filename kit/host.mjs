import { spawn } from 'node:child_process'
import { createWriteStream } from 'node:fs'
import { writeFile, mkdir, readFile } from 'node:fs/promises'

const root = process.cwd() + '/'
const config = JSON.parse(await readFile(root + 'config.local.json', 'utf8'))
await mkdir(root + 'evidence', { recursive: true })
const tag = 'host'
const stdout = createWriteStream(root + 'evidence/' + tag + '-process.stdout.txt', { flags: 'wx' })
const stderr = createWriteStream(root + 'evidence/' + tag + '-process.stderr.txt', { flags: 'wx' })
const child = spawn(process.execPath, [config.dsh_bin, '--profile', config.profile, '--host', '127.0.0.1', '--port', String(config.host_port || 0), '--no-open'], {
  cwd: root,
  env: { ...process.env, DSH_HOME: config.dsh_home },
  windowsHide: true,
})
let text = '', reported = false, stopping = false
child.stdout.on('data', async chunk => {
  stdout.write(chunk)
  text += chunk.toString()
  const m = text.match(/http:\/\/127\.0\.0\.1:\d+\/\?token=[A-Za-z0-9._~-]+/)
  if (m && !reported) {
    reported = true
    // 带令牌地址只写本机文件，不打印
    await writeFile(root + 'evidence/' + tag + '-host-local.json', JSON.stringify({ pid: child.pid, url: m[0] }, null, 2), { flag: 'wx' })
    console.log('READY ' + new URL(m[0]).origin)
  }
})
child.stderr.on('data', c => stderr.write(c))
const startup = setTimeout(() => { if (!reported) { console.error('HOST_START_TIMEOUT'); child.kill(); process.exitCode = 1 } }, 90000)
child.on('close', code => { clearTimeout(startup); stdout.end(); stderr.end(); console.log('HOST_EXIT ' + code); process.exitCode = stopping ? 0 : (code || 0) })
process.on('SIGTERM', () => { stopping = true; child.kill() })
process.on('SIGINT', () => { stopping = true; child.kill() })
