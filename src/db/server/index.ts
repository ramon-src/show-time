
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017/show-time" //"mongodb+srv://ramon:knqyCR94XI3XO4QN@cluster0.dwhgldc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export default client
