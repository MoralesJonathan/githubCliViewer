const path = require("path"),
    request = require('request'),
    decompress = require('decompress'),
    spawn = require('child_process').spawn,
    fs = require('fs');

let terminalProcesses = [];

module.exports = {
    upload: (req, res) => {
        request({ url: req.body.data + '/archive/master.zip', encoding: null }, (error, response, body) => {
            error ? res.send("Error Download Repo").status(500) : (
                io.sockets.in('test123').emit('uploadProgress', "Unzipping Repository..."),
                body.toString('utf8').includes('/package.json') ? (
                    decompress(body, 'downloadedRepos/').then(files => {
                        let packageJson = files.find(obj => obj.path === files[0].path + 'package.json');
                        packageJson = JSON.parse((packageJson.data).toString('utf8'))
                        npmInstall(files[0].path, packageJson.main, req, res)
                    }).catch(error => {
                        io.sockets.in('test123').emit('error', "There was an error unzipping the files. Unable to continue. Please refresh this page to try again.")
                        res.send("ERROR UNZIPPING FILES: " + error).status(500)
                    })
                ) : (
                        io.sockets.in('test123').emit('error', "Package.JSON not found. Unable to continue. Please refresh this page to try again."),
                        res.send("ERROR: No Package.json found.").status(500)
                    )
            )
        })
    },
    runNode: (req, res) => {
        io.sockets.in('test123').emit('terminalMessage', 'Running Node File...');
        terminalProcesses.push(spawn('node', [req.body.data.main], { shell: true, cwd: 'downloadedRepos/' + req.body.data.repo }));
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
            if (!code == 0) {
                io.sockets.in('test123').emit('error', "Error running node server. Unable to continue. Please refresh this page to try again.")
                res.send('Error running Node').status(500)
            } else {
                terminalProcesses.splice(terminalNum, 1)
                io.sockets.in('test123').emit('terminalMessage', "Terminal Closed. Please refresh page to run new app")
                io.sockets.in('test123').emit('terminalEnd', "")
            }
        });

        res.send(terminalNum.toString())
    },
    sendInput: (req, res) => {
        io.sockets.in('test123').emit('terminalMessage', req.params.text)
        let terminal = terminalProcesses[parseInt(req.body.data.data)]
        terminal.stdin.setEncoding('utf-8');
        terminal.stdin.write(req.params.text + "\n");
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

function npmInstall(repoName, nodeFileName, req, res) {
    let terminalProcess;
    !nodeFileName ? io.sockets.in('test123').emit('error', "Error finding node server file. Please make sure your node file is specified in the package.json under 'main'. For more information refer to https://bit.ly/2IijrOy. Reload page to try again.") : (
        io.sockets.in('test123').emit('uploadProgress', "Installing Dependencies..."),
        terminalProcess = spawn('npm', ['install'], { shell: true, cwd: 'downloadedRepos/' + repoName }),
        terminalProcess.stdout.on('data', data => {
            console.log(`stdout: ${data}`);
            io.sockets.in('test123').emit('terminalMessage', data.toString('utf8'))
        }),

        terminalProcess.stderr.on('data', data => {
            console.log(`stderr: ${data}`);
        }),

        terminalProcess.on('close', code => {
            console.log(`npminstall process exited with code ${code}`);
            if (!code == 0) {
                io.sockets.in('test123').emit('error', "Error performing NPM install. Unable to continue. Please refresh this page to try again.")
                res.send('Error performing NPM install').status(500)
            } else {
                res.send({ repo: repoName, main: nodeFileName }).status(200)
            }
        })
    )
}
