function deleteTeam(){
  if(confirm("Are you sure you want to delete this group?") === true){
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'http://localhost:3000/api/' + userId + '/team/' + teamId, true);
    xhr.send(null);
  }
}


var removeButton = document.getElementById('removeTeam');
removeButton.addEventListener('click', deleteTeam);
