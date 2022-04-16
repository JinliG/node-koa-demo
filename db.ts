import { MongoClient, MongoClientOptions } from 'mongodb';

const mongodbUri = 'mongodb+srv://jinli:1231566regret@cluster0.l7efp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const mongodbOptions = {
  maxPoolSize: 20,
  minPoolSize: 10,
  connectTimeoutMS: 500,
  useNewUrlParser: true
} as MongoClientOptions;

async function initPool() {
  const client = new MongoClient(mongodbUri, mongodbOptions);
  try {
    await client.connect();
    console.log(`--- worker ${process.pid} db connect success`);
  } catch (error) {
    client.close();
    throw error;
  }
  return client;
}

function MongoPool() {}
MongoPool.getInstance = (function() {
  let instance: MongoClient;
  return async function() {
    if (!instance) {
      instance = await initPool();
    }
    return instance;
  }
})();

export default MongoPool;