import React, { useState } from "react";
import styles from './form.module.css'
import { useForm, Controller,  useFormState } from "react-hook-form";
import Input from "../Input/Input";
import SingleSelect from "../select/SingleSelect";
import Button from "../button/Button"
import Datepicker from "../Input/DatePicker";
import AddRoleFormController from "./addRoleFormController";
import PuzzleWords from "../puzzle/PuzzleWords";
import { useRouter } from 'next/router';
import { getDetail} from "../../services/cognito";

interface IFormInput {
  column2: any
}

interface formProps {
  column1: any;
  column2?: any;
  handleFormData?: (data: any) => void;
  buttonProps?: any;
  layout?: number;
  isAddRole?: boolean;
  defaultRoleData?: any;
  buttonCenter?: boolean;
  puzzleWords?: boolean;
  puzzleWordData?: any;
  defaultData?: any;
  isFormDirty?: (dirtyFields: boolean) => void;
  isAttendance?:boolean
}

const FormController = ({ column1, column2 = [], buttonProps, isAddRole, isFormDirty, defaultRoleData, layout = 1, buttonCenter = false, puzzleWords = false, puzzleWordData = {} }: formProps) => {

  const [defaultFormData, setDefaultFormData] = useState({})
  const { control, handleSubmit, reset } = useForm({ defaultValues: defaultFormData });
  const { dirtyFields } = useFormState({
    control
  });
  const router = useRouter();
  const gameScheduleId = router.query.gameScheduleId;
  const [hostRole, setHostRoles] = React.useState("");
  const [hostCommId, setHostCommId] = useState<any>([]);
  const handleHostRole = async() => {
    const res = await getDetail();
    setHostRoles(res.role.GAME_HOST);
    setHostCommId(res);
  }
  const isFamilyOrResident = hostCommId?.role?.RESIDENT || hostCommId?.role?.FAMILY_OR_FRIEND
  const SUPER_ADMIN = hostCommId?.role?.SUPER_ADMIN
  const UE_CORP_ADMIN = hostCommId?.role?.UE_CORP_ADMIN
  const ORGANIZATION_ADMIN = hostCommId?.role?.ORGANIZATION_ADMIN
  const COMMUNITY_ADMIN = hostCommId?.role?.COMMUNITY_ADMIN
  const GAME_HOST = hostCommId?.role?.GAME_HOST

  // const onSubmit: SubmitHandler<IFormInput> = data => {
  //   handleFormData(data)


  // } ;


  React.useEffect(() => {    
    getDefaultFormData();
    handleHostRole();
  }, [])

  React.useEffect(() => {    
    if (defaultFormData)
      reset(defaultFormData) // update default value
  }, [defaultFormData])


  const getDefaultData = (options) => {

    let defaultValue:any = {};
    let role = defaultRoleData && "user_comm_role"
    options.map((filterList) => {
      filterList.column.map((filterItem) => {
        if (filterItem.inputType === "select") {
          let dropDownName = filterItem.name;
          defaultValue = { ...defaultValue, [dropDownName]: filterItem.options.find((item) => item.value === parseInt(filterItem.defaultValue)) }
        }
        else {
          let textFiledName = filterItem.name
          defaultValue = { ...defaultValue, [textFiledName]: filterItem.defaultValue }
        }
      })
    })
    defaultRoleData ? setDefaultFormData({ ...defaultValue, [role]: defaultRoleData }) : setDefaultFormData({ ...defaultValue })
    
  }

  const getDefaultFormData = () => {
    // console.group("CLALELLLLLL----------")
    getDefaultData([...column1, ...column2])
  }

  return (
    <form >
      <div >
        <div className={styles.row}>

          <div className={`${layout === 2 ? styles.column : styles.column1}`}>
            {column1.map((item: any, index: any) => (
              <div className={`${styles.flex_row} ${styles.mb_1}`} key={index}>
                <label className={`${styles.form_label} ${styles.flex_30} ${styles.m_auto}`} style = {{color : `${item.isGrayOut ? item.isGrayOut === true ? 'grey' : '' : ''}`}}> {item.label}  </label>

                {(typeof item.column !== 'undefined' && item.column.length !== 0 &&
                  item.column.map((newItem, index) => (

                    <Controller
                      key={index}
                      name={newItem.name}
                      defaultValue={newItem.defaultValue}
                      control={control}
                      render={({ field }) =>
                        <div className={`${styles.m_auto} ${item.column.length === 2 ? styles.flex_35 : styles.flex_70}  ${styles.ml_2} ${newItem.inputType === "link" && styles.link}`}>



                          {newItem.inputType === "select" &&

                            <SingleSelect
                              {...field}
                              handleChange={newItem.handleChange}
                              defaultValue={newItem.defaultValue}
                              searchable={newItem.searchable}
                              list={newItem.options}
                              title={newItem.title}
                              readOnly={newItem.readOnly}
                              setSearchText={newItem.setSearchText}
                              loadOptionListOnScroll={newItem.handleScroll}
                              noOptionText={'No data found'}
                              resetSelection={newItem.resetSelection}
                              changeResetflag={newItem.changeResetflag}
                              handleToggle={newItem.handleToggle ? (isOpen) => newItem.handleToggle(isOpen) : null}
                            />
                            ||

                            newItem.inputType === "date" &&

                            <Datepicker showTime={newItem.showTime} defaultValue={newItem.defaultValue} {...field}  isDateRange={newItem.isDateRange} />

                            ||

                            newItem.name === "join_link" && isFamilyOrResident && <a href={newItem.defaultValue} target = "_blank" rel="noreferrer"> {newItem.defaultValue == undefined ? "No Link" : newItem.defaultValue} </a> ||

                            newItem.inputType === "checkBox" &&

                            <Input   {...field} checked = {newItem.checked && newItem.checked} onChange = {newItem.handleChange}  type={newItem.inputType} textarea={newItem.textarea} value={newItem.defaultValue} readOnly={newItem.readOnly} id={newItem.id} handleOnBlur={newItem.handleOnBlur} /> ||
                            newItem.name === "first_name" && <Input {...field} value={newItem.defaultValue} type={newItem.inputType} readOnly={newItem.readOnly} id={newItem.id} /> ||
                            newItem.name === "last_name" && <Input {...field} value={newItem.defaultValue} type={newItem.inputType} readOnly={newItem.readOnly} id={newItem.id} /> ||
                            newItem.name === "email_id" && <Input {...field} value={newItem.defaultValue} type={newItem.inputType} readOnly={newItem.readOnly} id={newItem.id} /> ||
                            newItem.name === "birth_year" && <Input {...field} value={newItem.defaultValue} type={newItem.inputType} readOnly={newItem.readOnly} id={newItem.id} /> ||
			    newItem.name === "join_link" && <Input {...field} value={newItem.defaultValue} type={newItem.inputType} onChange = {newItem.handleChange} readOnly={newItem.readOnly} id={newItem.id} /> ||
                            <Input {...field} value={newItem.defaultValue}  type={newItem.inputType} readOnly={newItem.readOnly} id={newItem.id}/>

                          }
                        </div>
                      }
                    />
                  )))}

              </div>
            ))}
          </div>

          {layout === 2 &&
            <div className={`${layout === 2 ? styles.column : styles.column1}`}>
              {column2.map((item: any, index: any) => (
                <div className={`${styles.flex_row} ${styles.mb_1}`} key={index}>

                  <label className={`${styles.form_label} ${styles.flex_30} ${styles.m_auto}`}> {item.label}  </label>

                  {(typeof item.column !== 'undefined' && item.column.length !== 0 &&
                    item.column.map((newItem, index) => (

                      <Controller
                        key={index}
                        name={newItem.name}
                        defaultValue={newItem.defaultValue}
                        control={control}
                        render={({ field }) =>
                          <div className={`${styles.m_auto} ${item.column.length === 2 ? styles.flex_35 : styles.flex_70}  ${styles.ml_2}`}>

                            {newItem.inputType === "select" &&

                              <SingleSelect
                                {...field}
                                handleChange={newItem.handleChange}
                                defaultValue={newItem.defaultValue}
                                searchable={newItem.searchable}
                                list={newItem.options}
                                title={newItem.title}
                                readOnly={newItem.readOnly}
                                setSearchText={newItem.setSearchText}
                                loadOptionListOnScroll={newItem.handleScroll}
                                noOptionText={'No data found'}
                                resetSelection={newItem.resetSelection}
                                changeResetflag={newItem.changeResetflag}
                                handleToggle={newItem.handleToggle ? (isOpen) => newItem.handleToggle(isOpen) : null}
                              />

                              ||

                              newItem.inputType === "date" &&

                              <Datepicker defaultValue={newItem.defaultValue}  {...field}  isDateRange={newItem.isDateRange}/>

                              ||

                              newItem.inputType === "button" &&

                              <div className={styles.btn}>
                                <Button handleButtonClick={newItem.handleButtonClick} ButtonText={newItem.name} disabled={newItem.isDisabled}/>
                              </div>

                              ||


                              <Input {...field} value={newItem.defaultValue} type={newItem.inputType} readOnly={newItem.readOnly} id={newItem.id} />


                            }



                          </div>

                        }
                      />

                    )))}


                </div>
              ))}
            </div>

          }

          {puzzleWords &&

            <Controller
              name={'words'}
              defaultValue={[]}
              control={control}
              render={({ field }) =>
                <PuzzleWords  {...field} column1={puzzleWordData.column1} column2={puzzleWordData.column2} />
              }
            />

          }

          {/* TODO:approach need to be changed */}
          {(Object.keys(dirtyFields).length !== 0) ? (isFormDirty && isFormDirty(true)) : (isFormDirty && isFormDirty(false))}

        </div>



      </div>

      {isAddRole &&
        <div>
          <Controller
            name="user_comm_role"
            defaultValue={defaultRoleData}
            control={control}
            render={({ field }) =>
              <div>
                <AddRoleFormController {...field} />
              </div>
            }
          />

        </div>


      }

      <div className={`${styles.flex_row} ${styles.btn_form_group} ${buttonCenter ? styles.button_center : ''} `}>
        {typeof buttonProps !== 'undefined' && buttonProps.map((item: any, index: any) => (
          <div className={styles.form_btn} key={index}>
            {
            SUPER_ADMIN === true || GAME_HOST === true || COMMUNITY_ADMIN === true || ORGANIZATION_ADMIN === true || UE_CORP_ADMIN === true
            ? <Button isJoiningWords={item.isJoiningWords} disabled = {item.isDisabled ? item.isDisabled : false} handleButtonClick={item.type === 'submit' ? handleSubmit(item.handleButtonClick) : item.handleButtonClick} ButtonText={item.value} type={item.type} />
            : 
            <Button isJoiningWords={item.isJoiningWords} disabled = {true} handleButtonClick={item.type === 'submit' ? handleSubmit(item.handleButtonClick) : item.handleButtonClick} ButtonText={item.value} type={item.type} />
            }
            
          </div>
        ))}
      </div>
 
     <p style={{marginLeft:"2.5rem"}}>* Required field</p>
    </form>
  )
}

export default FormController;
