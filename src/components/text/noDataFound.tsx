import React from "react";
import styles from "./text.module.css"

const NoDataFound = () => {
  return(
      <div>
          <h3 className={`text_center ${styles.mt_10}`}>No Data Found</h3>
      </div>
  )
}

export default React.memo(NoDataFound);
