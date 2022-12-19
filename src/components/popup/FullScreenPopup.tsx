import React from "react";
import styles from  './style.module.css';
import Button from "../button/Button";

interface props {
  bodyText:any;
  subText?: string;
  toggle?: () => void;
  confirmBtnText?: string;
  cancelBtnText?: string;
  onConfirm?:() => void;
  onCancel?: ()=> void,
  confirmBtn?: boolean,
  cancelBtn? : boolean
}
class FullScreenPopup  extends React.PureComponent < props >   {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.getElementById('cr-sidebar').style.zIndex = '1';
  }

  render() {
    const { bodyText, subText,  toggle, confirmBtnText, cancelBtnText, onConfirm, onCancel, confirmBtn=true, cancelBtn=true } = this.props;
    
    return (
      <div>
        <div className={styles.overlay} >
          <div className={styles.content}>

            <h3 className={styles.bodyText}>
              
              {typeof bodyText !== 'string' && bodyText.length > 0 &&

                bodyText.map((item, index) => (
                  <div  key= {index} className={styles.bodyItem}> {item.split('_').join(' ')} </div>
                ))
              }
            

              {typeof bodyText === 'string' && bodyText}

              </h3>
            {subText !=='' && <h3 className={styles.bodyText}>{subText}</h3>}

            <div className={styles.popup_btns}>
              {/* { confirmBtn && <button className={styles.confirmBtn} onClick={onConfirm}>{confirmBtnText || 'Yes'}</button> } */}
              <div >
                { confirmBtn && <Button handleButtonClick={onConfirm} ButtonText = {confirmBtnText || 'Yes'}/>}
              </div>
              <div style={{marginLeft:"1rem"}}>
              {/* { cancelBtn && <button className={styles.confirmBtn} onClick={onCancel}>{cancelBtnText || 'No'}</button> } */}
               { cancelBtn && <Button handleButtonClick={onCancel} ButtonText = {cancelBtnText || 'No'}/>}
              </div>

            </div>
           
          </div>
        </div>
      </div>
    )
  }
  
}

export default React.memo(FullScreenPopup);