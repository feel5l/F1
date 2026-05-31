import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// --- Error Handling ---
export {
  OperationType,
  type FirestoreErrorInfo,
  type FirestoreAuthSnapshot,
} from './firestoreErrors';
import {
  buildFirestoreErrorInfo,
  formatFirestoreErrorPayload,
  OperationType,
} from './firestoreErrors';

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo = buildFirestoreErrorInfo(error, operationType, path, auth.currentUser);
  console.error('Firestore Error: ', formatFirestoreErrorPayload(errInfo));
  throw new Error(formatFirestoreErrorPayload(errInfo));
}

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();
