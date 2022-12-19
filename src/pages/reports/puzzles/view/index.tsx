import router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FormControl from "../../../../components/form-control/FormControl";
import FormController from "../../../../components/form/FormController";
import { getReportPuzzleList } from "../../../../services/gameDataMaintanance";
import Loading from "../../../../components/text/loading";
import ErrorPopup from "../../../../components/popup/ErrorPopup";

const Index = () => {

  const router = useRouter();

  const { puzzleId } = router.query;
  let heading = "Puzzle";
  const [puzzleData, setPuzzleData] = useState<any>({});
  const [words, setWords] = useState<Array<any>>([{}]);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState({
    state: false,
    message: "",
  });

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    getPuzzleData();
  }, []);

  const puzzleWordData = {
    column1: [
      {
        order: 1,
        word: words[0].word,
        readOnly:true
      },
      {
        order: 2,
        word: words[1]?.word,
        readOnly:true

      },
      {
        order: 3,
        word: words[2]?.word,
        readOnly:true

      },
      {
        order: 4,
        word: words[3]?.word,
        readOnly:true

      },
    ],

    column2: [
      {
        order: 5,
        word: words[4]?.word,
        readOnly:true

      },
      {
        order: 6,
        word: words[5]?.word,
        readOnly:true

      },
      {
        order: 7,
        word: words[6]?.word,
        readOnly:true

      },
      {
        order: 8,
        word: words[7]?.word,
        readOnly:true
      }
    ],
  };
  const fields = [
    {
      label: "Category Name",
      column: [
        {
          name: "category_name",
          inputType: "TEXT",
          readOnly: true,
          defaultValue: puzzleData.category_name,
        },
      ],
    },
    {
      label: "Game Level",
      column: [
        {
          name: "game_level",
          inputType: "TEXT",
          readOnly: true,
          defaultValue: puzzleData.game_level_name,
        },
      ],
    },
    {
      label: "Category Description",
      column: [
        {
          name: "category_description",
          inputType: "TEXT",
          readOnly: true,
          defaultValue: puzzleData.category_description,
          textarea:true

        },
      ],
    },
  ];

  // api call to fetch puzzle list
  const getPuzzleData = async () => {
    try {
      let reqData = {
        puzzle_id: puzzleId,
      };
      const res = await getReportPuzzleList({ reqData });
      setPuzzleData({ ...puzzleData, ...res.puzzle_list[0] });
      setWords(res.puzzle_list[0].words);
    } catch (err) {
      console.error(err);
      setErrorData({ state: true, message: err.message });
    }
    setLoading(false);
  };

  return (
    <div className={`container`}>
      <FormControl
        heading={heading}
        showBackButton={true}
        handleBackButton={handleCancel}
      />
      {loading ? (
        <Loading />
      ) : (
        <div className={`row`}>
          <FormController
            layout={1}
            column1={fields}
            puzzleWords={true}
            puzzleWordData={puzzleWordData}
          />
        </div>
      )}
       {errorData.state && (
        <ErrorPopup
          toggle={() => setErrorData({ state: false, message: "" })}
          bodyText={errorData.message}
          headerText={"Error"}
        />
      )}
    </div>
  );
};

export default React.memo(Index);
