import { connect } from 'mongoose';

export async function connectMongo() {
  try {
    await connect(
      'mongodb+srv://augustolg98:FGWCsdaR1iSYbVaU@backendcoder.kughf2s.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'ecommerce' }
    );
    console.log('plug to mongo!');
  } catch (e) {
    console.log(e);
    throw new Error('Cannot connect to the database');
  }
}
