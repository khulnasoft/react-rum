import { KengineRumConfig } from "./context.tsx";



export class DispatchQueue {
    queue: any[];
    queueSize: 500;
    duration: 1000
    timeout: null | ReturnType<typeof setTimeout> = null;
    config: KengineRumConfig
    constructor({ config }) {
        this.config = config;
        this.queue = [];
    }

    push(data) {
        this.queue.push(data);
        console.log('push', this.queue.length)
        if (this.queue.length >= this.queueSize) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            console.log('size exceeded: flush')
            return this.flush();
        }

        if (!this.timeout) {
            this.timeout = setTimeout(() => {
                console.log('timeout: flush', this.queue.length)
                this.flush();
                this.timeout = null;
            }, this.duration)
        }
    }

    async flush() {
        if(this.queue.length === 0) return
        const events = this.queue;
        this.queue = []
        await fetch(`${this.config.url || "https://events.kengine.khulnasoft.com/v1"}/${this.config.dataset || "web"}`, {
            method: 'POST',
            headers: {
                contentType: 'application/json',
                'x-api-key': this.config.apiKey,
                'user-agent': '@khulnasoft/react-rum/0.1.5',
                'library': '@khulnasoft/react-rum/0.1.5',
                'x-service': this.config.service || window.location.hostname,
                'x-namespace': this.config.namespace || window.location.pathname,
            },
            body: JSON.stringify(events.map(event => ({
                userId: this.config.userId, sessionId: this.config.sessionId, pageLoadId: this.config.pageLoadId, namespace: this.config.namespace || window.location.pathname, ...event
            }))),
        })
    }
}