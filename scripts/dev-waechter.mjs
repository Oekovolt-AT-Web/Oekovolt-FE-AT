// Dev-Server-Wächter: startet `next dev` auf Port 3001 und startet ihn NUR neu,
// wenn der Prozess beendet wurde (Absturz). Hänger werden nicht angefasst.
// Start: node scripts/dev-waechter.mjs   (WAECHTER_TURBO=1 schaltet Turbopack ein –
// unter Windows Smart App Control wird next-swc blockiert, daher Standard ohne Turbopack)
import { spawn } from 'node:child_process'
import { appendFileSync, writeFileSync } from 'node:fs'

const PORT = process.env.WAECHTER_PORT || '3001'
const LOG = '.dev-waechter.log'
const SERVER_LOG = '.dev-server.log'
let neustarts = 0
const log = (t) => appendFileSync(LOG, `${new Date().toISOString()} ${t}\n`)
writeFileSync('.dev-waechter.pid', String(process.pid))

function starten() {
  const args = ['next', 'dev', '-p', PORT, '-H', '127.0.0.1']
  if (process.env.WAECHTER_TURBO === '1') args.splice(2, 0, '--turbopack')
  const kind = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, {
    cwd: process.cwd(), shell: process.platform === 'win32', env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  kind.stdout.on('data', (d) => appendFileSync(SERVER_LOG, d))
  kind.stderr.on('data', (d) => appendFileSync(SERVER_LOG, d))
  log(`Neustart #${neustarts}: next dev auf Port ${PORT} gestartet (PID ${kind.pid})`)
  kind.on('exit', (code) => {
    log(`Dev-Server beendet (Code ${code}) – Neustart in 5 s`)
    neustarts++
    setTimeout(starten, 5000)
  })
}
starten()
