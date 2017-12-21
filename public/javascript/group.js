function deleteGroup(){
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', 'http://localhost:3000/api/' + userId + '/group/' + groupId, true);
  xhr.send(null);
}
var deleteButton = document.getElementById('removeGroup');
deleteButton.addEventListener('click', deleteGroup);
