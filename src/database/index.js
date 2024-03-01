import connectToDb from "./connection";

const start = async () => {
  let mongooseConnection;
  try {
    mongooseConnection = await connectToDb();
  } catch (error) {
    console.log("Failed Process", error);
  }

  await mongooseConnection.close();
  process.exit(0);
};

start();
