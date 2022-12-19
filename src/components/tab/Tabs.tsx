import React, { useState } from "react";
import styles from "./tab.module.css";

type Props = {
  tabContent: any;
  currentTab?: any;
};

const Tabs = ({ tabContent, currentTab = 1 }: Props) => {
  const [selectedTab, setSelectedTab] = useState(parseInt(currentTab));
  
  return (
    <div>
      <div className={`${styles.mx_auto} ${styles.p_4} `}>
        <div
          className={` ${styles.flex} ${styles.flex_wrap}  ${styles.justify_around} ${styles.items_center}`}
        >
          <div className={`${styles.tab_header} `}>
            {tabContent.map((item, index) => (
              <div
                key={index}
                className={`${styles.width_25} ${styles.p_4} ${
                  styles.cursor_pointer
                }  ${styles.w_4_12} 
              							${
                              selectedTab === item.id
                                ? styles.bg_light_yellow
                                : styles.bg_blue_light
                            }`}
                onClick={() => setSelectedTab(item.id)}
              >
                <p
                  className={`${styles.my_auto} ${styles.mx_auto} ${styles.text_center} ${styles.font_500}`}
                >
                  {item.heading}
                </p>
              </div>
            ))}
          </div>
		  
        </div>
      </div>

      {tabContent[selectedTab - 1].content}
    </div>
  );
};

export default Tabs;
