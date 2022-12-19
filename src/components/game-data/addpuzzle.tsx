import React from "react";
import FormController from "../form/FormController";

export default function AddPuzzle({editData, handleFormData, handleCancel,  ...props}) {

  let data = typeof editData !== 'undefined' && (editData);

  const fields = [
    {
      label:'Game*',
      column : [
        {
          name:'game_id',
          inputType:'select',
          title:'Select game',
          options: props.gameOptionList,
          handleChange:(val)=> props.onGameChange(val),
          defaultValue: typeof data !== 'undefined' ? data.game_id : '',
          handleScroll :props.handleGameScroll,
          searchable:["Select Game"],
          setSearchText: props.handleGameSearch,
          handleToggle : props.handleGameToggle
        }
      ]
    },
    {
        label:'Category Name*',
        column : [
          {
            name:'category_id',
            title:'Select category',
            inputType:'select',
            searchable:["Select category"],
            options: props.categoryOptionList,
            handleScroll:props.handleCategoryScroll,
            defaultValue: typeof data !== 'undefined' ? data.category_id : '',
            setSearchText: props.handleCategorySearch,
            handleToggle:props.handleCategoryToggle       }
        ]
      },
      {
        label:'Game Level*',
        column : [
          {
            name:'game_level',
            title:'Select game level',
            inputType:'select',
            searchable:["Select Game Level"],
            options: props.gameLevelOptionList,
            defaultValue: typeof data !== 'undefined' ? data.game_level : '',
            handleToggle:props.handleLevelToggle,
            setSearchText: props.handleLevelSearch
          }
          
        ]
      },
  ]

  const buttonProps = [
    {
      type:'submit',
      value:'save',
      handleButtonClick:handleFormData
    },
    {
      type:'button',
      value:'cancel',
      handleButtonClick:handleCancel

    }
  ]

  const puzzleWordData = {
    column1: [
      {
        order: 1,
        word:''
      },
      {
        order: 3,
        word:''
      },
      {
        order: 5,
        word:''
      },
      {
        order: 7,
        word:''
      },
    ],

    column2: [
      {
        order: 2,
        word:''
      },
      {
        order: 4,
        word:''
      },
      {
        order: 6,
        word:''
      },
      {
        order: 8,
        word:''
      }
    ]
  }

  return (
      <FormController
        layout={1}
        column1={fields}
        buttonProps={buttonProps}
        puzzleWords={true}
        puzzleWordData={puzzleWordData}
        isFormDirty={props.isFormDirty}

      />
      
  );
}
