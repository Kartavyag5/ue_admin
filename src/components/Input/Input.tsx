import React from "react"
import Styles from './Input.module.css'

type InputElement = HTMLInputElement | HTMLTextAreaElement;
type InputChangeEvent = React.ChangeEvent<InputElement>;

interface TextFieldProps {
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  name?: string;
  type?: 'email' | 'password' | 'text' | 'number' | 'tel' | 'checkbox' ;
  textarea?:boolean;
  className?:any;
  readOnly?:boolean,
  required?:boolean,
  id?:any,
  tabindex?:any,
  checked?: boolean
  handleOnBlur?:(val:string) => void;
}

const Input = React.forwardRef<InputElement, TextFieldProps>(({ onChange,tabindex, textarea = false, ...rest }, ref) => {
    const InputElement = textarea ? 'textarea' : 'input';
    const [state, setstate] = React.useState(rest.value)
    const [checked, setChecked] = React.useState(rest.checked ? rest.checked : false)
    
    // let inpufield = React.useRef(null)
    React.useEffect(() => {
     if(rest.value !==  'undefined') setstate(rest.value)  
             
    }, [rest.value])

    const handleCheckBoxChange = (e) => {       
      setChecked(e.target.checked) 
      if(e.target.checked === true){
        onChange('1') // Zoom
        setstate('1')
      }
      else {
        onChange('2') //No Zoom
        setstate('2')
      }
    }

    const handleInputChange = ({ target: { value } }: InputChangeEvent) => {
      onChange(value); 
      setstate(value);    
    }

  return (
    <InputElement 
      {...rest}
      ref={ref as any}
      required={rest.required}
      className={ `${rest.name === 'zoom' ? Styles.input_check: Styles.input} ${Styles.form_control}  ${textarea ? Styles.textArea : ''}`}
      onChange = {(e: any) => rest.name === 'zoom' ? handleCheckBoxChange(e): handleInputChange(e)}
      // onChange={({ target: { value } }: InputChangeEvent) => {onChange(value); setstate(value); console.log(value);
      // }}
      disabled={rest.readOnly}
      value={state}
      type={rest.type}
      tabIndex={tabindex}
      onBlur= {() =>rest.handleOnBlur && rest.handleOnBlur(state)}
      checked = {checked}
    />
  )

})

Input.displayName = 'Input';
export default Input;

