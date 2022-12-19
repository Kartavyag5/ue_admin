import React from "react";
import styles from "./style.module.css";
import { AiFillCloseCircle } from "react-icons/ai";
import FullScreenPopup from "./FullScreenPopup";
import router from "next/router";
import FormController from "../form/FormController";

interface props {
  toggle: () => void,
  data?: any,
}

interface state {

}

class ViewPuzzle extends React.PureComponent<props, state> {
  
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  componentDidMount() {
    if (document.getElementById("cr-sidebar"))
      document.getElementById("cr-sidebar").style.zIndex = "1";
  }

  render() {
    const { toggle, data} = this.props;

    const fields = [
      {
          label:'Category Name',
          column : [
            {
              name:'category_id',
              title: data.category_name,
              inputType:'select',
              readOnly:true,
              options: [],
              defaultValue: data.category_name,
            }
          ]
        },
        {
          label:'Game Level',
          column : [
            {
              name:'game_level',
              readOnly:true,
              title:  data.game_level_name,
              inputType:'select',
              options: [],
              defaultValue: data.game_level_name,
            }
          ]
        },
    ]
    
    const puzzleWordData = {
      column1: [
        {
          order: 1,
          word: data.words.some(item => item.order === 1) ? data.words.find(item => item.order === 1).word : '',
          readOnly:true
        },
        {
          order: 2,
          word: data.words.some(item => item.order === 2) ? data.words.find(item => item.order === 2).word : '' ,
          readOnly:true
        },
        {
          order: 3,
          word: data.words.some(item => item.order === 3) ? data.words.find(item => item.order === 3).word : '',
          readOnly:true
        },
        {
          order: 4,
          word: data.words.some(item => item.order === 4) ? data.words.find(item => item.order === 4).word : '',
          readOnly:true
        },
      ],
  
      column2: [
        {
          order: 5,
          word: data.words.some(item => item.order === 5) ? data.words.find(item => item.order === 5).word : '' ,
          readOnly:true
        },
        {
          order: 6,
          word: data.words.some(item => item.order === 6) ? data.words.find(item => item.order === 6).word : '',
          readOnly:true
        },
        {
          order: 7,
          word: data.words.some(item => item.order === 7) ? data.words.find(item => item.order === 7).word : '',
          readOnly:true
        },
        {
          order: 8,
          word: data.words.some(item => item.order === 8) ? data.words.find(item => item.order === 8).word : '',
          readOnly:true
        }
      ]
    }
    
    return (
      <form >
      <div className={styles.modal}>
        <div className={styles.overlay}>
          <div className={`${styles.modal_content} ${styles.role_modal_content}`}>
            <div className={styles.top_header}>
              <span className={styles.popup_content_h1}>
                <AiFillCloseCircle
                  onClick={() => toggle()}
                  className={styles.closeicon}
                />
              </span>
            </div>
            <div className={styles.modal_flex_100}>
              
              <FormController
                layout={1}
                column1={fields}
                puzzleWords={true}
                puzzleWordData={puzzleWordData}
              />
            
            </div>
          </div>
        </div>
      </div>
      </form>
    );
  }
}

export default React.memo(ViewPuzzle);
