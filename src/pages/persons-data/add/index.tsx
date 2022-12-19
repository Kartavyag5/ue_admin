import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import FormControl from "../../../components/form-control/FormControl";
import AddPerson from "../../../components/person-data/addperson";
import ErrorPopup from "../../../components/popup/ErrorPopup";
import FullScreenPopup from "../../../components/popup/FullScreenPopup";
import { validateEmail } from "../../../helper/emailValidation";
import Constants from "../../../lib/Constants";
import { addOrEditUser, getUserList } from "../../../services/personService";

interface personAddReqBody {
  user_id?: number;
  first_name?: string;
  last_name?: string;
  gender: number;
  birth_year?: number;
  phone_number?: string;
  email_id?: string;
  agreement?: string;
  sales_force_id?: number;
  user_comm_role: string
}

const PersonAddForm = () => {
  const router = useRouter();

  const {userId, gameScheduleId, from, community_id} = router.query;

  
  let heading = (userId ? "View/Edit " : "Add ") + "  Person";


  const [data, setData] = useState<any>({});
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [dataChange, setDataChange] = useState(false)

  const [openPopup, setOpenPopup] = useState<popup>(
    {
      state: false,
      message: '',
      subMessage: ''
    });

  const [errorData, setErrorData] = useState<errorData>({
    state: false,
    message: "",
    alertType: 1
  });


  let genderOptions = [
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
    { value: 3, label: "Other" },
  ];

  let agreementOptions = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];


  useEffect(() => {
    let userId = router.query.userId;
    if (typeof userId !== "undefined")
      getUserDetailForId(userId);
    else
      setIsApiLoaded(true)
  }, []);



  const getUserDetailForId = async (id) => {
    try {
      let reqData: userListPayload = {
        list_type: Constants.userListType.dropDown,
        user_id: userId,
        user_ids: [id],
        query_type: Constants.queryType.detailView

      };
      const res = await getUserList({ reqData });
      const relatedToUserIdList = res.user_list[0].user_comm_role.map(({related_to_user_id}) => related_to_user_id).filter(Boolean);      
      if(relatedToUserIdList.length){
        const user = await getUserList({reqData: {user_ids :relatedToUserIdList, list_type: Constants.userListType.dropDown, query_type: Constants.queryType.detailView}})        
        res.user_list[0].user_comm_role.forEach(role => {  
          const relatedToUser = user.user_list.find(user => user.user_id === role.related_to_user_id)          
          if(relatedToUser){
          role.first_name = relatedToUser.first_name;
          role.last_name = relatedToUser.last_name;}
        });
      }
      setData(res.user_list[0]);
      setIsApiLoaded(true)

    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  };

  // checking if email already exists
  const handleEmailvalidation = async (email) => {
    try {
      let reqData: userListPayload = {
        list_type: Constants.userListType.dropDown,
        email_id: email,
        query_type: Constants.queryType.tableView

      }
      if (reqData.email_id) {
        const res = await getUserList({ reqData })
        if (res.user_list.length > 0) {
          setErrorData({ state: true, message: "Email already exists" })
        }
      }
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
  }

  //submit form
  const handleFormData = async (data) => {    
    let roleId = [1, 2, 3, 4, 5, 7]
    let selectedRoleId = typeof data.user_comm_role !== "undefined" && data.user_comm_role.map(role => role.role_id);
    let mandtoryFieldMsg = [];

    //checking mandatory fields based on Role
    if (!data.first_name) mandtoryFieldMsg.push('First Name');
    if (!data.last_name) mandtoryFieldMsg.push('Last Name');
    if (!data.gender) mandtoryFieldMsg.push('Gender');
    if (!data.agreement) mandtoryFieldMsg.push('Agreement');
    if (!data.birth_year) mandtoryFieldMsg.push('Birth Year');
    if (!data.user_comm_role) mandtoryFieldMsg.push('user comm role');

    if (data.birth_year && (data.birth_year).toString().length !== 4) {
      setErrorData({ state: true, message: "Birth year should have 4 digits" });
      return false
    }
    if ((!data.email_id) && roleId.some((val) => selectedRoleId && selectedRoleId.includes(val))) mandtoryFieldMsg.push('Email');
    if (data.email_id && !validateEmail(data.email_id)) {
      setErrorData({ state: true, message: "Please fill valid email" });
      return false
    }
    if (data.phone && data.phone.length !== 10) {
      setErrorData({ state: true, message: "Phone Number should contain 10 digits" });
      return false
    }

    if (mandtoryFieldMsg.length > 0) {
      const {
        MandatoryFieldAlertMsgData: { errorMessageOne, errorMessageTwo },
      } = Constants;
      setOpenPopup({ ...openPopup, state: true, message: mandtoryFieldMsg, subMessage: mandtoryFieldMsg.length === 1 ? errorMessageOne : errorMessageTwo })
      return false;
    }

    //api call
    try {
      let reqData: personAddReqBody = {
        first_name: data.first_name && data.first_name,
        last_name: data.last_name && data.last_name,
        gender: data.gender && data.gender.value,
        birth_year: data.birth_year && +data.birth_year,
        agreement: data.agreement && data.agreement.value,
        user_comm_role: (data.user_comm_role && (data.user_comm_role).length) && JSON.stringify(formatUserCommRole(data.user_comm_role))
      };
      if (data.phone) reqData.phone_number = `1${data.phone}`;
      if (data.phone === "") reqData.phone_number = "";
      if (data.email_id) reqData.email_id = data.email_id;
      if (data.sales_force_id) reqData.sales_force_id = data.sales_force_id;
      if (userId) reqData.user_id = +userId;

      await addOrEditUser({ reqData }, userId);      
      gameScheduleId  ? routeToAddGame() : router.back();
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });

    }
  };

  const formatUserCommRole = (data) => {
    
    const formatedList = data.map((item) => {
      return {
        organization_id: item.organization_id,
        role_id: item.role_id,
        community_id: item.community_id,
        related_to: item.role_id === 7 ? item.related_to_user_id : 0,
      };
    });
    return formatedList;
  };


  const isFormDirty = (isChange) => {
    if (isChange !== dataChange) setDataChange(isChange) // checking if form field has changed
  }

  const handlePopupConfirm = () => {
    (gameScheduleId || from) ?  ((gameScheduleId && from) ? routeToAddGame() : router.back()) : router.push(`/persons-data/`);
  };

  const handleCancel = () => {
    if (dataChange) {
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
      (gameScheduleId || from) ?  ((gameScheduleId && from) ? routeToAddGame() : router.back()) : router.push(`/persons-data/`);
  }

  const deleteUser = async () => { //delete functionality
    try {
      let reqData: userEditPayload = {
        user_id: userId,
        user_comm_role: JSON.stringify(data.user_comm_role),
        status: 5
      }
      await addOrEditUser({ reqData }, userId);
      router.back()
    }
    catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message })
    }
  }

  const handleDelete = () => { // show alert popup onclick of delete
    setErrorData({ state: true, message: Constants.deleteAlertMsg.message, alertType: 4 });
  }

  const routeToAddGame = () => {
    router.push(`/game-schedules/add-schedule/add?gameScheduleId=${gameScheduleId}&isAdd=${true}&from=${from}&community_id=${community_id}`)
  }

  return (
    <div className={`container`}>
      <FormControl
        heading={heading}
        showBackButton={true}
        handleBackButton={handleCancel}
      />

      <div className={`row`}>
        {isApiLoaded &&
          (<AddPerson
            editData={data}
            handleCancel={handleCancel}
            handleDelete={handleDelete}
            genderOptions={genderOptions}
            agreementOptions={agreementOptions}
            handleFormData={handleFormData}
            handleEmailvalidation={handleEmailvalidation}
            isFormDirty={isFormDirty}
          />)}

        {openPopup.state &&
          <FullScreenPopup
            bodyText={openPopup.message}
            subText={openPopup.subMessage}
            onCancel={() => setOpenPopup({ ...openPopup, state: false })}
            onConfirm={() => handlePopupConfirm()}
            cancelBtnText={typeof openPopup.message === 'string' ? 'No' : 'Okay'}
            confirmBtn={typeof openPopup.message === 'string' ? true : false}
          />
        }
        {errorData.state && (
          <ErrorPopup
            toggle={() => setErrorData({ state: false, message: "" })}
            bodyText={errorData.message}
            headerText={errorData.alertType === 4 ? "Alert" : "Error"}
            handleDeleteRecord={deleteUser}
            cancelBtn={errorData.alertType === 4 && true}
            alertType={errorData.alertType}
            confirmBtnText={errorData.alertType === 4 && "Yes"}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(PersonAddForm);
