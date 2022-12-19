import React from "react"
import styles from './style.module.css'
import router from 'next/router'
import Button from "../button/Button";

interface Props {
  heading: string,
  subHeading?: string,
  showBackButton?: boolean,
  handleBackButton?: () => void
  buttonList?: any;
}

class FormControl extends React.PureComponent<Props> {

  constructor(props) {
    super(props);

  }

  render() {
    const { heading, subHeading, showBackButton = false, handleBackButton, buttonList } = this.props;

    return (
      <div >
        <section className="page-header">

          {typeof heading !== 'undefined' &&
            <div className={`${styles.justify_center} `}  >
              <h3 className={`${styles.text_center} ${styles.capitalize} ${styles.bold} ${styles.font_1} ${styles.color_navy}`}>
                {heading}
              </h3>
            </div>
          }
          {typeof subHeading !== 'undefined' &&
            <div className={`${styles.justify_center} `}  >
              <h3 className={`${styles.text_center} ${styles.capitalize} ${styles.bold} ${styles.font_1} ${styles.color_navy}`}>
                {subHeading}
              </h3>
            </div>
            }
          <div className={styles.flex}>
            {showBackButton &&
              <div  >
                {/* <button onClick={() => handleBackButton()} className={styles.back_btn}>back</button> */}
                <Button handleButtonClick={handleBackButton} ButtonText={'Back'} />

              </div>
              }
            {buttonList &&
              <div className={`${styles.flex} ${styles.ml_auto}`}>
                {buttonList.map((item, index) => (
                  <div key={index} className={styles.row}>
                    <Button handleButtonClick={item.handleButtonClick} ButtonText={item.name}  disabled={item.isDisabled}/>
                  </div>
                ))}
              </div>
              }
          </div>
        </section>
      </div>
    )
  }
}

export default React.memo(FormControl)
