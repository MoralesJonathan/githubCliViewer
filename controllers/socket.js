module.exports.connect = function (socket_io) {
    console.log("A user has connected")
    socket_io.on('joinRoom', function (room) {
        socket_io.join(room);
    });
    socket_io.on('leaveRoom', function (room) {
        socket_io.leave(room);
    });
}