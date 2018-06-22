module.exports.connect = function (socket_io) {
    //https://stackoverflow.com/questions/19559135/use-socket-io-in-controllers
    console.log("A user has connected!")
    socket_io.join('test123')
}