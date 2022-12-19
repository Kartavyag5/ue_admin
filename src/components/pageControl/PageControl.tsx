import React, { useEffect } from "react"
import Button from "../button/Button"
import Datepicker from "../Input/DatePicker"
import MultipleSelect from "../select/MultipleSelect"
import styles from './pageControl.module.css'

interface Props {
    pageHeading?: string,
    subHeading?: any,
    filterList?: any,
    showBackButton?: boolean,
    showTopButtonList?: boolean
    showBottomButtonList?: boolean,
    bottomButtonList?: any,
    topButtonList?: any,
    handleAplyButton?:()=>void,
    handleBackButton?:()=>void

}

const PageControl = (Props:Props) => {

    let { pageHeading,
        subHeading,
        filterList,
        showBackButton,
        showTopButtonList,
        showBottomButtonList,
        bottomButtonList,
        topButtonList,
        handleAplyButton,
        handleBackButton
    } = Props

    let buttonName = "Apply"


    return (
        <div >
            <section className="page-header">
                {pageHeading !== '' && <h3 className={`${styles.text_start} ${styles.bold} ${styles.font_1_4} ${styles.color_navy}`}>{pageHeading}</h3>
}
                {subHeading !== '' &&  <h3 className={`${styles.text_start} ${styles.bold} ${styles.font_1_4} ${styles.color_navy}`}>{subHeading}</h3> }
            </section>
            <section className="page-control">
                <div className={`${styles.flex_row} ${styles.mx_1}`}>
                    {showBackButton &&
                        <div >
                            {/* <button onClick={()=> handleBackButton()} className={styles.back_btn}>back</button> */}
                            <Button handleButtonClick={handleBackButton} ButtonText={'Back'} />

                        </div>}
                    {showTopButtonList &&
                        <div className={`${styles.flex_row} ${styles.ml_auto}`}>
                            {topButtonList.map((item, index) => (
                                <div key={index} className={`${styles.row} ${styles.center}`}>
                                    <Button disabled = {item.isDisabled ? item.isDisabled : false} handleButtonClick={item.handleButtonClick} ButtonText={item.name} />
                                </div>
                            ))}
                        </div>
                    }
                </div>
                <div className={`${styles.flex_row} ${styles.mx_1}`}>
                    <div className={styles.flex_row}>
                        {typeof filterList !== 'undefined' && filterList.map((item, index) => (
                            <div key={index} className={`${styles.flex_row} ${styles.row}`}>
                                {/* <div className={`${styles.row_1}  ${styles.center}`}>
                                    <p className={`${styles.bold} ${styles.m_0}`}>{item.label}</p>
                                </div> */}
                                <div className={`${styles.row_1} `}>
                                    <p className={`${styles.font_500} ${styles.m_0}`}>{item.label}</p>
                                    {item.type === "MultiSelectDropDown" &&
                                        <div className={styles.w_350}>
                                          <MultipleSelect 
                                            name={item.name} 
                                            title={item.title} 
                                            list={item.optionsList}
                                            defaultValue={item.defaultValues}
                                            searchable={[typeof item.searchText  !== 'undefined' ? item.searchText : ""]}
                                            onChange={item.handleChange}
                                            noOptionText={item.noOptionText}
                                            setSearchText={item.handleSearch}
                                            loadOptionListOnScroll={item.handleScroll}
                                            handleToggle={item.handleToggle ? (isOpen) => item.handleToggle(isOpen) : null } />
                                        </div>
                                    }

                                {item.type === "date" && 
                                    <div className={styles.w_350}>
                                        <Datepicker name={item.name} onChange={item.handleChange} isDateRange={item.isDateRange} /> 
                                    </div>
                                }

                                </div>
                            </div>
                        ))}
                        {typeof filterList !== 'undefined' && filterList.length > 0 &&
                            <div className={`${styles.row} ${styles.center}`}>
                                <Button handleButtonClick={handleAplyButton} ButtonText={buttonName} />
                            </div>
                        }
                    </div>
                    {showBottomButtonList &&
                        <div className={`${styles.flex_row} ${styles.ml_auto}`}>
                            {bottomButtonList.map((item, index) => (
                                <div key={index} className={`${styles.row} ${styles.center} `}>
                                    <Button disabled = {item.isDisabled ? item.isDisabled : false} handleButtonClick={item.handleButtonClick} ButtonText={item.name} />
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </section>

        </div>
    )
}

export default PageControl
