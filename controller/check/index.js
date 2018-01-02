//Checking the entered info for the signup and validating it
module.exports.authUser = function(firstname, lastname, gender, age, address, postcode, city, username, password1, password2, email){
  count = "";
  if(firstname.lenght < 3){
    count += "fname ";
  }
  if(lastname.length < 3){
    count += "lname ";
  }
  if(address.length < 3){
    count += "address ";
  }
  if(postcode.length !== 5){
    count += "pcode ";
  }
  if(city.length < 3){
    count += "city ";
  }
  if(username.length < 5){
    count += "uname ";
  }
  //Testing passwords
  var check = 0;
  var number = 0;
  if((password1 === password2) && (password1.length > 6)){
    for(let i = 0; i < password1.length; i++){
      if(password1[i] === password1[i].toUpperCase() && password1[i] != parseInt(password1[i])){
        ++check;
      }
      if(password1[i] == parseInt(password1[i])){
        ++number;
      }
    }
  }else{
    count += "pword number";
  }
  if((check < 1) || (number < 1)){
    count += "pword bad " + number + " " + check;
  }
  //Testing email
  check = 0;
  number = 0;
  for(let i = 0; i < email.length; i++){
    if(email[i] === "@"){
      ++check;
    }
    if(email[i] === "."){
      ++check;
    }
  }
  if(check < 2){
    count += "email ";
  }
  //Checking that everything is ok. If it is then return 1 else return 0
  if(count === ""){
    console.log(count);
    return 1;
  }else{
    console.log(count);
    return 0;
  }
};
