// pear = peer to peer

import Hyperswarm from 'hyperswarm'
import b4a from 'b4a'
import crypto from 'hypercore-crypto'
import readline from 'bare-readline'
import tty from 'bare-tty'

const { teardown, config } = Pear
const key = config.args.pop()
const shouldCreateSwarm = !key
const swarm = new Hyperswarm()
const rl = readline.createInterface({
  input: new tty.ReadStream(0),
  output: new tty.WriteStream(1)
})

swarm.on('connection', peer => {
  const name = b4a.toString(peer.remotePublicKey, 'hex').substr(0, 6)
  console.log(`[info] New peer joined, ${name}`)
  peer.on('data', message => appendMessage({ name, message }))
  peer.on('error', e => console.log(`Connection error: ${e}`))
})
swarm.on('update', () => {
  console.log(`[info] Number of connections is now ${swarm.connections.size}`)
})

if (shouldCreateSwarm) {
  await createChatRoom()
} else {
  await joinChatRoom(key)
}

rl.input.setMode(tty.constants.MODE_RAW)
rl.on('data', line => {
  sendMessage(line)
  rl.prompt()
})
rl.prompt()

async function createChatRoom () {
  const topicBuffer = crypto.randomBytes(32)
  await joinSwarm(topicBuffer)
  const topic = b4a.toString(topicBuffer, 'hex')
  console.log(`[info] Created new chat room: ${topic}`)
}

async function joinChatRoom (topicStr) {
  const topicBuffer = b4a.from(topicStr, 'hex')
  await joinSwarm(topicBuffer)
  console.log(`[info] Joined chat room`)
}

async function joinSwarm (topicBuffer) {
  const discovery = swarm.join(topicBuffer, { client: true, server: true })
  await discovery.flushed()
}

function sendMessage (message) {
  const peers = [...swarm.connections]
  for (const peer of peers) peer.write(message)
}

function appendMessage ({ name, message }) {
  console.log(`[${name}] ${message}`)
}