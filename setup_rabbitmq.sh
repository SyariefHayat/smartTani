#!/bin/bash
SERVICE_PATH=$1
echo "Setting up RabbitMQ for $SERVICE_PATH"

cd "$SERVICE_PATH" || exit

# 1. Install dependencies
npm install amqplib
npm install -D @types/amqplib

# 2. Add RABBITMQ_URL to .env.example if missing
if ! grep -q "RABBITMQ_URL" .env.example; then
  echo "RABBITMQ_URL=amqp://localhost:5672" >> .env.example
fi

# 3. Add RABBITMQ_URL to src/config/env.ts if missing
if ! grep -q "RABBITMQ_URL" src/config/env.ts; then
  sed -i "s/});/  RABBITMQ_URL: z.string().url(),\n});/" src/config/env.ts
fi

# 4. Create src/lib/broker.ts
mkdir -p src/lib
cat << 'BROKER' > src/lib/broker.ts
import * as amqp from 'amqplib';
import { env } from '../config/env';

class MessageBroker {
  private static connection: any;
  private static channel: any;

  public static async connect(retries = 5): Promise<void> {
    while (retries > 0) {
      try {
        this.connection = await amqp.connect(env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
        
        console.log('✅ Connected to RabbitMQ');
        
        this.connection.on('error', (err: any) => {
          console.error('❌ RabbitMQ Connection Error:', err);
        });
        
        this.connection.on('close', () => {
          console.log('ℹ️ RabbitMQ Connection Closed');
        });
        
        return;
      } catch (err) {
        console.error(`❌ RabbitMQ Connection Failed. Retries left: ${retries - 1}`, err);
        retries -= 1;
        if (retries === 0) {
          console.error('❌ Could not connect to RabbitMQ. Exiting...');
          process.exit(1);
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  public static async createExchange(name: string, type: 'topic' | 'direct' | 'fanout' = 'topic'): Promise<void> {
    if (!this.channel) await this.connect();
    await this.channel.assertExchange(name, type, { durable: true });
  }

  public static async publish(exchange: string, routingKey: string, message: any): Promise<void> {
    if (!this.channel) await this.connect();
    const content = Buffer.from(JSON.stringify(message));
    this.channel.publish(exchange, routingKey, content, { persistent: true });
  }

  public static async subscribe(queue: string, handler: (msg: any) => void): Promise<void> {
    if (!this.channel) await this.connect();
    await this.channel.assertQueue(queue, { durable: true });
    
    this.channel.consume(queue, (msg: any) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          handler(content);
          this.channel.ack(msg);
        } catch (err) {
          console.error('❌ Error processing RabbitMQ message:', err);
          this.channel.nack(msg, false, false);
        }
      }
    });
  }
}

export default MessageBroker;
BROKER

# 5. Update src/index.ts to connect to RabbitMQ
if ! grep -q "MessageBroker.connect()" src/index.ts; then
  # Add import if not present
  if ! grep -q "import MessageBroker" src/index.ts; then
    # Insert at the top but after 'dotenv/config' if it's there
    if grep -q "import 'dotenv/config'" src/index.ts; then
      sed -i "/import 'dotenv\/config'/a import MessageBroker from './lib/broker';" src/index.ts
    else
      sed -i "1i import MessageBroker from './lib/broker';" src/index.ts
    fi
  fi
  # Add connect call
  if grep -q "RedisClient" src/index.ts; then
    awk '/RedisClient/ && !done { print "// Initialize RabbitMQ connection\nMessageBroker.connect();\n"; done=1 } 1' src/index.ts > src/index.ts.tmp && mv src/index.ts.tmp src/index.ts
  else
    awk '/console.log/ && !done { print "// Initialize RabbitMQ connection\nMessageBroker.connect();\n"; done=1 } 1' src/index.ts > src/index.ts.tmp && mv src/index.ts.tmp src/index.ts
  fi
fi

# 6. Verify compilation
npm run build
