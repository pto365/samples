import Dexie from 'dexie';
import 'dexie-observable';
import 'dexie-syncable';
const db = new Dexie('myTiles');
db.version(1).stores({ myTiles: '$$oid,key,jumpto' });
export default db;