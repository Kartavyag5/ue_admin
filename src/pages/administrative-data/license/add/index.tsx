import router, { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import EditLicense from "../../../../components/adminstrative-data/addlicense";
import { editLicense, getOrgCommPayList, getPricingPlanList, licenseList } from "../../../../services/licenseService";
import FullScreenPopup from "../../../../components/popup/FullScreenPopup";
import { getGameList } from "../../../../services/licenseService";
import { remove_duplicates_from_list } from "../../../../helper/removeDuplicates";
import Constants from "../../../../lib/Constants";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import { getGMTTimeStamp } from "../../../../helper/dateTime";

const LicenseAddForm = () => {

  const router = useRouter();
  const licenseId = router.query.licenseId;

  const [openPopup, setOpenPopup] = useState<popup>(
    {
      state: false,
      message: '',
      subMessage: ''
    });

  const [errorData, setErrorData] = useState<errorData>({
    state: false,
    message: "",
    alertType:1
  });

  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [data, setData] = useState({});

  const [gameList, setGameList] = useState([])
  const [gameLastId, setGameLastId] = useState(0)

  const [planList, setPlanList] = useState([])
  const [planLastId, setPlanLastId] = useState(0)
  const [dataChange, setDataChange] = useState(false)


  const [orgCommPayList, setOrgCommPayList] = useState([])

  let heading = (typeof licenseId !== 'undefined' ? 'Edit' : 'Add') + ' license';

  let totalGame = useRef(0)
  let totalPricingPlan = useRef(0);

  const isFormDirty = (isChange) => { 
    if(isChange !== dataChange) setDataChange(isChange) // checking if form field has changed
   }
 
   const handleCancel = () => {
     if(dataChange){
       const {
         SaveFormAlertMsgData: { message, subMessage },
       } = Constants;
       setOpenPopup({
         state: true,
         message,
         subMessage,
       });
     }
     else
       router.back();
   };
 
   const handlePopupConfirm = () => {
     router.back();
   }  //api call to get game list
  const getGameOptions = async ({ searchText = '', page = 0 }) => {

    try {
      let reqData: gameListPayload = {
        // limit:Constants.filterDropDownLimit,
        // last_id:gameLastId
        }; //TODO: removed limit, pagenumber and last id for MS2
      if (searchText !== "") { reqData.game_name = searchText; delete reqData.last_id; }
      // if (page > 0) reqData.page_number = page;

      if (totalGame.current > gameList.length || (gameList.length === 0 && totalGame.current === 0)) {
        const res = await getGameList({ reqData });
        setGameList(remove_duplicates_from_list([...gameList, ...res.game_list], 'game_id'));
        (res.game_list.length > 0 && searchText === "") && setGameLastId(res.game_list[res.game_list.length - 1].game_id)
        if (typeof res.total_count !== 'undefined') totalGame.current = res.total_count
      }

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  }

  //api call to get plan list
  const getPlanOptions = async ({ searchText = '', page = 0 }) => {

    try {
      let reqData: planlistPayload = {
        // limit:Constants.filterDropDownLimit,
        // last_id:planLastId
      }; //TODO: removed limit and last id for MS2
      // if (page > 0) reqData.page_number = page;
      if (searchText !== "") { reqData.plan_name = searchText; delete reqData.last_id; }

      if (totalPricingPlan.current > planList.length || (planList.length === 0 && totalPricingPlan.current === 0)) {
        const res = await getPricingPlanList({ reqData });
        setPlanList(remove_duplicates_from_list([...planList, ...res.pricing_plan_list], 'pricing_plan_id'));
        (res.pricing_plan_list.length > 0 && searchText === "") && setPlanLastId(res.pricing_plan_list[res.pricing_plan_list.length - 1].pricing_plan_id)
        if (typeof res.total_count !== 'undefined') totalPricingPlan.current = res.total_count
      }
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  }

  //api call to get plan list
  const getOrgCommunityPayOptions = async (searchText = '') => {

    try {
      let reqData = {};

      const res = await getOrgCommPayList({ reqData });
      setOrgCommPayList(res.org_comm_pay_list);

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }

  }
  // get license detail for id
  const getlicenseDetailForId = async (id) => {

    try {
      let reqData:licenseListPayload = { limit: 1, license_ids: [id], list_type:Constants.userListType.table };

      const res = await licenseList({ reqData });
      setData({ ...data, ...res.license_list[0] });
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }

  }


  let gameOptionList = gameList.map((option) => {
    return { label: option.game_name, value: option.game_id };
  })

  let planOptionList = planList.map((option) => {
    return { label: option.plan_name, value: option.pricing_plan_id };
  })

  let orgComPayOptionList = orgCommPayList.map((option) => {
    return { label: option.org_comm_pay_name, value: option.org_comm_pay_id };
  })

  const handleGameSearch = (value) => {
    getGameOptions({ searchText: value })
  }

  const handleGameScroll = () => {
    getGameOptions({})
  }

  const handlePlanSearch = (value) => {
    setPlanList([])
    setPlanLastId(0)
    getPlanOptions({ searchText: value })
  }

  const handlePlanScroll = () => {
    getPlanOptions({})
  }

  const handleOrgCommPaySearch = (value) => {
    getOrgCommunityPayOptions(value)
  }

  const handleOrgCommPayScroll = () => {
    getOrgCommunityPayOptions()
  }

  //submit form data
  const handleFormData = async (data) => {
    //checking mandatory fields
    let message1 = [];

    Object.entries(data).forEach(([key, value], index) => {
      if ((typeof value === 'undefined' || value === '') && index !== 4 ) {
        message1.push(key)
      }
    });

    if (message1.length > 0) {
      const {
        MandatoryFieldAlertMsgData: { errorMessageOne, errorMessageTwo },
      } = Constants;
      setOpenPopup({ ...openPopup, state: true, message: message1, subMessage: message1.length === 1 ? errorMessageOne : errorMessageTwo })
      return false;
    }

    try {
      let response;

      let reqData = {
        license_id: (typeof licenseId !== 'undefined') ? licenseId : '',
        game_id: (typeof data.game_licensed !== 'undefined') ? data.game_licensed.value : '',
        pricing_plan_id: (typeof data.game_pricing_plan !== 'undefined') ? (data.game_pricing_plan.value) : '',
        effective_date: (typeof data.effective_date !== 'undefined') ?  getGMTTimeStamp({ date: data.effective_date }) : '',
        expire_date: (typeof data.expire_date !== 'undefined') ?  getGMTTimeStamp({ date: data.expire_date }) : '',
        renewal_as_of_date: (typeof data.renewal_as_of_date !== 'undefined') ? getGMTTimeStamp({ date: data.renewal_as_of_date }) : '',
        org_community_pay: (typeof data.org_community_pay !== 'undefined') ? (data.org_community_pay.value) : ''
      }

      if(typeof data.expire_date === 'undefined' || data.expire_date === '') delete reqData.expire_date;
      if (typeof licenseId !== 'undefined') {
        response = await editLicense({ reqData });
      }
      router.back()
    } catch (err) {
      // setErrorMessage(err.message); 
      setErrorData({ state: true, message: err.message });

      console.log(err);
    }
  }

  const deleteLicense = async () => { //delete functionality
    try{
      let reqData = {
         license_id:licenseId,
         status:5
      }
      await editLicense({ reqData });
      router.back()
    }
    catch(err) {
        console.error(err);
        setErrorData({ state: true, message: err.message })
    }
  }

  const handleDelete = () => { // show alert popup onclick of delete
    setErrorData({ state: true, message: Constants.deleteAlertMsg.message, alertType:4 });   
  }


  React.useEffect(() => {
    (async () => {
      await Promise.all([
        await getGameOptions({ page: 1 }),
        await getPlanOptions({ page: 1 }),
        await getOrgCommunityPayOptions(),
      ])
      if (typeof licenseId !== 'undefined')
        await getlicenseDetailForId(licenseId);
        setIsApiLoaded(true)
    })();
  }, [])

  return (
    <div className={`container`}>
      <FormControl heading={heading} showBackButton={true} handleBackButton={handleCancel} />

      <div className={`row`}>

        {isApiLoaded &&
          <EditLicense
            editData={data}
            handleFormData={handleFormData}
            handleCancel={handleCancel}

            handleGameScroll={handleGameScroll}
            handleGameSearch={handleGameSearch}

            handlePlanScroll={handlePlanScroll}
            handlePlanSearch={handlePlanSearch}
            handleDelete={handleDelete}

            gameOptionList={gameOptionList}
            planOptionList={planOptionList}
            orgComPayOptionList={orgComPayOptionList}
            isFormDirty={ isFormDirty}
          />
        }
      </div>

      {openPopup.state &&
        <FullScreenPopup
          bodyText={openPopup.message}
          subText={openPopup.subMessage}
          onCancel={() => setOpenPopup({ ...openPopup, state: false })}
          onConfirm={() => handlePopupConfirm()}
          cancelBtnText={typeof openPopup.message === 'string' ? 'No' : 'Okay'}
          confirmBtn={typeof openPopup.message === 'string' ? true : false} //dont show confirm btn for mandatory field check
        />
      }

      {errorData.state && (
        <ErrorPopup
        toggle={() => setErrorData({ state: false, message: "", alertType:1 })}
        bodyText={errorData.message}
        headerText={errorData.alertType === 4 ? "Alert" : "Error"}
        handleDeleteRecord={deleteLicense}
        cancelBtn = {errorData.alertType === 4 && true}
        alertType = {errorData.alertType}
        confirmBtnText ={errorData.alertType === 4 && "Yes"}
      />
      )}

    </div>
  )

}

export default LicenseAddForm;