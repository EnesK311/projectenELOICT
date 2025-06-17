import { Socket } from "socket.io-client";
import { inject } from "vue";

const socket: Socket = inject('socket') as Socket

const usePingCheck = () => {
    let ping = 0
    setInterval(() => {
        const start = Date.now();
        
        socket.emit("ping", () => {
            const duration = Date.now() - start;
            ping = duration;
        });
    }, 1000);
    return ping
}

export { usePingCheck }