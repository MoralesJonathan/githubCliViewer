const path = require("path"),
    request = require('request'),
    decompress = require('decompress'),
    spawn = require('child_process').spawn,
    fs = require('fs');

let terminalProcesses = [];

module.exports = {
    upload: (req, res) => {
        request({ url: req.body.data + '/archive/master.zip', encoding: null }, (error, response, body) => {
            error ? res.send("Error Download Repo").status(500) : unzip(body, req, res);
        })
    },
    runNode: (req, res) => {
        io.sockets.in('test123').emit('terminalMessage', 'Running Node File...');
        terminalProcesses.push(spawn('node.exe', ['server.js'], { cwd: 'downloadedRepos/' + req.body.data.data }));
        let terminalNum = terminalProcesses.length - 1;
        let terminal = terminalProcesses[terminalNum];
        terminal.stdout.on('data', data => {
            console.log(`stdout: ${data}`);
            io.sockets.in('test123').emit('terminalMessage', data.toString('utf8'))
        });

        terminal.stderr.on('data', data => {
            console.log(`stderr: ${data}`);
        });

        terminal.on('close', code => {
            console.log(`Node process exited with code ${code}`);
            terminalProcesses.splice(terminalNum, 1)
            io.sockets.in('test123').emit('terminalMessage', "Terminal Closed. Please refresh page to run new app")
            io.sockets.in('test123').emit('terminalEnd', "")
        });

        res.send(terminalNum.toString())
    },
    sendInput: (req, res) => {
        io.sockets.in('test123').emit('terminalMessage', req.params.text)
        let terminal = terminalProcesses[parseInt(req.body.data.data)]
        terminal.stdin.setEncoding('utf-8');
        terminal.stdin.write(req.params.text+"\n");
        terminal.stdin.end();
        res.sendStatus(200);
    },
    fourohfour: (req, res) => {
        res.send("Page Not Found").status(404)
    },
    sendIndex: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/', 'index.html'));
    }
};

function unzip(zip, req, res) {
    io.sockets.in('test123').emit('uploadProgress', "Unzipping Repository...")
    decompress(zip, 'downloadedRepos/').then(files => {
        npmInstall(files[0].path, req, res)
    }).catch(error => {
        res.send("ERROR UNZIPPING FILES: " + error).status(500)
    });
};

function npmInstall(repoName, req, res) {
    io.sockets.in('test123').emit('uploadProgress', "Installing Dependencies...")
    let terminalProcess = spawn('npm.cmd', ['install', 'express'], { cwd: 'downloadedRepos/' + repoName });
    terminalProcess.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
        io.sockets.in('test123').emit('terminalMessage', data.toString('utf8'))
    });

    terminalProcess.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    terminalProcess.on('close', code => {
        console.log(`npminstall process exited with code ${code}`);
        if (!code == 0) {
            res.send('Error performing NPM install').status(500)
        } else {
            res.send(repoName).status(200)
        }
    });
}
