import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { AiFillCloseCircle } from "react-icons/ai";
import Table from "../table/table";
import { getPlayerDetails } from "../../services/gameSchedule";
import { formatPlayerData } from "../../helper/tableData";
import Loading from "../../components/text/loading";
import NoDataFound from "../../components/text/noDataFound";
import { playerDetailTableHeader } from "../../lib/tableHeader";
import ErrorPopup from "./ErrorPopup";

interface props {
  toggle: () => void;
  playerIds: any;
  scheduleId:string;
  from: any
}
export default function ShowPlayerDetailPopup(props: props) {
  const [formatedTableData, setFormatedTableData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  useEffect(() => {    
    if (document.getElementById("cr-sidebar"))
      document.getElementById("cr-sidebar").style.zIndex = "1";
    getPlayerDetailsList();
  }, []);

  const getPlayerDetailsList = async () => {
    try {
      const reqData = {
        player_ids: props.playerIds,
      };
      const res = await getPlayerDetails({ reqData });
      const formatedTableData = formatPlayerData({ data: res.player_list, scheduleId:props.scheduleId && props.scheduleId, from:props.from&&props.from });
      setFormatedTableData(formatedTableData);
    } catch (err) {
      console.error(err.message);
      setErrorData({ state: true, message: err.message });

    }
    setLoading(false);

  };

  const { toggle } = props;

  return (
    <div className={styles.modal}>
      <div className={styles.overlay}>
        <div className={`${styles.modal_content} ${styles.show_detail_modal}`}>
          <div className={styles.top_header}>
            <span className={styles.popup_content_h1}>
              <AiFillCloseCircle
                onClick={() => toggle()}
                className={styles.closeicon}
              />
            </span>
          </div>
          <div className={`${styles.table_content} ${styles.scrollList}`}>
            {loading && <Loading />}
            {!loading && formatedTableData.length === 0 && <NoDataFound />}

            {formatedTableData.length !== 0 && (
              <Table tableData={formatedTableData} tabelHeader={playerDetailTableHeader} />
            )}
          </div>
        </div>
      </div>
      {errorData.state && (
          <ErrorPopup
            toggle={() => setErrorData({ state: false, message: "" })}
            bodyText={errorData.message}
            headerText={"Error"}
          />
        )}
    </div>
  );
}
