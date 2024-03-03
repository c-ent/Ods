// api/saveResults.js
import { connect, client, close } from './db.js';

const saveResults = async (req, res) => {
  try {
    await connect();
    const collection = client.db("ods").collection('results');
    const result = await collection.insertOne(req.body);
    console.log(`Inserted document with _id: ${result.insertedId}`);
    res.status(200).send('Results saved');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  } finally {
    await close();
  }
};

export default saveResults;