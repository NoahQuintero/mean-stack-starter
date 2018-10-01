import * as cluster from 'cluster';
import * as os from 'os';
import * as path from 'path';

// Import everything from express and assign it to the express variable
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { StartRoute } from './routes';
import { Utility } from './utility';

import { Message, MessageType } from './classes';

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  console.log(`${cpus} cpus available`);

  // fork a process for each available core
  let i;
  for (i = 0; i < cpus; i++) {
    console.log(`Forking worker ${i}`);
    const w = cluster.fork();
    Utility.setMessageHandling(w);
  }

  // create new process for each that dies.
  cluster.on('exit', function(worker, code, signal) {
      console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
      console.log('Starting a new worker');
      const w = cluster.fork();
      Utility.setMessageHandling(w);
  });

} else {

  // if I'm a child, kill myself if asked to shutdown
  process.on('message', (message: Message) => {
    if (message.code === MessageType.SHUTDOWN) {
      console.log(`Process ${process.pid} shutting down`);
      process.exit(0);
    }
  });

  // Create a new express application instance
  const app: express.Application = express();
  // The port the express app will listen on
  const port: number = Number(process.env.PORT) || 3000;

  const dir = path.resolve(__dirname, '../client');

  // use any extra modules/routes...
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json())
  app.use(express.static(dir));
  app.use('/', StartRoute);

  // Serve the application at the given port
  app.listen(port, () => {
      const pid = process.pid;
      // Success callback
      console.log(`Process ${pid} is listening at http://localhost:${port}/`);
  });
}
