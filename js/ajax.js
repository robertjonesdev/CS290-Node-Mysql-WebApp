var myAPI = 'http://localhost:7797';
/**********************
         DELETE
***********************/
if (document.getElementsByClassName('deleteForm') != null) {
    var elements = document.getElementsByClassName('deleteForm');
    for(var i=0; i < elements.length; i++) {
        elements[i].addEventListener('submit', function(event){
            event.preventDefault();
            deleteEvent(this.childNodes[1].value).then(processDeleteEvent, errorHandler)
        });
    }
}

function deleteEvent(id) {
    return new Promise(function(resolve, reject) {
        var req         = new XMLHttpRequest();
        var payload     = {};
        payload.request = "delete";
        payload.id      = id;
        req.open('POST', myAPI + "/delete", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    console.log("req done successfully");
                    resolve(JSON.parse(req.responseText));
                } else {
                    reject(req.status);
                    console.log("req failed");
                }
            } else {
                console.log("req processing going on");
            }
        }
        req.send(JSON.stringify(payload));
        console.log("request sent successfully");
    });
}

function processDeleteEvent(row) {
   setTimeout(function() {
      var element =  document.getElementById('row-'+row);
      element.parentNode.removeChild(element);
   }, 0);
}

/**********************
            EDIT
***********************/
document.getElementById('editRow').addEventListener('submit', function(event){
    event.preventDefault();
    editEvent().then(processEditEvent, errorHandler)
});

function editEvent(id) {
    return new Promise(function(resolve, reject) {
        var req         = new XMLHttpRequest();
        var payload     = {};
        payload.request = "edit";
        payload.id      = document.editRow.editId.value;
        payload.name    = document.editRow.editName.value;
        payload.reps    = document.editRow.editReps.value;
        payload.weight  = document.editRow.editWeight.value;
        payload.date    = document.editRow.editDate.value;
        payload.lbs     = document.editRow.editLbs.value;
        req.open('POST', myAPI + "/edit", true);
        req.setRequestHeader('Content-Type', 'application/json');

        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    console.log("edit req done successfully");
                    var resp = req.responseText;

                    resolve(JSON.parse(resp));
                } else {
                    reject(req.status);
                    console.log("edit req failed");
                }
            } else {
                console.log("edit req processing going on");
            }
        }
        req.send(JSON.stringify(payload));
        console.log("edit request sent successfully");
    });
}

function processEditEvent(element) {
   setTimeout(function() {
      console.log(element);
      document.getElementById('elem-' + element[0].id + '-date').innerHTML = formatDate(element[0].date);
      document.getElementById('elem-' + element[0].id + '-reps').innerHTML = element[0].reps;
      document.getElementById('elem-' + element[0].id + '-name').innerHTML = element[0].name;
      document.getElementById('elem-' + element[0].id + '-weight').innerHTML = element[0].weight;
      console.log("received lbs" +element[0].lbs);
      if (element[0].lbs == 1) {
          document.getElementById('elem-' + element[0].id + '-lbs').innerHTML = "lbs";
      } else {
          document.getElementById('elem-' + element[0].id + '-lbs').innerHTML = "kg";
      }
      $('#exampleModal').modal('hide');
   }, 0);
}




/**********************
       INSERT NEW
***********************/
document.getElementById('insertNew').addEventListener('submit', function(event){
    event.preventDefault();
    insertEvent().then(processInsertEvent, errorHandler)
});

function insertEvent() {
    return new Promise(function(resolve, reject) {
        var req         = new XMLHttpRequest();
        var payload     = {};
        payload.request = "insert";
        payload.name    = document.insertNew.inputName.value;
        payload.reps    = document.insertNew.inputReps.value;
        payload.weight  = document.insertNew.inputWeight.value;
        payload.date    = document.insertNew.inputDate.value;
        payload.lbs     = document.insertNew.inputLbs.value;

        req.open('POST', myAPI + "/add", true);
        req.setRequestHeader('Content-Type', 'application/json');

        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    console.log("req done successfully");
                    resolve(JSON.parse(req.responseText));
                } else {
                    reject(req.status);
                    console.log("req failed");
                }
            } else {
                console.log("req processing going on");
            }
        }
        req.send(JSON.stringify(payload));
    });
}

