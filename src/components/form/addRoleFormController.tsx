import React, { useEffect, useRef, useState } from "react";
import styles from './form.module.css'
import Input from "../Input/Input";
import Button from "../button/Button"
import AddRolePopup from "../popup/addRolePopup";
import ErrorPopup from "../popup/ErrorPopup";
import Constants from "../../lib/Constants";


const AddRoleFormController = (props) => {

  let confirmBtnText = "Apply"
  const [isOpen, setIsOpen] = React.useState(false);
  const [roleData, setRoleData] = React.useState([])
  const [errorData, setErrorData] = useState<errorData>({
    state: false,
    message: "",
    alertType:1,
  });

  let roleIndex = useRef()


  useEffect(() => {
    typeof props.value !== "undefined" &&
      setRoleData([...props.value])
  }, []);

  //handle role change
  const handleRoleData = (data) => {

    if ((roleData.find(role => role.community_id === data.community_id)) !== undefined) {
      setErrorData({ state: true, message: "A person may have only one role within a community" });  //error popup to show if a person has more role within a community    
    }
    else {
      setRoleData([...roleData, data])
      props.onChange([...roleData, data])
    }
  }

  //handle role deletion
  const handleDelete = (i, e) => {
    e.preventDefault()
    setErrorData({ state: true, message: Constants.deleteAlertMsg.message, alertType:4 }); 
    roleIndex.current = i; 
  }

  const handleDeleteRole = () => {
    setErrorData({ state: false, message: "" })
    let newData = roleData.filter((item, index) => index !== roleIndex.current)
    setRoleData(newData)
    props.onChange(newData)  }

  

  const handleButtonClick = () => {
    setIsOpen(true)
  }

  return (
    <div className={`${styles.add_role_section} ${styles.flex_col}`}>
      <div className={`${styles.align_end}`}>
        <Button handleButtonClick={handleButtonClick} ButtonText="Add Role" />
      </div>
      <div className={`${styles.mt_1} ${styles.scrollList}`}>

        {(roleData !== undefined) && roleData.map((data, index) => (
          
          <div key={index} className={`${styles.flex_row} ${styles.row_gap}`}>
            <div style={{paddingRight:"1rem"}}><Input value={data.organization_name} readOnly={true} /> </div>
            <div style={{paddingRight:"1rem"}}> <Input value={data.community_name} readOnly={true} /> </div>
            <div style={{paddingRight:"1rem"}}> <Input value={data.role_name} readOnly={true} /> </div>
            {(data.first_name && data.last_name )&& <div style={{paddingRight:"1rem"}} > <Input value={`${data.first_name}  ${data.last_name}`} readOnly={true} /> </div>}
            <div className={` ${styles.align_center}`} style={{marginLeft:"auto"}}> <button onClick={(e) => handleDelete(index, e)} className={styles.del_role_btn}>-</button> </div>
          </div>
        ))}

      </div>
      {isOpen && <AddRolePopup handleRoleData={handleRoleData} confirmBtnText={confirmBtnText} toggle={() => setIsOpen(false)} />}
      {errorData.state && (
        <ErrorPopup
        toggle={() => setErrorData({ state: false, message: "" })}
        bodyText={errorData.message}
        headerText={errorData.alertType === 4 ? "Alert" : "Error"}
        handleDeleteRecord={handleDeleteRole}
        cancelBtn = {errorData.alertType === 4 && true}
        alertType = {errorData.alertType}
        confirmBtnText ={errorData.alertType === 4 && "Yes"}
      />
      )}
    </div>
  )
}

export default AddRoleFormController;
