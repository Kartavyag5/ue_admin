export const getGMTTimeStamp = ({ date }) => {
  if (new Date(date).getTimezoneOffset() >= 0) {
    
    return new Date(
      new Date(date).getTime() + new Date(date).getTimezoneOffset() * 60000
    ).getTime();
  } else {
    return new Date(
      new Date(date).getTime() - new Date(date).getTimezoneOffset() * 60000
    ).getTime();
  }
};


export const getCommunityTimeZone  = ({date, offset}) => {  
  const newDate = new Date(date.replace(/ /g, "T"));
  return (new Date(newDate).getTime() + parseInt(offset) * 60 * 60000)
}


export const subtractTimezoneOffset = (GMTDate,date) => {

  if (new Date(date).getTimezoneOffset() >= 0) {
    return(GMTDate - (new Date(date).getTimezoneOffset()*6000))
  }
  else {
    return(GMTDate + (new Date(date).getTimezoneOffset()*6000))

  }
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-Us')
}

export const formatTime = (time) => {
  return new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

