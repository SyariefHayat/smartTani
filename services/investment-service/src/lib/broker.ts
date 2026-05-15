import { logger } from '../../../../shared/utils/logger';
import { connect, ChannelModel, Channel, ConsumeMessage } from 'amqplib';
import { env } from '../config/env';

class MessageBroker {
  private static connection: ChannelModel;
  private static channel: Channel;

  public static async connect(retries = 5): Promise<void> {
    while (retries > 0) {
      try {
        this.connection = await connect(env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();

        logger.info('✅ Connected to RabbitMQ');

        this.connection.on('error', (err: Error) => {
          logger.error('❌ RabbitMQ Connection Error:', err);
        });

        this.connection.on('close', () => {
          logger.info('ℹ️ RabbitMQ Connection Closed');
        });

        return;
      } catch (err) {
        logger.error(`❌ RabbitMQ Connection Failed. Retries left: ${retries - 1}`, err);
        retries -= 1;
        if (retries === 0) {
          logger.error('❌ Could not connect to RabbitMQ. Exiting...');
          process.exit(1);
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  public static async createExchange(
    name: string,
    type: 'topic' | 'direct' | 'fanout' = 'topic'
  ): Promise<void> {
    if (!this.channel) await this.connect();
    await this.channel.assertExchange(name, type, { durable: true });
  }

  public static async publish(
    exchange: string,
    routingKey: string,
    message: unknown
  ): Promise<void> {
    if (!this.channel) await this.connect();
    const content = Buffer.from(JSON.stringify(message));
    this.channel.publish(exchange, routingKey, content, { persistent: true });
  }

  public static async subscribe(queue: string, handler: (msg: unknown) => void): Promise<void> {
    if (!this.channel) await this.connect();
    await this.channel.assertQueue(queue, { durable: true });

    this.channel.consume(queue, (msg: ConsumeMessage | null) => {
      if (msg) {
        try {
          const content: unknown = JSON.parse(msg.content.toString());
          handler(content);
          this.channel.ack(msg);
        } catch (err) {
          logger.error('❌ Error processing RabbitMQ message:', err);
          this.channel.nack(msg, false, false);
        }
      }
    });
  }
}

export default MessageBroker;
