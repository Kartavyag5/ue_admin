import { FaAngleDown , FaAngleUp, FaCheck } from "react-icons/fa";
import React, { Component } from "react";
import styles from './singleSelect.module.css'

interface props {
  id?: any,
  title?: string,
  list?: Array<{label:any, value:any}>,
  name?: string,
  onChange?: (item:any)=>void,
  handleChange?: (item:any)=>void,
  defaultValue?: any,
  searchable?: any,
  checkIcon?: any,
  arrowUpIcon?: any,
  arrowDownIcon?: any,
  isListOpen?:any,
  noOptionText?:string,
  setSearchText?:(val:string)=>void,
  loadOptionListOnScroll?:(val:boolean) => void,
  readOnly?:boolean,
  resetSelection?: boolean
  changeResetflag? : any
  handleToggle?:(isOpen) => void
}

interface state {
  isListOpen:boolean,
  title:any,
  selectedItem:any;
  searchKey:any,
  list:any,
}

interface ref{
  searchField:any
}


class SingleSelect extends Component<props,state, ref> {
 
  private searchField: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    const { title, list, defaultValue } = this.props;    

    this.state = {
      isListOpen: false,
      title,
      selectedItem: null,
      searchKey: '',
      list,
    };

    this.searchField = React.createRef();
  }

  componentDidMount() {
    const { defaultValue } = this.props;    
    
    if (typeof defaultValue !== 'undefined') {
      this.selectSingleItem(defaultValue);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isListOpen } = this.state;
    // To reset comm selection if org changed
    if(this.props.resetSelection && this.state.selectedItem) this.clearSelection(); 

    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.selectSingleItem(this.props.defaultValue);
    }

    setTimeout(() => {
      if (isListOpen) {
        window.addEventListener('click', this.close);
      } else {
        window.removeEventListener('click', this.close);
      }
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.close);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { list } = nextProps;

    if (JSON.stringify(list) !== JSON.stringify(prevState.list)) {
      return { list };
    }

    return null;
  }

  getOptionList() {
    //call api call and fetch list
    let optionlist = [];

    this.setState({...this.state, list:optionlist})
  }

  scrollCheck = event => {
    let { loadOptionListOnScroll } = this.props;

    if (!event.target.scrollTop) return;

    const bottom = (Math.floor(event.target.scrollHeight - event.target.scrollTop) === (event.target.clientHeight-1)) || (Math.floor(event.target.scrollHeight - event.target.scrollTop) === (event.target.clientHeight));
       
    if (bottom) {
      loadOptionListOnScroll && loadOptionListOnScroll(false);
    }
  };

  close = () => {
    this.setState({
      isListOpen: false,
    });
  }

  clearSelection = () => {
    const { name, title, onChange, handleChange } = this.props;

    this.setState({
      selectedItem: null,
      title,
    }, () => {
      onChange(null);
      (typeof handleChange !== 'undefined') && handleChange(null)
    });
  }

  selectSingleItem = (item) => {
    const { list } = this.props;
    let selectedItem;

    if(list.length)  selectedItem = list.find((i) => i.value == item);
   
    if(typeof selectedItem !== 'undefined') this.selectItem(selectedItem);
  }

  selectItem = (item) => {
    
    const { label, value } = item;
    const { list, selectedItem } = this.state;

    const { name, onChange, handleChange } = this.props;

    let foundItem;

    if (!value) {
      foundItem = list.find((i) => i.value === item.value);
    }

    this.setState({
      title: label || foundItem.label,
      isListOpen: false,
      selectedItem: item,
    }, () => {if(selectedItem?.value !== value) { onChange(item); (typeof handleChange !== 'undefined') && handleChange(item)}});
  }

  toggleList = () => {
    // To get Initial list when dropdown open with search text
    if (this.props.handleToggle) this.props.handleToggle(this.state.isListOpen)

     // To reset comm selection if org changed
    if(this.props.changeResetflag) this.props.changeResetflag();
    
    // if select is toggle , then disable opening dropdowns
    if(!this.props.readOnly)
    {
      this.setState((prevState) => ({
        isListOpen: !prevState.isListOpen,
        searchKey: '',
      }), () => {
        if (this.state.isListOpen && this.searchField.current) {
          this.searchField.current.focus();
          this.setState({
            searchKey: '',
          });
        }
      });
    }
    
  }

  filterList = (e) => {
    //call search api
    let { setSearchText } = this.props;
    
    setSearchText(e.target.value);

    this.setState({
      searchKey: e.target.value.toLowerCase(),
    });

  }

  listItems = () => {
    const { id, searchable,checkIcon, readOnly} = this.props;    
    const { searchKey, list, title } = this.state;
    
    
    let tempList = [...list];
    const selectedItemValue = this.state.selectedItem?.value;
    

    if (searchKey.length) {
      tempList = this.props.list;
    }

    if (tempList.length) {
      return (
        tempList.map((item, index) => (
          <button
            type="button"
            className={`dd-list-item ${id} ${styles.listItem} ${item.value === selectedItemValue ? styles.selectedItem :  ( item.label === title && item.value == selectedItemValue ? styles.selectedItem  : '') }  `}
            key={index}
            disabled={readOnly}
            onClick={() => this.selectItem(item)}
          >
            {item.label}
            {' '}

            {/* { item.value === selectedItemValue && (
              <span className={styles.checkIcon}>
                {checkIcon || <FaCheck />}
              </span>
            )} */}

          </button>
        ))
      );
    }

    return (
      <div className={`dd-list-item no-result ${id} ${styles.listItemNoResult}`}>
       {(tempList.length) === 0 ? this.props.noOptionText : ''}
      </div>
    );
  }

  render() {
    const {id,searchable, arrowUpIcon, arrowDownIcon, defaultValue, readOnly} = this.props;
    
    const { isListOpen, title } = this.state;

    return (
        <div className={`dd-wrapper ${id} ${styles.wrapper} ` }  >
          <button
            type="button"
            className={`dd-header ${id} ${styles.header} ${typeof title === 'undefined'  ? styles.header_btn : ''} ${readOnly ? styles.readonly : ''} `}
            onClick={ this.toggleList}
          >
            <div className={`dd-header-title ${id} ${styles.headerTitle} ${title === this.props.title ? styles.placeholder : ''}  `} > {title} </div>

            {/* TOGGLE ARROW ICON */}
            {isListOpen 
              ? <div className={styles.indicator}><span className={styles.headerArrowUpIcon}>{arrowUpIcon || <FaAngleUp />}</span></div>
              : <div className={styles.indicator}><span className={styles.headerArrowDownIcon}>{arrowDownIcon || <FaAngleDown />}</span></div>}
          </button>

          {isListOpen && (
            <div className={`dd-list${searchable ? ' searchable' : ''} ${id} ${styles.list}`}  >
              
              {/* SEARCH OPTION */}
              {searchable && (
                <input
                  ref={this.searchField}
                  className={`dd-list-search-bar ${id} ${styles.listSearchBar}`}
                  placeholder={searchable[0]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => this.filterList(e)}
                />
              )}

              {/* LIST DEPODOWN OPTION */}
              <div className={`dd-scroll-list ${id} ${styles.scrollList}`} onScroll={this.scrollCheck}>
                {this.listItems()}
              </div>
            </div>
          )}
        </div>
      
    )
  }
}

export default SingleSelect;