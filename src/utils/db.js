import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://ods:KpRP9JlOIg1rortk@cluster0.me7nwcd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const client = new MongoClient(uri, {
});

export async function connect() {
    await client.connect();
    console.log('Connected to MongoDB');
}

export async function close() {
    await client.close();
    console.log('Closed MongoDB connection');
}
// async function run() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     await client.close();
//   }
// }

// run().catch(console.dir);