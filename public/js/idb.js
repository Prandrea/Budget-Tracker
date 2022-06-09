let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    const db = target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
    db = target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};