function processInsertEvent(element) {
   setTimeout(function() {
       console.log(element);
       //Add New Row
       addRow(element[0]);
   }, 0);
}

/***************************************
       Initial page load, get all rows
*****************************************/

loadEvent().then(processLoadEvent, errorHandler);

function loadEvent() {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', myAPI, true);
        req.onreadystatechange = function() {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    console.log("req done successfully");
                    resolve(JSON.parse(req.responseText));
                } else {
                    reject(req.status);
                    console.log("req failed");
                }
            } else {
                console.log("req processing going on");
            }
        }
        req.send(null);
    });
}

function processLoadEvent(elements) {
   setTimeout(function() {
       console.log(elements);
       //Add New Row
       for (var i in elements) {
           console.log(elements[i]);
           addRow(elements[i]);
       }
   }, 0);
}

function addRow(element) {
    var rowgroup = document.getElementById('rowgroup');
    var newRow = document.createElement("tr");
        newRow.setAttribute("id", "row-" + element.id);
        newRow.innerHTML = "";
    var newTD1 = document.createElement("td");
        newTD1.setAttribute("id", "elem-"+ element.id + "-name");
        newTD1.innerHTML = element.name
        newRow.appendChild(newTD1);
    var newTD2 = document.createElement("td");
        newTD2.setAttribute("id", "elem-"+ element.id+ "-reps");
        newTD2.innerHTML = element.reps
        newRow.appendChild(newTD2);
    var newTD3 = document.createElement("td");
        newTD3.setAttribute("id", "elem-"+ element.id+ "-weight");
        newTD3.innerHTML = element.weight
        newRow.appendChild(newTD3);
    var newTD4 = document.createElement("td");
        newTD4.setAttribute("id", "elem-"+ element.id+ "-date");
        newTD4.innerHTML = formatDate(element.date);
        newRow.appendChild(newTD4);
    var newTD5 = document.createElement("td");
        newTD5.setAttribute("id", "elem-"+ element.id+ "-lbs");
        if (element.lbs == 1) {
            newTD5.innerHTML = "lbs";
        } else {
            newTD5.innerHTML = "kg";
        }
        newRow.appendChild(newTD5);
    var newTD6 = document.createElement("td");
        newTD6.innerHTML = ""
    var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "form-group row");
    var hiddenValueEdit = document.createElement("input");
        hiddenValueEdit.setAttribute("type", "hidden");
        hiddenValueEdit.setAttribute("value",element.id);
    var newEditBtn = document.createElement("button");
        newEditBtn.innerHTML = "Edit";
        newEditBtn.setAttribute("id", "editRow" + element.id);
        newEditBtn.setAttribute("value", element.id);
        newEditBtn.setAttribute("class", "btn btn-secondary editRow");
        newEditBtn.setAttribute("data-toggle", "modal");
        newEditBtn.setAttribute("data-target", "#exampleModal");
        newEditBtn.setAttribute("data-whatever", element.id);
        newDiv.appendChild(newEditBtn);
    var newFormDelete = document.createElement("form");
        newFormDelete.setAttribute("class", "DeleteForm");
    var hiddenValueDelete = document.createElement("input");
        hiddenValueDelete.setAttribute("type", "hidden");
        hiddenValueDelete.setAttribute("id", "id");
        hiddenValueDelete.setAttribute("value", element.id);
        newFormDelete.appendChild(hiddenValueDelete);
    var newDeleteBtn = document.createElement("button");
        newDeleteBtn.innerHTML = "Delete";
        newDeleteBtn.setAttribute("id", "deleteRow");
        newDeleteBtn.setAttribute("value", element.id);
        newDeleteBtn.setAttribute("class", "btn btn-secondary ml-1 deleteRow");
        newFormDelete.appendChild(newDeleteBtn);
        newFormDelete.addEventListener('submit', function(event){
            event.preventDefault();
            deleteEvent(element.id).then(processDeleteEvent, errorHandler)
        });
        newDiv.appendChild(newFormDelete);
        newTD6.appendChild(newDiv);
        newRow.appendChild(newTD6);
        rowgroup.appendChild(newRow);
}
/**********************
       ERROR HANDLER
***********************/
function errorHandler(statusCode){
 console.log("failed with status", status);
}
