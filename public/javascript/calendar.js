//Declaring all variables
  var calendarMonthAndYear = document.getElementById('calendarMonth');
  var calendarId = document.getElementById('calendarId');
  var setCal = {};
  var currWeek;
  var weekOrMonth = 0;

  var timeNow = {
    day: new Date().getDay(),
    date: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }

  var curr = {
    day: new Date().getDay(),
    date: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }

  //functin for setting the month, year and date
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var weekDays = ["Sunday", "Monday", "Tuseday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var days = [31, (((timeNow.year % 4 === 0) && (timeNow.year % 100 !== 0)) || (timeNow.year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  //Arrays with info for the calendar*/
  var startDay;
  var daysInMonth;

  //The function that changes month
    function setDate(number){
      if((number < 0) && (curr.month === 0)){
        curr.month = 11;
        curr.year--;
      }else if((number > 0) && (curr.month === 11)){
        curr.month = 0;
        curr.year++;
      }else if(number > 0){
        curr.month++;
      }else if(number < 0){
        curr.month--;
      }
      date = new Date(curr.year, curr.month, 1);
      setCal = {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        day: date.getDay()
      }
    }

  //function that renders in the days to the calendar
    function getStartDay(){
      daysInMonth = days[setCal.month];
      startDay = setCal.day - 1;
    }

  //Render the table data to the rows
  var monthDays = [];
    function renderDays(){
      if(calendarId.rows.length > 0){
        var rowLength = calendarId.rows.length;
        for(let c = 0; c < rowLength; c++){
            calendarId.deleteRow(0);
        }
      }
      monthDays = [];
      var daysMonth = [31, (((setCal.year % 4 === 0) && (setCal.year % 100 !== 0)) || (setCal.year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var monthThisDay = ((setCal.day - 1) >= 0) ? (setCal.day - 1) : 6;
      var monthThisDate = 1;

      for(let i = 0; i < daysMonth[setCal.month]; i++){
        monthDays[i] = {year: setCal.year, month: setCal.month, date: monthThisDate, day: monthThisDay};
        ++monthThisDate;
        if(monthThisDay === 6){
          monthThisDay = 0;
        }else{
          ++monthThisDay;
        }
      }
      var z = 0;
      var countRows = 0;
      var countDays = 0;

      while(countDays <= monthDays.length){
        var row = calendarId.insertRow(countRows);
        //console.log("row: " + countRows);
        for(let i = 0; i < 7; i++){
          var cell = row.insertCell(i);
          if((countDays === 0) && monthDays[0].day === i){
            ++countDays;
            cell.className = "calendarThis";
            if((countDays === timeNow.date) && (monthDays[countDays].month === timeNow.month) && (monthDays[countDays].year === timeNow.year)){
              cell.className = "calendarToday";
            }
            cell.innerText = countDays;
            ++countDays;
            ++z;
          //  console.log("z: " + z);
          }else if((countDays <= monthDays.length) && countDays > 0){
            cell.className = "calendarThis";
            if((countDays === timeNow.date) && (monthDays[countDays].month === timeNow.month) && (monthDays[countDays].year === timeNow.year)){
              cell.className = "calendarToday";
            }
            cell.innerText = countDays;
            ++countDays;
          }else{
            cell.className = "calendarThis";
          }
        }
        //console.log("days: " + countDays);
        ++countRows;
      }
    }

  //functions that does everything when button is pushed
    function nextMonth(){
      setDate(1);
      getStartDay();
      renderDays();
      calendarMonthAndYear.innerText = months[setCal.month] + " " + setCal.year;
    }
    function lastMonth(){
      setDate(-1);
      getStartDay();
      renderDays();
      calendarMonthAndYear.innerText = months[setCal.month] + " " + setCal.year;
    }
  var lastMonthButton = document.getElementById('lastMonth');
  var nextMonthButton = document.getElementById('nextMonth');
    lastMonthButton.addEventListener('click', lastMonth);
    nextMonthButton.addEventListener('click', nextMonth);

  //Toggle from month to week
  var weekThisWeek;
  var weekThisMonth = timeNow.month;
  var weekThisYear = timeNow.year;
  var weekThisMonday = timeNow.date - (timeNow.day - 1);
  var tmp = [];
  //Changing the months when the calendar is in week mode
    function renderWeek(num){
      var daysThisWeek = [31, (((weekThisYear % 4 === 0) && (weekThisYear % 100 !== 0)) || (weekThisYear % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if(calendarId.rows.length > 0){
        var rowLength = calendarId.rows.length;
        for(let c = 0; c < rowLength; c++){
          calendarId.deleteRow(0);
        }
      }
      var row = calendarId.insertRow(0);
      if(num > 0){
        weekThisMonday = weekThisMonday + 1;
        console.log('used');
      }else if(num < 0){
        weekThisMonday = weekThisMonday - 13;
        console.log('used');
      }
      for(let i = 0; i < 7; i++){
        if(i !== 6){
          if((weekThisMonday > daysThisWeek[weekThisMonth]) && ((weekThisMonth + 1) > 11)){
            ++weekThisYear;
            weekThisMonth = 0;
            weekThisMonday = 1;
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
            ++weekThisMonday;
          }else if((weekThisMonday > daysThisWeek[weekThisMonth]) && ((weekThisMonth + 1) <= 11)){
            ++weekThisMonth;
            weekThisMonday = 1;
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
            ++weekThisMonday;
          }else if(((weekThisMonday + i) < 1) && ((weekThisMonth - 1) < 0)){
            --weekThisYear;
            weekThisMonth = 11;
            weekThisMonday = daysThisWeek[weekThisMonth] + weekThisMonday;
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
            ++weekThisMonday;
          }else if((weekThisMonday < 1) && ((weekThisMonth - 1) >= 0)){
            --weekThisMonth;
            weekThisMonday = daysThisWeek[weekThisMonth] + weekThisMonday;
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
            ++weekThisMonday;
          }else{
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
            ++weekThisMonday;
          }
        }else{
          if((weekThisMonday > daysThisWeek[weekThisMonth]) && ((weekThisMonth + 1) > 11)){
            ++weekThisYear;
            weekThisMonth = 0;
            weekThisMonday = 1;
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
          }else if((weekThisMonday > daysThisWeek[weekThisMonth]) && ((weekThisMonth + 1) <= 11)){
            ++weekThisMonth;
            weekThisMonday = 1;
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
          }else if(((weekThisMonday + i) < 1) && ((weekThisMonth - 1) < 0)){
            --weekThisYear;
            weekThisMonth = 11;
            weekThisMonday = daysThisWeek[weekThisMonth] + weekThisMonday;
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
          }else if((weekThisMonday < 1) && ((weekThisMonth - 1) >= 0)){
            --weekThisMonth;
            weekThisMonday = daysThisWeek[weekThisMonth] + weekThisMonday;
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
          }else{
            tmp[i] = {year: weekThisYear, month: weekThisMonth, date: weekThisMonday, day: ((i+1) < 7) ? (i+1) : 0};
          }
        }
      }
        for(let i = 0; i < 7; i++){
          var cell = row.insertCell(i);
          cell.innerText = tmp[i].date;
          cell.className = "calendarThis";
          if((tmp[i].date === timeNow.date) && (tmp[i].month === timeNow.month) && (tmp[i].year === timeNow.year)){
            cell.className = "calendarToday";
          }
        }
    }
  //Calculate week
    function getWeek(){
      var days = [31, (((timeNow.year % 4 === 0) && (timeNow.year % 100 !== 0)) || (timeNow.year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var yearStart = {
        2000: 2,
        2001: 0,
        2002: -1,
        2003: -2,
        2004: -3,
        2005: 2,
        2006: 1,
        2007: 0,
        2008: -1,
        2009: -2,
        2010: 3,
        2011: 2,
        2012: 1,
        2013: -1,
        2014: -2,
        2015: -3,
        2016: 3,
        2017: 1,
        2018: 0,
        2019: -1,
        2020: -2,
        2021: 3,
        2022: 2,
        2023: 1,
        2024: 0,
        2025: -2,
        2026: -3,
        2027: 3,
        2028: 2,
        2029: 0,
        2030: -1
      };
      var daysTillNow = 0;
      for(let i = 0; i < tmp[0].month; i++){
        daysTillNow += days[i];
      }
      daysTillNow += (tmp[0].date) - yearStart[tmp[0].year];
      weekThisWeek = Math.floor((daysTillNow / 7) + 1);
      calendarMonth.innerText = weekThisWeek + " " ;
    }
  //Change week
    function nextWeek(){
      renderWeek(1);
      getWeek();
    }
    function lastWeek(){
      renderWeek(-1);
      getWeek();
    }
    function changeView(){
      if(weekOrMonth === 1){
        weekOrMonth = 0;
        lastMonthButton.removeEventListener('click', lastWeek);
        nextMonthButton.removeEventListener('click', lastWeek);
        lastMonthButton.addEventListener('click', lastMonth);
        nextMonthButton.addEventListener('click', lastMonth);
        setDate(0);
        getStartDay();
        renderDays();
        calendarMonthAndYear.innerText = months[setCal.month] + " " + setCal.year;
      }else{
        weekOrMonth = 1;
        lastMonthButton.removeEventListener('click', lastMonth);
        nextMonthButton.removeEventListener('click', nextMonth);
        lastMonthButton.addEventListener('click', lastWeek);
        nextMonthButton.addEventListener('click', nextWeek);
        renderWeek(0);
        getWeek();
      }
    }
  var toggleWeek = document.getElementById('toggleWeek');
  toggleWeek.addEventListener('click', changeView);

    window.onload = (function(){
      setDate(0);
      getStartDay();
      renderDays();
      calendarMonthAndYear.innerText = months[setCal.month] + " " + setCal.year;
      tmp = [];
    }());
