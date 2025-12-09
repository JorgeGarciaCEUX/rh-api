import admin from "firebase-admin";
import serviceAccount from "../../keys/xochicalco-dc436-firebase-adminsdk-x3flj-d47dec25f7.json";

const serviceAccountPathOrObject: admin.ServiceAccount = serviceAccount as admin.ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPathOrObject),
  databaseURL: "https://xochicalco-dc436-default-rtdb.firebaseio.com",
});

export default admin;
