const path = require("path"),
    request = require('request'),
    decompress = require('decompress'),
    spawn = require('child_process').spawn,
    fs = require('fs');
module.exports = {
    upload: (req, res) => {
        console.log(req.body)
        request({url:req.body.url + '/archive/master.zip', encoding: null}, (error, response, body) => {
            error ? res.send("Error Download Repo").status(500) : unzip(body, req, res);
        })
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
            res.sendStatus(200);
        }
    });
}

