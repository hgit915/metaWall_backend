
module.exports = async (io) => {
    io.on('connection', (socket) => {
        console.log('來人囉')
        socket.on('chat message', (msg) => {
            socket.broadcast.emit('chat message', msg)
        });
        socket.on('imgSend', (msg) => {
            socket.broadcast.emit('imgSend', msg)
        });
    });
}