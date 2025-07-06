import app from "./app.js";
import connectWithDB from "./db/index.js";

connectWithDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is listing at 3000");
    });
  })
  .catch((errr) => {
    console.log("Error in server page : ", errr);
  });
