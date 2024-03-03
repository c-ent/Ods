// server.js
import express from 'express';
import { client } from './db.js';

const app = express();
app.use(express.json());

app.post('/store', async (req, res) => {
    try {
      await client.connect();
      const collection = client.db("test").collection("documents");
      const result = await collection.insertOne(req.body);
      const insertedDocument = await collection.findOne({ _id: result.insertedId });
      res.status(200).send(insertedDocument);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error connecting to MongoDB');
    } finally {
      if (client.isConnected()) {
        await client.close();
      }
    }
  });

app.listen(3000, () => console.log('Server is running on port 3000'));