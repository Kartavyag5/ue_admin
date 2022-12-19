import React, { Component } from 'react';
import { FaAngleDown, FaAngleUp} from 'react-icons/fa';
import styles from './singleSelect.module.css'

interface props {
  title:any,
  list:any,
  defaultValue?:Array<{}>,
  name?:any,
  onChange:(item:any)=>void,
  closeOnSelection?:any,
  id?:any,
  searchable?:any,
  checkIcon?:any,
  arrowUpIcon?:any,
  arrowDownIcon?:any,
  noOptionText?:any,
  setSearchText?:(val:string)=>void,
  loadOptionListOnScroll:(val:boolean) => void
  handleToggle?:(isOpen) => void

}

interface state {
  isListOpen:any,
  title:any,
  searchKey:any,
  selectedItems:any,
  list:any,
  Label:any
}

class MultipleSelect extends Component<props, state> {
  private searchField: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);
    const { title, list } = this.props;

    this.state = {
      isListOpen: false,
      title,
      searchKey: '',
      selectedItems: [],
      list,
      Label:[]
    };

    this.searchField = React.createRef();
  }

  componentDidMount() {
    const { defaultValue } = this.props;
    
    // if (typeof defaultValue !== 'undefined' && defaultValue.length) {  
    //   this.selectDefaultMultipleValues(defaultValue);
    // }
  }

  componentDidUpdate(prevState, prevProps) {
    const { isListOpen } = this.state;
    const { defaultValue } = this.props;    

    if(JSON.stringify(prevState.list) !== JSON.stringify(this.state.list) && typeof defaultValue !== 'undefined'){ // default value fetch 
      this.selectDefaultMultipleValues(defaultValue);
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

  scrollCheck = event => {
    let { loadOptionListOnScroll } = this.props;

    if (!event.target.scrollTop) return;

    const bottom = (Math.floor(event.target.scrollHeight - event.target.scrollTop) === (event.target.clientHeight-1)) || (Math.floor(event.target.scrollHeight - event.target.scrollTop) === (event.target.clientHeight));
       
    if (bottom) {
      loadOptionListOnScroll(false);
    }
  };

  close = () => {
    this.setState({
      isListOpen: false,
    });
  }

  getValueList = (list) => {
    let newArray = [];
    list.map(item => 
     newArray.push(item.value)  
    )

    return newArray;
  }

  selectAll = () => {
    const { name, onChange } = this.props;
    const {Label} = this.state;

    this.setState((prevState) => ({
      selectedItems: prevState.list,
    }), () => {
      // this.handleTitle();
      onChange(this.getValueList(this.state.selectedItems));
    });
  }

  deselectAll = () => {
    const { name, onChange } = this.props;
    const {Label} = this.state;

    this.setState({
      selectedItems: [],
    }, () => {
      this.handleTitle();
      onChange(this.getValueList(this.state.selectedItems));
    });
  }

  selectDefaultMultipleValues = (items) => {
    const { list } = this.state;
  

    items.forEach((item) => {
      const selectedItem = list.find((i) => i.value === item);
      
     selectedItem && setTimeout(() => {
        this.selectItem(selectedItem, true);
      });
    });
  }

  selectItem = (item, noCloseOnSelection = false) => {
    const { closeOnSelection } = this.props;

    this.setState({
      isListOpen: (!noCloseOnSelection && !closeOnSelection) || false,
    }, () => this.handleSelection(item, this.state.selectedItems));
  }

  handleSelection = (item, selectedItems) => {
    const { name, onChange } = this.props;
    const {Label} = this.state;

    const index = selectedItems.findIndex((i) => i.value === item.value);

    if (index !== -1) {
      const selectedItemsCopy = [...selectedItems];
      const LabelCopy = [...Label];
      selectedItemsCopy.splice(index, 1);
      LabelCopy.splice(index, 1);
      this.setState(() => ({
        selectedItems: selectedItemsCopy,
        Label: LabelCopy,
      }), () => {
        onChange(this.getValueList(this.state.selectedItems));
        // this.handleTitle();
      });
    } else {
      this.setState((prevState) => ({
        selectedItems: [...prevState.selectedItems, item],
        Label:[...prevState.Label,item.label]
      }), () => {
        onChange(this.getValueList(this.state.selectedItems));
        // this.handleTitle();
       
      });
    }
  }

  // deprecated
  handleTitle = () => {
    const { selectedItems, Label } = this.state;
    const { title} = this.props;

    const { length } = selectedItems;        
    if (!length) {
      this.setState({
        title,
      });
    } else {
      this.setState({
        title: `${Label}`,
      });
    }
  }

  toggleList = () => {
   if (this.props.handleToggle) this.props.handleToggle(this.state.isListOpen)
    this.setState((prevState) => ({
      isListOpen: !prevState.isListOpen,
    }), () => {
      if (this.state.isListOpen && this.searchField.current) {
        this.searchField.current.focus();
        this.setState({
          searchKey: '',
        });
      }
    });
  }

  filterList = (e) => {
    //call search api
    let { setSearchText } = this.props;
    setSearchText(e.target.value);

    this.setState({
      searchKey: e.target.value.toLowerCase(),
    });
  }

  // FUNCTION LIST OPTION ITEMS
  listItems = () => {
    const {
      id,
      searchable,
      checkIcon,
    } = this.props;
    const { searchKey, list, selectedItems } = this.state;
    let tempList = [...list];

    if (searchKey.length) {
      tempList = this.props.list;
    }
    if (tempList.length) {
      return (
        tempList.map((item) => (
          <button
            type="button"
            className={`dd-list-item ${id} ${styles.listItem} ${selectedItems.some((i) => i.value === item.value) ? '' :'' }`}
            key={item.value}
            onClick={() => this.selectItem(item, true)}
          >
           <input defaultChecked={selectedItems.some((i) => i.value === item.value) ? true : false} type="checkbox" /> {item.label}
            {' '}
            
            {/* {selectedItems.some((i) => i.value === item.value) && (
            <div className={styles.indicator}>
              <span className={styles.checkIcon}>
                {checkIcon || <FaCheck />}
              </span>
            </div>
            )} */}
            
          </button>
        ))
      );
    }

    return (
      <div className={`dd-list-item no-result ${id} ${styles.listItemNoResult}`} >
       {(tempList.length) === 0 ? this.props.noOptionText : ''}
      </div>
    );
  }

  render() {
    const {
      id,
      searchable,
      arrowUpIcon,
      arrowDownIcon,
    } = this.props;
    const { isListOpen, title, selectedItems } = this.state;    
    
    return (
      <div
        className={`dd-wrapper ${id} ${styles.wrapper}`}
      >
        <button
          type="button"
          className={`dd-header ${id} ${styles.header}`}
          onClick={this.toggleList}
        >
          <div className={`dd-header-title ${id} ${styles.headerTitle}`} >
            
            {/* DISPLAYING PLACEHOLDER IF SELECTED ARRAY COUNT IS ZERO */}
            {selectedItems.length === 0 && 
               <div className={ `${styles.placeholder}` }>
               {title}
             </div>
            }
          
            {/* ITERATING SELECTED ARRAY VALUES */}
            {/* {selectedItems.length > 0 && selectedItems.map ((title, index) => (
              <div key = {index} className={ `${styles.title} ${title.label.length < 20 ? styles.d_initial : ''}` }>
                {title.label}
              </div>
            ))} */}

            {/* to fix table height */}
            {selectedItems.length > 0 &&
              <div className={ `${styles.placeholder}` }>
                { selectedItems.length+ ' item selected' }
              </div>
            }

          </div>

          {/* TOGGLE ARRAOW ICON ON CLICK  */}
          {isListOpen
            ? <div className={styles.indicator}><span className={styles.headerArrowUpIcon}>{arrowUpIcon || <FaAngleUp />}</span></div>
            : <div className={styles.indicator}><span className={styles.headerArrowDownIcon}>{arrowDownIcon || <FaAngleDown />}</span></div>}
       
        </button>

        {isListOpen && (
          <div
            role="list"
            // type="button"
            className={`dd-list ${searchable ? ' searchable' : ''} ${id} ${styles.list}`}
            onClick={(e) => e.stopPropagation()}>

            {/* SERACH FIELD */}
            {searchable
            && (
            <input
              ref={this.searchField}
              className={`dd-list-search-bar ${id} ${styles.listSearchBar}`}
              placeholder={searchable[0]}
              onChange={(e) => this.filterList(e)}
            />
            )}

            {/* RENDERING OPTION LIST  */}
            <div className={`dd-scroll-list ${id} ${styles.scrollList}` } onScroll={this.scrollCheck} >
              {this.listItems()}
            </div>

          </div>
        )}
      </div>
    );
  }
}

export default MultipleSelect;
