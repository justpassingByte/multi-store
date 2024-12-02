// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { Parser } from 'json2csv'
import fs from 'fs';
const firebaseConfig = {
  apiKey: "AIzaSyC9Wg8dk_kUhrntiu-jRfhK-RSF7MYMxLQ",
  authDomain: "multi-food-store.firebaseapp.com",
  projectId: "multi-food-store",
  storageBucket: "multi-food-store.appspot.com",
  messagingSenderId: "526382486760",
  appId: "1:526382486760:web:482e0072bbe5a1ae9ca55d",
  measurementId: "G-T14ZDERQ5K"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
export { db, storage }
async function exportCollectionToCSV(collectionName, parentPath = '') {
  const fullPath = parentPath ? `${parentPath}/${collectionName}` : collectionName;
  const querySnapshot = await getDocs(collection(db, fullPath));
  const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); if (data.length === 0) {
    console.log(`No data found in the collection: ${fullPath}`); return;
  }
  const fields = Object.keys(data[0]); const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data); fs.writeFileSync(`${fullPath.replace(/\//g, '_')}.csv`, csv);
  console.log(`Data has been exported to ${fullPath.replace(/\//g, '_')}.csv`);
  // Export subcollections 
  for (const docSnapshot of querySnapshot.docs) {
    const subcollections = await getSubcollections(docSnapshot.ref);
    for (const subcollection of subcollections) {
      await exportCollectionToCSV(subcollection.id, `${fullPath}/${docSnapshot.id}`);
    }
  }
}
async function getSubcollections(docRef) {
  const subcollections = await getDocs(collection(docRef, ''));
  return subcollections.docs;
} async function exportAllCollections() {
  const collections = ['stores'];
  // Bắt đầu từ collection gốc 
  for (const collectionName of collections) {
    await exportCollectionToCSV(collectionName);
  }
}
exportAllCollections();