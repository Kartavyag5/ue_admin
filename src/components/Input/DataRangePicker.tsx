import React from "react"
import Styles from './Input.module.css'

interface dateFieldProps {
  handleChange: (val: any) => void;
  placeholder?: string;
  name?: string;
  defaultStartdate?:any;
  defaultEnddate?:any

}

const DateRangePicker = ({handleChange, defaultStartdate, defaultEnddate}:dateFieldProps) => {
  const [state, setState] = React.useState({startDate:defaultStartdate, endDate:defaultEnddate});

  const handleDateChange = (e:any, type:string) => {
    if(type === 'start') setState({...state, startDate:e.target.value})
    else setState({...state, endDate:e.target.value})

    handleChange(state);
  }

  return (
    <div>
      <input type="date" 
        className={ `${Styles.daterangeInput} `}
        onChange={(e)=>handleDateChange(e, 'start')} 
        value={state.startDate}

      />
       <input type="date" 
        className={ `${Styles.daterangeInput} `}
        onChange={(e)=>handleDateChange(e, 'end')} 
        value={state.endDate}
        min={state.startDate}
      />
    </div>
  )
}

export default React.memo(DateRangePicker)