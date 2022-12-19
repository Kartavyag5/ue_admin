import React from "react";
import styles from "./table.module.css";
import Button from "../button/Button";
import Pagination from "../../components/pagination/Pagination";
import Constants from "../../lib/Constants";
import Input from '../Input/Input'


import styled from "styled-components";
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useRowSelect,
} from "react-table";
import Links from "../link/Links";
import SingleSelect from "../select/SingleSelect";

// TODO: Move styles to css file

const Styles = styled.div`
  padding: 1rem;
  display: block;
  // overflow: hidden;
  .table {
    border-spacing: 0;
    border: 1px solid #dcd8d8;
    min-width: 100% !important;
    width: fit-content;
    .tbody{
      border-top:0;
    }
    .thead {
      overflow-y: auto;
      overflow-x: hidden;
    }
    .tr {
      :last-child {
        border-bottom: 0;
        .td {
          border-bottom: 0;
          font-size:1rem;
        }
      }
      border-bottom: 1px solid #dcd8d8;
    }
    .header{
      background-color:#f4f3f3;
      color:#00243d;
      font-weight:500;
    }
    .header {
      :last-child {
        border-bottom: 1px solid #dcd8d8;
      }
    }
    .th,
    .td {
      // width: 130px !important;
      // margin: 0;
      border-right: 1px solid #dcd8d8;
      justify-content: flex-start !important;
      position: relative;
      word-break: break-word;

      :last-child {
        border-right: 0;
      }
      .resizer {
        right: 0;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 1;
        touch-action :none;
        &.isResizing {
          background: red;
        }
      }
    }
  }
`;

const headerProps = (props, { column }) => getStyles(props, column.align);

const cellProps = (props, { cell }) => getStyles(props, cell.column.align);

const getStyles = (props, align = "left") => [
  props,
  {
    style: {
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      display: "flex",
    },
  },
];

function Table({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useResizeColumns,
    useFlexLayout,
    useRowSelect,
    (hooks) => {}
  );

  return (
    <div className="min_h_48" id="section-to-print">
    <div {...getTableProps()} className="table" >
      <div>
        {headerGroups.map((headerGroup, index) => (
          <div {...headerGroup.getHeaderGroupProps({})} className="header bg-light" key = {index}>
            {headerGroup.headers.map((column, index2) => (
              <div {...column.getHeaderProps(headerProps)} className="th" id={column.id === "View" && "hide_view_header"} key = {index2}>
                {column.render("Header")}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="tbody">
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <div {...row.getRowProps()} className="tr" key = {index}>
              {row.cells.map((cell, index2) => {
                return (
                  <div {...cell.getCellProps(cellProps)} className="td" id={cell.column.id === "View" && "hide_view_cell"} key = {index2}>
                    {cell.render("Cell")}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}

function App(props) {

  /* to remind to add function to single select*/
  const handleChange = (value, type=null, id=null, order=null) => {
    props.handleChangeData(value, type, id, order);
  }

  const handleScroll = () => {
    //api call
    console.log('scrolling');
  }


  function processTableData({ tableData }) {
    const processDataForTable = tableData.map((data) => {
      let mapped = {};
      data.forEach(({ accessor, data, type, readOnly, DropDownContent, redirectTo, id=null, order=null, isDisabled = false }, index) => {
        const dummyExternalLink = accessor === "Start Game" ? Constants.GameURL : Constants.ZoomDummyUrl;
        if (type === "TEXT") {
          mapped[accessor] = data;
        } else if (type === "INPUT") {
          mapped[accessor] = <Input type="text" value= {data} onChange={(value)=>handleChange(value, 1, id, order)} />;
        } else if (type === "DROPDOWN") {
          mapped[accessor] = <SingleSelect title={data} list={DropDownContent} defaultValue={data} onChange={(value)=>handleChange(value, 2, id, order)} loadOptionListOnScroll = {handleScroll}

          />;
        } else if (type === "LINK") {
          mapped[accessor] = <Links isDisabled = {isDisabled} linkText={data} redirectTo={redirectTo?.isExternalLink? redirectTo?.externalPath : redirectTo?.path} isExternalLink = {redirectTo?.isExternalLink}/>;
        } else if (type === "BUTTON") {
          mapped[accessor] = <Button disabled = {isDisabled} linkStyle={true} handleButtonClick={() => props.handleButtonClick(id, accessor)} ButtonText={data} />;
        }else {
          // Type not found error
        }
      });
      return mapped;
    });
    return processDataForTable;
  }
  
  const columns = props.tabelHeader;
  const data = processTableData({ tableData: props.tableData });

  return (
    <Styles>
      <Table columns={columns} data={data} />

      {props.pagination && 
        <Pagination  pageCount={props.pageCount} onPageChange={props.onPageChange } />
      }

    </Styles>
  );
}

export default App;
