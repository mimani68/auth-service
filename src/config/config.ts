export const config = {
    rabbitmq: {
        user: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD,
        queue: process.env.RABBITMQ_NODE_QUEUE_NAME,
        host: process.env.RABBITMQ_URL || "127.0.0.1",
        port: process.env.RABBITMQ_PORT || 5672,
        vhost: process.env.RABBITMQ_VHOST || 'test',
        options: {durable: true}
    }
}