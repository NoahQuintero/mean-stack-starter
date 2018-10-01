export class Message {
    from: string;
    code: MessageType;
    data?: any;
    to?: string;

    constructor(
        from: string,
        code: MessageType,
        data?: any,
        to?: string) {
            this.from = from;
            this.code = code;
            if (data) {
                this.data = data;
            }
            if (to) {
                this.to = to;
            }
        }
}

export enum MessageType {
    SHUTDOWN,
    REQUEST_SHUTDOWN,
    RESPONSE_SHUTDOWN,
    REQUEST_WORKERS,
    RESPONSE_WORKERS
}
