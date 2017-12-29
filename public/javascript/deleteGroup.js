function deleteGroup(){
  if(confirm("Are you sure you want to delete this group?") === true){
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'http://localhost:3000/api/' + userId + '/group/' + groupId, true);
    xhr.send(null);
  }
}


var deleteButton = document.getElementById('removeGroup');
deleteButton.addEventListener('click', deleteGroup);
