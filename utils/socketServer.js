module.exports = async (io) => {
  io.on('connection', (socket) => {
    console.log('Player connected!', socket.id)
  })
}
