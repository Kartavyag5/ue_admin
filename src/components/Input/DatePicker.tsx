import React, { useEffect, useRef } from "react"
import Styles from './Input.module.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {addDays, isMatch, subDays}  from "date-fns";
import ErrorPopup from "../popup/ErrorPopup";


interface dateFieldProps {
  onChange: (val: any) => void;
  placeholder?: string;
  name?: string;
  defaultValue?: any
  showTime?: boolean
  isDateRange?:boolean
}

const DatePickerComponent = ({ onChange, defaultValue, name = '', ...props }: dateFieldProps) => {

  const [state, setstate] = React.useState<Date>();
  const [isOpen, setOpen] = React.useState(false)
  const [errorData, setErrorData] = React.useState({
    state: false,
    message: "",
  });


  React.useEffect(() => {
    if (typeof defaultValue !== 'undefined' && defaultValue !== '') {
      setstate(new Date(defaultValue));
    }
  }, [defaultValue])

  const openDatePicker = () => { // function to open datepicker    
    setOpen(!isOpen)
  }

  const validateDate = ({ target: { value } }) => {        
    if(value && !isMatch(value,'MM/dd/yyyy')){
      setErrorData({state:true,message:"Please Enter a valid Date"})
      setstate(null)
    }
  }

  const validateDateTime = ({ target: { value } }) => {        
    if(value && !isMatch(value,'MM/dd/yyyy    h:mm aa')){
      setErrorData({state:true,message:"Please Enter a valid Date"})
      setstate(null)
    }
  }


  return (
    <div className={`${Styles.flex} ${Styles.date_picker}`}>
      {props.showTime ?
        <DatePicker
          selected={state}
          onChange={(date) => {onChange(date); setstate(date) }}
          showTimeInput
          dateFormat="MM/dd/yyyy    h:mm aa"
          onClickOutside={openDatePicker}
          open={isOpen}
          onBlur ={validateDateTime}
          // onCalendarOpen={openDatePicker}
          minDate={props.isDateRange ? null : subDays(new Date(), 1)}
          maxDate={props.isDateRange ? null : addDays(new Date(), 365)}

        /> :
        <DatePicker
          selected={state}
          onChange={(date,e) => {onChange(date); setstate(date) }}
          onClickOutside={openDatePicker}
          open={isOpen}
          onBlur={validateDate}
          onCalendarOpen={openDatePicker}
          minDate={props.isDateRange ? null : subDays(new Date(), 1)}
          maxDate={props.isDateRange ? null : addDays(new Date(), 365)}


        />
      }

      <span onClick={openDatePicker} >
        <div className="input-group-addon"></div>
      </span>
      {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
    </div>
  )
}

export default DatePickerComponent