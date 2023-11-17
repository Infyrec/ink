class Database{
    add(name, value){
        const request = indexedDB.open('infyrec', 1)

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore(name, { autoIncrement: true });
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            let transaction = db.transaction([name], 'readwrite');
            let objectStore = transaction.objectStore(name);
            const request = objectStore.add(value);
            request.onsuccess = () => {
                console.log('Data stored');
            };
            transaction.oncomplete = () => {
                db.close();
            };
            transaction.onerror = (error) => {
                console.error('Error while storing the data');
            };
            request.onerror = (event) => {
                console.error('Database error');
            };
        };
    }

    get(name){
        return new Promise ((resovle, reject) => {
            const request = indexedDB.open('infyrec', 1)
    
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const objectStore = db.createObjectStore(name, { autoIncrement: true });
            };
    
            request.onsuccess = (event) => {
                const db = event.target.result;
                let transaction = db.transaction([name], 'readonly');
                let objectStore = transaction.objectStore(name);
                let getAllRequest = objectStore.getAll();
                getAllRequest.onsuccess = () => {
                    let result = getAllRequest.result
                    if(result){
                        resovle(result)
                    }
                    else{
                        reject(undefined)
                    }
                };
                getAllRequest.onerror = (error) => {
                    console.error('Data fetch failed');
                };
    
                transaction.oncomplete = () => {
                    db.close();
                };
                transaction.onerror = (error) => {
                    console.error('Error while reading');
                };
                request.onerror = (event) => {
                    console.error('Database error');
                };
            };
        })
    }
}

export let inkdb = new Database()