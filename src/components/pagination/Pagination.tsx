import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import ReactPaginate from 'react-paginate';
import style from './index.module.css'

interface props {
  pageCount:number,
  onPageChange: (page:any) => void
}

class Pagination extends React.PureComponent <props>{
  
  constructor(props) {
    super(props);
  }

  render() {

    const { pageCount, onPageChange } = this.props;

    return (

      <ReactPaginate
        previousLabel={<button className={`${style.btns} pagination-btn`}><FaAngleLeft className={style.icon} /><span> PREV</span> </button>  }
        nextLabel={<button className={`${style.btns} pagination-btn`}><span>NEXT</span> <FaAngleRight className={style.icon} /></button>  }
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={4}
        onPageChange={onPageChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />

    )
  }
}

export default React.memo(Pagination);