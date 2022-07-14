
const dateToday = () =>  {

  let today = new Date();
  let currentDate = today.getDay();// day index
// let day = "";
// var day = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 
  // https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }

  return today.toLocaleDateString("en-us", options);
};

const dayToday = () => {

  let today = new Date();
  let currentDate = today.getDay();// day index

  // https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript
  let options = {
    weekday: "long",
  }

  return  today.toLocaleDateString("en-us", options);
};

module.exports = {
  dateToday,
  dayToday


}



