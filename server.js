const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });
let rooms = {};

wss.on('connection', ws => {
    ws.on('message', msg => {
        let data = JSON.parse(msg);
        if(data.type == "join"){
            if(!rooms[data.code]) rooms[data.code] = [];
            rooms[data.code].push(ws);
            ws.room = data.code;
        }
        if(rooms[ws.room]){
            rooms[ws.room].forEach(client => {
                if(client != ws && client.readyState == WebSocket.OPEN){
                    client.send(msg);
                }
            });
        }
    });
});

server.listen(process.env.PORT || 8080);