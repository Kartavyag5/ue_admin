import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import FormControl from "../../../../components/form-control/FormControl";
import FullScreenPopup from "../../../../components/popup/FullScreenPopup";
import ErrorPopup from "../../../../components/popup/ErrorPopup";
import Constants from "../../../../lib/Constants";
import AddAttendanceForm from "../../../../components/game-schedule/addAttendanceForm";
import { getUserList } from "../../../../services/personService";
import { getParticipantType, recordAttendance } from "../../../../services/gameSchedule";
import { getGMTTimeStamp } from "../../../../helper/dateTime";



interface attendaceData{
    user_id:number
    user_type:number
    first_name:string
    last_name:string
    email_id?:string
    join_at?:number
    leave_at?:number
}
const AttendanceAddForm = () => {

    const router = useRouter();
    let heading = "Add Entry";

    const [userList, setUserList] = React.useState([]);
    const [isApiLoaded, setIsApiLoaded] = React.useState(false)
    const [dataChange, setDataChange] = useState(false)
    const [participantTypeList, setParticipantTypeList] = useState([])
    const [name, setName] = useState("")
    const [selectedUserId,setSelectedUserId] = useState<number|undefined>()

    const [openPopup, setOpenPopup] = useState<popup>({
        state: false,
        message: '',
        subMessage: ''
    });
    const [errorData, setErrorData] = useState<errorData>({
        state: false,
        message: "",
        alertType: 1
    });

    let userSearchText = useRef("")


    useEffect(() => {
            (async () => {
                const userListRes = await getUserData({
                    list_type: Constants.userListType.dropDown,
                    query_type: Constants.queryType.dropDown
                });
                userListRes.user_list.length && setUserList([...userListRes.user_list,{user_id:0, first_name:"None", last_name:"None"}]);
                setIsApiLoaded(true)
            })();
        getParticipantTypeList()
    }, []);


    const handleUserSearch = async (searchString) => {
        try {
            userSearchText.current = searchString
            const userListRes = await getUserData({
                name: userSearchText.current,
                list_type: Constants.userListType.dropDown,
                query_type: Constants.queryType.dropDown
            });
            setUserList([...userListRes.user_list]);
        } catch (err) {
            console.error(err);
            setErrorData({ state: true, message: err.message, alertType: 1 });
        }
    };

    const handleUserToggle = async (isOpen) => {
        const isOpening = !isOpen;
        if (isOpening && userSearchText.current.length) {
            userSearchText.current = "";
            const userListRes = await getUserData({
                name: userSearchText.current, list_type: Constants.userListType.dropDown, query_type: Constants.queryType.dropDown
            });
            setUserList([...userListRes.user_list,{user_id:0, first_name:"None", last_name:"None"}]);
        }
    }

    const  handleUserChange = ({first_name, last_name, value})=> {
        setName(`${first_name} ${last_name}`) 
        setSelectedUserId(value)      
    }


    const getUserData = async (reqData: userListPayload) => {
        try {
            if (reqData.name === "") delete reqData.name
            // if (router.query.commId) reqData.community_ids = router.query.commId;
            const userListRes = await getUserList({ reqData });
            return userListRes;
        } catch (err) {
            console.error(err);
            setErrorData({ state: true, message: err.message, alertType: 1 });
        }
    };

    let userOptionList = userList.map(({ user_id, first_name, last_name, user_comm_role }) => {
        return { label: `${first_name} ${last_name}`, value: user_id, first_name: first_name, last_name: last_name,  };
    });

    const getParticipantTypeList = async () => {
        try {
            const res = await getParticipantType({ reqData: {} });
            setParticipantTypeList(res.participant_type_list);
        } catch (err) {
            console.error(err);
            setErrorData({ state: true, message: err.message });
        }
    }

    const formattedParticipantTypeList = participantTypeList.map(({ id, name }) => {
        return { label: name, value: id };
    });


    // submit form
    const handleFormData = useCallback(async (formData) => {

        let missingFields = [];
        
        Object.entries(formData).forEach(([key, value], index) => {
            if ((!value) && ([0,4].includes(index))) {                
               missingFields.push(key)
            }
            if(index === 1 && name.split(/(?<=^\S+)\s/)[0] === "None" && !value){
                missingFields.push(key)
            }
            if(index === 2 &&  name.split(/(?<=^\S+)\s/)[1] === "None" && !value){
                missingFields.push(key)
            }
        });  
        if (missingFields.length > 0) {
            const {
                MandatoryFieldAlertMsgData: { errorMessageOne, errorMessageTwo },
            } = Constants;
            setOpenPopup({ ...openPopup, state: true, message: missingFields, subMessage: missingFields.length === 1 ? errorMessageOne : errorMessageTwo })
            return false;
        }
        let attendaceData : attendaceData = {
            user_id: formData.user.value,
            user_type: formData.user_type.value,
            first_name: (name && name.split(/(?<=^\S+)\s/)[0] === "None") ? formData.first_name : formData.user.first_name,
            last_name: (name && name.split(/(?<=^\S+)\s/)[1] === "None") ? formData.last_name : formData.user.last_name
        }
        if(formData.email_id) attendaceData.email_id = formData.email_id;
        if(formData.join_at) attendaceData.join_at = new Date(formData.join_at).getTime()
        if(formData.leave_at) attendaceData.leave_at = new Date(formData.leave_at).getTime()
        try {
            let reqData = {
                game_schedule_id: +router.query.scheduleId,
                community_id: +router.query.commId,
                attendance: JSON.stringify([attendaceData])
            }
            await recordAttendance({ reqData });
            router.back();
        } catch (err) {
            console.error(err);
            setErrorData({ state: true, message: err.message, alertType: 1 });
        }
    },[selectedUserId]);

    const isFormDirty = (isChange) => {
        if (isChange !== dataChange) setDataChange(isChange) // checking if form field has changed
    }

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
            router.back();
    };

    const handlePopupConfirm = () => {
        router.back();
    }


    return (
        <div className={`container`}>
            <FormControl heading={heading} showBackButton={true} handleBackButton={handleCancel} />
            <div className={`row`}>
                {isApiLoaded &&
                    <AddAttendanceForm
                        userOptionList={userOptionList}
                        handleUserSearch={handleUserSearch}
                        handleUserToggle={handleUserToggle}
                        handleUserChange={handleUserChange}
                        userTypeOptionList={formattedParticipantTypeList}
                        handleCancel={handleCancel}
                        handleFormData={handleFormData}
                        isFormDirty={isFormDirty}
                        name = {name}
                    />
                }
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
                        cancelBtn={errorData.alertType === 4 && true}
                        alertType={errorData.alertType}
                        confirmBtnText={errorData.alertType === 4 && "Yes"}
                    />
                )}
            </div>
        </div>
    );
};

export default React.memo(AttendanceAddForm);


