//document.addEventListener('DOMContentLoaded', () => {
    let htmlHolder, myIndexedDBData, newVersion, schoolForm = document.querySelector('small').id;
        //0
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        fetch('/js/v2/' + schoolForm)
        .then(res => res.json())
        .then((data) => {
            myIndexedDBData = data.result;
            if(!localStorage.getItem(schoolForm)) {
                localStorage.setItem(schoolForm, 1);
            }
            let newVersion = Number(localStorage.getItem(schoolForm));
                document.querySelectorAll('.card').forEach((card, i) => {
                    var st = myIndexedDBData.filter(x => x.arm == card.id);
                    card.lastElementChild.textContent = st.length;
                    
                    let request = window.indexedDB.open(schoolForm, newVersion + i),  //multiline variable declaration
                        db,
                        tx,
                        store,
                        index;
                    request.onupgradeneeded = function(e) {
                        console.log(`Updated from version ${e.oldVersion} to ${e.newVersion}.`);
                        let db = request.result;
        
                        if ( !db.objectStoreNames.contains(card.id) ) {
                            store = db.createObjectStore(card.id, {keyPath: "_id"});
                        }
                    }
                    request.onerror = function(e) {
                        console.warn(e.target.error)
                    }
                    request.onsuccess = function(e) {
                        db = request.result;
                        tx = db.transaction(card.id, "readwrite");
                        store = tx.objectStore(card.id);
                        // index = store.index("Excellence");
                        store.clear();
                            
                        st.forEach((record) => {
                            store.put(record);
                        })

                        localStorage.setItem(schoolForm, newVersion++)
        
                        tx.oncomplete = function() {
                            db.close();
                        }
                    }
                    
                })
        })
//1        
        const sectionRight = document.querySelector('#right');
        const crudContainer = document.querySelector('#crudContainer');
//2
        document.querySelector('form#crudContainer').addEventListener('submit', (e) => {
            e.submitter.disabled = true;
            e.submitter.style.cursor = 'not-allowed';
        })
//3
        const editStudentObject = {};
        document.querySelector('#form-user-edit').addEventListener('change', (event) => {
            event.preventDefault();
            editStudentObject[event.srcElement.placeholder] = event.target.value;
        });
        document.querySelector('#form-user-edit').addEventListener('submit', (event) => {
            event.preventDefault();
            if (event.submitter.id == 'btn-submit-edit') {
                event.submitter.disabled = true;
                event.submitter.style.cursor = 'not-allowed';

                fetch('/edit/user/' + event.submitter.value, {
                    method: 'POST',
                    body: JSON.stringify(editStudentObject),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    } 
                })
                .then(res => res.json())
                .then(data => {
                    if(data) {
                        console.log(location.reload())
                    }
                });   
            } else {
                console.log(event.submitter.id)
            }
        })
//})

