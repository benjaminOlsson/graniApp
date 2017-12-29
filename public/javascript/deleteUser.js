function deleteUser(){
  if(confirm("Are you sure you want to delete this user?") === true){
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'http://localhost:3000/api/' + userId, true);
    xhr.send(null);
  }
}


var removeButton = document.getElementById('removeUser');
removeButton.addEventListener('click', deleteUser);
