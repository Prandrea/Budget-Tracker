let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    const db = target.result;
    db.createObjectStore("new_transaction", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
    db = target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
  };

  function saveRecord(record) {
    const transaction = db.transaction([ "new_transaction"], "readwrite");
    const store = transaction.objectStore("new_transaction");

    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction([ "new_transaction"], "readwrite");
    const store = transaction.objectStore("new_transaction");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type" : "application/json"
                }
            })
            .then (response => {
                return response.json ();
            })
        }
    }
}
