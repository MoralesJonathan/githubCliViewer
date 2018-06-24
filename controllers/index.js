const path = require("path"),
    request = require('request'),
    decompress = require('decompress'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    uuidv1 = require('uuid/v1'),
    rimraf = require('rimraf')
let terminalProcesses = [];

module.exports = {
    generateRoom: (req, res) => {
        const uuid = uuidv1();
        req.session.socketRoom = uuid;
        res.send(uuid).status(200)
    },
    upload: (req, res) => {
        request({ url: req.body.data + '/archive/master.zip', encoding: null }, (error, response, body) => {
            error ? res.send("Error Download Repo").status(500) : (
                io.sockets.in(req.session.socketRoom).emit('uploadProgress', "Unzipping Repository..."),
                body.toString('utf8').includes('/package.json') ? (
                    decompress(body, 'downloadedRepos/').then(files => {
                        let packageJson = files.find(obj => obj.path === files[0].path + 'package.json');
                        packageJson = JSON.parse((packageJson.data).toString('utf8'))
                        npmInstall(files[0].path, packageJson.main, req, res)
                    }).catch(error => {
                        io.sockets.in(req.session.socketRoom).emit('error', "There was an error unzipping the files. Unable to continue. Please refresh this page to try again.")
                        io.sockets.in(req.session.socketRoom).emit('terminalEnd', req.session.socketRoom)
                        req.session.socketRoom = null;
                        res.send("ERROR UNZIPPING FILES: " + error).status(500)
                    })
                ) : (
                        io.sockets.in(req.session.socketRoom).emit('error', "Package.JSON not found. Unable to continue. Please refresh this page to try again."),
                        io.sockets.in(req.session.socketRoom).emit('terminalEnd', req.session.socketRoom),
                        req.session.socketRoom = null,
                        res.send("ERROR: No Package.json found.").status(500)
                    )
            )
        })
    },
    runNode: (req, res) => {
        io.sockets.in(req.session.socketRoom).emit('terminalMessage', 'Running Node File...');
        terminalProcesses.push(spawn('node', [req.body.data.main], { shell: true, cwd: 'downloadedRepos/' + req.body.data.repo }));
        let terminalNum = terminalProcesses.length - 1;
        let terminal = terminalProcesses[terminalNum];
        terminal.stdout.on('data', data => {
            console.log(`stdout: ${data}`);
            io.sockets.in(req.session.socketRoom).emit('terminalMessage', data.toString('utf8'))
        });

        terminal.stderr.on('data', data => {
            console.log(`stderr: ${data}`);
            if (!data.includes('WARN ')) io.sockets.in(req.session.socketRoom).emit('terminalMessage', data.toString('utf8'))
        });
        terminal.on('close', code => {
            console.log(`Node process exited with code ${code}`);
            !code == 0? (
                io.sockets.in(req.session.socketRoom).emit('terminalMessage', "Error running node server. Unable to continue. Please refresh this page to try again."),
                io.sockets.in(req.session.socketRoom).emit('terminalEnd', req.session.socketRoom),
                req.session.socketRoom = null,
                terminalProcesses.splice(terminalNum, 1),
                rimraf('downloadedRepos/' + req.body.data.repo, e => { if (e) console.log(e) })
            ) : (
                terminalProcesses.splice(terminalNum, 1),
                io.sockets.in(req.session.socketRoom).emit('terminalMessage', "Terminal Closed. Please refresh page to run new app"),
                io.sockets.in(req.session.socketRoom).emit('terminalEnd', req.session.socketRoom),
                req.session.socketRoom = null,
                terminalProcesses.splice(terminalNum, 1),
                rimraf('downloadedRepos/' + req.body.data.repo, e => { if (e) console.log(e) })
            )
        });
        res.send(terminalNum.toString())
    },
    sendInput: (req, res) => {
        let terminal = terminalProcesses[parseInt(req.body.data.data)]
        terminal.stdin.setEncoding('utf-8');
        req.params.text === 'U+E007' ? (
            terminal.stdin.write("\n")
        ) : req.params.text === 'U+0008' ? (
            //TODO: Remove a character from input
            console.log("User backspaced")
        ) : terminal.stdin.write(req.params.text)
        res.sendStatus(200);
    },
    killProcess: (procNum) => {
        console.log("KILLING PROCESS")
        let terminal = terminalProcesses[parseInt(procNum)]
        terminal.kill()
        terminalProcesses.splice(procNum, 1);
    },
    fourohfour: (req, res) => {
        res.send("Page Not Found").status(404)
        req.session.woop = 'testing'
    },
    sendIndex: (req, res) => {
        res.sendFile(path.join(__dirname, '../public/', 'index.html'));
    }
};

function npmInstall(repoName, nodeFileName, req, res) {
    let terminalProcess;
    !nodeFileName ? (
        io.sockets.in(req.session.socketRoom).emit('error', "Error finding node server file. Please make sure your node file is specified in the package.json under 'main'. For more information refer to https://bit.ly/2IijrOy. Reload page to try again."),
        io.sockets.in(req.session.socketRoom).emit('terminalEnd', req.session.socketRoom),
        req.session.socketRoom = null,
        res.sendStatus(500),
        rimraf('downloadedRepos/' + repoName, e => { if (e) console.log(e) })
    ) : (
            io.sockets.in(req.session.socketRoom).emit('uploadProgress', "Installing Dependencies..."),
            terminalProcess = spawn('npm', ['install'], { shell: true, cwd: 'downloadedRepos/' + repoName }),
            terminalProcess.stdout.on('data', data => {
                console.log(`stdout: ${data}`);
                io.sockets.in(req.session.socketRoom).emit('terminalMessage', data.toString('utf8'))
            }),

            terminalProcess.stderr.on('data', data => {
                console.log(`stderr: ${data}`);
            }),

            terminalProcess.on('close', code => {
                console.log(`npminstall process exited with code ${code}`);
                !code == 0? (
                    io.sockets.in(req.session.socketRoom).emit('error', "Error performing NPM install. Unable to continue. Please refresh this page to try again."),
                    io.sockets.in(req.session.socketRoom).emit('terminalEnd', req.session.socketRoom),
                    req.session.socketRoom = null,
                    res.send('Error performing NPM install').status(500),
                    rimraf('downloadedRepos/' + repoName, e => { if (e) console.log(e) })
                ) : res.send({ repo: repoName, main: nodeFileName }).status(200)
            })
        )
}
