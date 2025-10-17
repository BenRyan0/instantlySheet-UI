import { NavBar } from "@/components/layout/NavBar";
import React, { useEffect } from "react";
import { AddNewSheet } from "@/store/reducers/sheetReducer";
import { ExpandableCardsToEncode } from "./../components/custom/Encoding/ExpandableCardsToEncode";
import {
  approveLeadEncodingLead,
  denyLeadEncodingLead,
  getAllToBeEncoded,
  messageClear,
} from "@/store/reducers/toBeEncodedReducer";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const ToEncodeList = () => {
  const dispatch = useDispatch();
  const {
    toEncode,
    encodingSuccess,
    loader,
    errorMessage,
    successMessage,
    encodingLoader,
    denySuccess
  } = useSelector((state) => state.toBeEncoded);

  useEffect(() => {
    dispatch(getAllToBeEncoded());
  }, [dispatch, encodingSuccess,denySuccess]);

  const handleEncode = (card) => {
    console.log("Encoding lead:", card);
    dispatch(approveLeadEncodingLead({ lead: card }));
  };

  const handleDeny = (card) => {
    console.log("Denying lead:", card);
    dispatch(denyLeadEncodingLead({id : card.id}))
    
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    } else if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);
  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center">
      <div className="absolute top-0 mx-auto container z-50">
        <NavBar />
      </div>

      <div className="z-40 w-9/12 relative h-screen flex justify-center items-center">
        <div className="absolute top-24 pb-20 w-full">
          {/* <div className=" p-3 flex justify-center items-center absolute inset-0">
            <div className="flex justify-center items-end gap-1 p-3">
              <h2>Encoding..</h2>
              <img src="/public/gif/notebook.gif" className="h-10" alt="" />
            </div>
          </div> */}
          {encodingLoader && (
            <div className="flex justify-center items-end gap-1 p-3">
              <h2>Encoding..</h2>
              <img src="/gif/notebook.gif" className="h-10" alt="" />
            </div>
          )}

          <ExpandableCardsToEncode
            cards={toEncode}
            onEncode={handleEncode}
            onDeny={handleDeny}
            loader={loader}
          />
        </div>
      </div>
    </div>
  );
};

export default ToEncodeList;
