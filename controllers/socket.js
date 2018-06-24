const mainController  = require('./index.js')
module.exports.connect = function (socket_io) {
    console.log("A user has connected")
    socket_io.on('joinRoom', function (room) {
        socket_io.join(room);
    });
    socket_io.on('leaveRoom', function (room) {
        socket_io.leave(room);
    });
    socket_io.on('spawnProc', function (body) {
        socket_io.spawnedProcess = body.data;
    });
    socket_io.on('disconnect', function () {
        if (socket_io.spawnedProcess) {
            let process = socket_io.spawnedProcess
            mainController.killProcess(process)
        }
        console.log("A user has disconnected")
    });
}