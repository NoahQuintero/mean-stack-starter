import { Worker } from 'cluster';
import * as cluster from 'cluster';
import { Message, MessageType } from './classes';

export class Utility {
    public static setMessageHandling(w: Worker) {
        w.on('message', (message: Message) => {

            // console.log('msg received');

            switch (message.code) {
              case(MessageType.REQUEST_WORKERS):

                Utility.requestWorkersHandler(w, message);

                break;

              case(MessageType.REQUEST_SHUTDOWN):
                Utility.requestShutdownHandler(w, message);
                break;

              default:
                console.error('UNKOWN MESSAGETYPE RECIEVED!');
                break;
            }
          });
    }

    public static workerSummary(w: Worker) {
        return {wid: w.id, pid: w.process.pid};
    }

    public static requestWorkersHandler(w: Worker, message: Message) {
        let wid;
        const workers = [];
        // console.log(w.process.pid);

        for (wid in cluster.workers) {
        const wSum = Utility.workerSummary(cluster.workers[wid]);
        workers.push(wSum);
        }

        // console.log(workers);
        const response = new Message('master', MessageType.RESPONSE_WORKERS, workers);
        w.send(response);
    }

    public static requestShutdownHandler(w: Worker, message: Message) {
        const pid = message.data;
        let wid;
        let workerToKill: Worker;

        for (wid in cluster.workers) {
            // console.log(cluster.workers[wid].process.pid, pid);
            if (cluster.workers[wid].process.pid === pid) {
                workerToKill = cluster.workers[wid];
            }
        }

        if (workerToKill) {
            const shutdown = new Message('master', MessageType.SHUTDOWN);
            workerToKill.send(shutdown);
        }

        // console.log(w);
        const response = new Message('master', MessageType.RESPONSE_SHUTDOWN);
        w.send(response);
    }

}
