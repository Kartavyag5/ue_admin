import React, { useState } from "react";
import Input from '../Input/Input'
import styles from './puzzle.module.css'

interface wordprop {
  data:Array<{order:any, word:any}>
}
const PuzzleWords = ({column1, column2, ...props}) => {
  const [state, setstate] = useState<wordprop>(column1.concat(column2))  

  const handleChange = (order, value) => {
      let clonedState = JSON.parse(JSON.stringify(state));

      let item = clonedState.find(item => item.order === order)
      let index = clonedState.findIndex(item => item.order === order)

      item.order = order;
      item.word = value.trim();
      clonedState[index] = item;      
      setstate(clonedState);
      props.onChange(clonedState)
  }
  
  return (
    
    <div className={styles.row}>
      <div className={styles.column}>
        {column1.length && column1.map(({order, word, readOnly=false}, index) => (
          <div className={`${styles.flex_row} ${styles.mb_1}`} key={index}>
          <label className={`${styles.form_label} ${styles.flex_30} ${styles.m_auto}`}>{order === 1 ?  `Word ${order}*` : `Word ${order}`} </label>
          <div className={`${styles.m_auto} ${styles.flex_35}  ${styles.ml_2}`}> 
            <Input tabindex={order} value={word} onChange={(value)=> handleChange(order,value)} readOnly={readOnly} /> 
          </div>
          </div>
        ))}
      </div>

      <div className={styles.column}>
        {column2.length &&  column2.map(({order, word, readOnly=false}, index) => (
          <div className={`${styles.flex_row} ${styles.mb_1}`} key={index}>
            <label className={`${styles.form_label} ${styles.flex_30} ${styles.m_auto}`}>{order === 1 ?  `Word ${order}*` : `Word ${order}`}</label>
            <div className={`${styles.m_auto} ${styles.flex_35}  ${styles.ml_2}`}> 
              <Input tabindex={order} value={word} onChange={(value)=> handleChange(order,value) } readOnly={readOnly} /> 
            </div>
          </div>
        ))}
      </div>
    
    </div>

   
  )
}

export default PuzzleWords;