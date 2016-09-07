import { LiveApi } from 'binary-live-api';

import ws from 'ws';

let api = new LiveApi({websocket: ws});

api.events.on('tick', (r) => {
  console.log(r);
})
api.getTickHistory('R_100', {
  "end": "latest",
  "count": 600,
  "subscribe": 1 
}); 

