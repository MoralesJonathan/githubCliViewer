const mainController = require('./index.js');
module.exports.connect = socket_io => {
    console.log("A user has connected");
    socket_io.on('joinRoom', room => {
        socket_io.join(room);
    });
    socket_io.on('leaveRoom', room => {
        socket_io.leave(room);
    });
    socket_io.on('spawnProc', body => {
        socket_io.spawnedProcess = body.data;
    });
    socket_io.on('disconnect', () => {
        if (socket_io.spawnedProcess) {
            const process = socket_io.spawnedProcess;
            mainController.killProcess(process);
        }
        console.log("A user has disconnected");
    });
};