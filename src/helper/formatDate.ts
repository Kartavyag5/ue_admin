export const formatDate = (date) => {
  let d = new Date(date), 
      month = '' + (d.getMonth() + 1), 
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [month,day, year].join('/');
}

export const formatTime = (date) => {
  let d = new Date(date), 
      hour = '' + d.getHours(), 
      minute = '' + d.getMinutes(),
      seconds = '' + d.getSeconds();

  if (minute.length < 2) 
      minute = '0' + minute;
  if  (seconds.length < 2) 
      seconds = '0' +  seconds;    


  return [hour, minute, seconds].join(':');
}