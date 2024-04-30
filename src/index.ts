import * as express from 'express'
import {createServer} from "http";
import {exec, spawn} from "node:child_process";
import Utils from "./Utils";

//Start Eturnal as subprocess
const eturnal = spawn("eturnalctl", ["foreground"])
eturnal.stderr.on("data", (d: Buffer) => console.error(d.toString()))
eturnal.stdout.on("data", (d: Buffer) => console.log(d.toString()))
eturnal.on("close", c => {
    console.log(`child process exited with code ${c}`)
    process.exit(1)
})


//Endpoint
const app = express();
const httpServer = createServer(app)
const port = Utils.getEnvNumber("PORT", 8080);

interface Credentials {
    username: string
    password: string
}

app.all("/", (req, res) => {
    exec("eturnalctl credentials", (err, out, stderr) => {
        if (!err)
            res.json(parseCredentials(out))
        else res.json({
            error: err,
            stderr,
            out
        })
    })
})
httpServer.listen(port, () => {
    console.log(`Started Server on ${port}`)
});

function parseCredentials(input: string): Credentials {
    const obj = Object.fromEntries(input
        .split("\n")
        .map(row => row.split(":").map(i => i.trim())))
    return {
        username: obj.Username,
        password: obj.Password
    }
}
