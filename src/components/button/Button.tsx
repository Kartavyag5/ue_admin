import React, { useEffect } from "react";
import styles from './button.module.css'

interface ButtonProps {
  ButtonText:string;
  handleButtonClick?: ( event:any ) => void;
  disabled?:boolean;
  type?:any;
  linkStyle?:boolean;
  isJoiningWords?:boolean
}

const Button = ({ButtonText, handleButtonClick, disabled, type="button", isJoiningWords, linkStyle=false}:ButtonProps) => {
  const [isdisabled, setIsDisabled] = React.useState(disabled)
  const OnButtonHandler = (evt) => {
    type !== 'submit' &&  handleButtonClick(evt)
    setIsDisabled(true);

    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  }

  useEffect(()=> {
    setIsDisabled(disabled)
  }, [disabled])

  return (
    <div>
      <button style={isJoiningWords && {textTransform:"none"}} className={`${styles.button}  ${isdisabled ? styles.disabled : '' } ${linkStyle ? styles.linkStyle : ''}`} type={type} onClick={handleButtonClick} disabled={isdisabled}>
        <span>{ButtonText }</span>
      </button>
    </div>
  )
}

export default Button