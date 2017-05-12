import {Application, Container} from "promiseoft";
import * as http from 'http';

let app = new Application({
    baseDir: __dirname
});

app.init().then((handler) => {
    let PORT = Container.getComponent("settings").PORT;
    http.createServer(handler).listen(PORT);
    console.log("Server Listening on port", PORT);
}).catch((e) => {
    console.error("Container init failed", e);
    process.exit(1);
});
