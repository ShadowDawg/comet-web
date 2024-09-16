import { cert, getApps, initializeApp, App } from 'firebase-admin/app';

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  }),
  databaseURL: "https://astro-app1-default-rtdb.asia-southeast1.firebasedatabase.app",
};

function getFirebaseAdminApp(): App {
  if (getApps().length === 0) {
    return initializeApp(firebaseAdminConfig);
  }
  return getApps()[0];
}

export { firebaseAdminConfig, getFirebaseAdminApp };