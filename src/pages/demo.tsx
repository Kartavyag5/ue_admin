import { Container , Col} from 'reactstrap'
import MultipleSelect from '../components/select/MultipleSelect';
import SingleSelect from '../components/select/SingleSelect';
import Input from '../components/Input/Input';
import React from 'react';
import Datepicker from '../components/Input/DatePicker';
import DataRangePicker from '../components/Input/DataRangePicker';
import FullScreenPopup from '../components/popup/FullScreenPopup';
import ErrorPopup from '../components/popup/ErrorPopup';
import Button from '../components/button/Button';


export default function Demo() {
  const [state, setState] = React.useState(
    {
      inputValue:'', 
      dateValue:'2021-09-15',
      daterange:{startDate:'2021-01-01', endDate:'2021-01-30'},
      isOpen:true
    });

  let name = "location";
  let title = "Select location";
  let searchText = 'Search for location';
  let defaultOption = {label:'ABC', value:1};
  let defaultOptionArray = [{label:'ABC', value:1}, {label:'AQS', value:2}];
    
  let popupHeader = 'Rate Host';
  let popupBody = 'You have not rated this host of this game. Would you like to rate the host before saving your input?';

  let optionsList = [
      {
        organization_id:1,
        organization_name:'ABC',
        sales_force_id : '1'
      },  {
        organization_id:2,
        organization_name:'AQS',
        sales_force_id : '1'
      },  {
        organization_id:3,
        organization_name:'AFR',
        sales_force_id : '1'
      },  {
        organization_id:4,
        organization_name:'ATR',
        sales_force_id : '1'
      },  {
        organization_id:5,
        organization_name:'AVG',
        sales_force_id : '1'
      },  
  ];

  const fetchFormattedOptionList = (options) => {
    let optionlist = [];
     
    options.map(item => {
      optionlist.push( {label:item.organization_name, value: item.organization_id
      })
    });
    
    return optionlist;
  }
    
  const handleSearch = (value) => {
    //api call
    console.log(value);
  }
    
  const handleScroll = () => {
    //api call
    console.log('scrolling');
  }
    
  const handleChange = (value) => {
    console.log(value); 
  }

  const handleButtonClick = evt => {
    //api call
    console.log(evt);
  }

  return ( 
    <Container fluid={true} style={{ 'position':'relative', 'margin': 'auto 0',  'display':'inline-block','verticalAlign':'middle','textAlign':'center', 'width':'calc(100%-250px)'}}>
      <h1><b>SPIN TOPIA ADMIN PANEL</b></h1>
     
      <Col sm={6}>
        <SingleSelect
          name = {name}
          title = {title}
          list = {fetchFormattedOptionList(optionsList)}
          searchable={[searchText]}
          onChange={handleChange}
          noOptionText={'No data found'}
          // defaultValue={defaultOption}
          setSearchText = {handleSearch}
          loadOptionListOnScroll = {handleScroll}
          readOnly={true}
        />

        <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>
    
        <MultipleSelect
          name = {name}
          title = {title}
          list = {fetchFormattedOptionList(optionsList)}
          searchable={[searchText]}
          onChange={handleChange}
          noOptionText={'No data found'}
          defaultValue={defaultOptionArray}
          setSearchText = {handleSearch}
          loadOptionListOnScroll = {handleScroll}
        />

<br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>

        <Input 
          type = {'email'}
          value={state.inputValue} 
          onChange={(val)=>setState({...state, inputValue:val})} 
        />

        <Datepicker 
          defaultValue={state.dateValue} 
          onChange={(value)=>setState({...state, dateValue:value})} 
        />
        <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>

        <DataRangePicker 
          defaultEnddate={state.daterange.endDate} 
          defaultStartdate={state.daterange.startDate} 
          handleChange={(value)=>setState({...state, daterange:value})} 
        />

        <Button  ButtonText={'Save'} handleButtonClick={handleButtonClick} disabled={false} />
        <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/>

      </Col>

      {/* {state.isOpen && 
        <FullScreenPopup 
          toggle={()=> setState({...state, isOpen:true})} 
          bodyText={popupBody} 
        />  
      }  */}
     

    {/* {state.isOpen && 
      <ErrorPopup 
        toggle={()=> setState({...state, isOpen:false})} 
        headerText={popupHeader}
        bodyText={popupBody} 
      /> 
    } */}
    

    </Container>
  );
}
