import { openDB } from 'idb';

const DB_NAME = 'taskDatabase';
const STORE_NAME = 'tasks';
const VERSION = 1;

export const initDB = async () => {
    return openDB(DB_NAME, VERSION, {
        upgrade(db) {
            if(!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

export const getAllTasks = async () => {
    const db = await initDB();
    return db.getAll(STORE_NAME);
};

export const addTask = async (task) => {
    const db = await initDB();
    return db.add(STORE_NAME, task);
}

export const updateTask = async (task) => {
    const db = await initDB();
    return db.put(STORE_NAME, task);
};

export const deleteTask = async (id) => {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
};