const chokidar = require('chokidar')
const { spawn } = require('child_process')
const path = require('path')

module.exports = () => {
    if (process.argv.length !== 4) {
        console.error(
            `invalid arguments lenght ${process.argv.length} expected 4`,
        )
        process.exit(1)
    }

    const binary = process.argv[2]
    const argument = process.argv[3]

    const fullPath = path.resolve(__dirname, argument)

    const parentDirectory = path.dirname(fullPath)

    const watcher = chokidar.watch(parentDirectory)

    let processSpawned = spawn(binary, [argument], { stdio: 'inherit' })
    watcher.on('change', (path) => {
        console.log(`changed file "${path}", force reload`)
        processSpawned.kill()
        processSpawned = spawn(binary, [argument], { stdio: 'inherit' })
    })
}
