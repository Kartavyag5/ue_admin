import React from "react";
import styles from './form.module.css'
import Input from "../Input/Input";
import SingleSelect from "../select/SingleSelect";
import Button from "../button/Button"

interface formProps {
  column1: any;
  column2?:any;
  buttonProps:any;
  layout?:number;
  buttonCenter?: boolean,
  defaultValues?:any,
  handleFormData?:(data)=>void
}

const FormController2 = ({handleFormData, defaultValues={}, column1, column2=[],  buttonProps, layout=1, buttonCenter=false} :formProps) => {
   
  const [state, setstate] = React.useState(defaultValues);

  React.useEffect(() => {        
   setstate({...state, ...defaultValues})   
  }, [defaultValues])
    
  const handleSubmit = (e) => {
    e.preventDefault();    
    handleFormData(state)    
  }

  return (
    <form onSubmit={handleSubmit}>
      <div >
        <div className={styles.row}>

          <div className={`${layout === 2 ? styles.column : styles.column1}`}>
            {column1.map((item:any, index:any) => (
              <div className={`${styles.flex_row} ${styles.mb_1}`} key={index}>
                
                <label className={`${styles.form_label} ${styles.flex_30} ${styles.m_auto}`}> {item.label}  </label> 
                
                {(typeof item.column !== 'undefined' && item.column.length !==0 &&
                item.column.map((newItem, index) => (

               
                  <div key={index} className={`${styles.m_auto} ${ item.column.length === 2  ? styles.flex_35 : styles.flex_70}  ${styles.ml_2}`}> 
                    
                    {newItem.inputType === "select" && 
                      
                      <SingleSelect 
                        defaultValue={state[newItem.name]}
                        onChange={(item) => {setstate({...state, [newItem.name]:item.value}); newItem.onChange(item);  }}
                        searchable={newItem.searchable}  
                        list={newItem.options} 
                        title={newItem.title}
                        readOnly={newItem.readOnly} 
                        setSearchText = {newItem.setSearchText}
                        loadOptionListOnScroll = {newItem.handleScroll}
                        noOptionText={'No data found'}
                      />  
                      
                      ||
                      
                      <Input  value={state[newItem.name]} onChange={(value) => setstate({...state, [newItem.name]:value})} readOnly={newItem.readOnly} id={newItem.id} /> 
                    }
                    
                  </div>
                
                
                )))}
                    
              </div>
            ))}
          </div>

          {layout === 2 && 
            <div className={`${layout === 2 ? styles.column : styles.column1}`}>
              {column2.map((item:any, index:any) => (
                <div className={`${styles.flex_row} ${styles.mb_1}`} key={index}>
                  
                  <label className={`${styles.form_label} ${styles.flex_30} ${styles.m_auto}`}> {item.label}  </label> 
                  
                  {(typeof item.column !== 'undefined' && item.column.length !==0 &&
                  item.column.map((newItem, index) => (

                 
                    <div key={index} className={`${styles.m_auto} ${ item.column.length === 2  ? styles.flex_35 : styles.flex_70}  ${styles.ml_2}`}> 
                      
                      {newItem.inputType === "select" && 
                        
                        <SingleSelect 
                          defaultValue={state[newItem.name]}
                          onChange={(item) => {setstate({...state, [newItem.name]:item.value}); newItem.onChange(item); }}
                          searchable={newItem.searchable}  
                          list={newItem.options} 
                          title={newItem.title}
                          readOnly={newItem.readOnly} 
                          setSearchText = {newItem.setSearchText}
                          loadOptionListOnScroll = {newItem.handleScroll}
                          noOptionText={'No data found'}
                        />  
                        
                        ||
                        
                        <Input  value={state[newItem.name]} onChange={(value) => setstate({...state, [newItem.name]:value})} readOnly={newItem.readOnly} id={newItem.id} /> 
                      }
                      
                    </div>
                  
                  
                  )))}
                      
                </div>
              ))}
            </div>
          
          }
          
        </div>
       
      </div>

      <div className={`${styles.flex_row} ${styles.btn_form_group} ${buttonCenter ? styles.button_center :''} `}>
        {buttonProps.map((item:any, index:any) => (
          <div className={styles.form_btn} key={index}>
            <Button handleButtonClick={item.handleButtonClick}  ButtonText={item.value} type={item.type} />
          </div>
        ))}
      </div>

    </form>
  )
}

export default FormController2;
