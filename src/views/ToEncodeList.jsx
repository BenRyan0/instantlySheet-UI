import { NavBar } from "@/components/layout/NavBar";
import React, { useEffect, useState } from "react";
import { ExpandableCardsToEncode } from "./../components/custom/Encoding/ExpandableCardsToEncode";
import {
  approveLeadEncodingLead,
  denyLeadEncodingLead,
  getAllToBeEncoded,
  messageClear,
} from "@/store/reducers/toBeEncodedReducer";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ToEncodeList = () => {
  const dispatch = useDispatch();
  const {
    toEncode,
    encodingSuccess,
    loader,
    errorMessage,
    successMessage,
    encodingLoader,
    denySuccess,
  } = useSelector((state) => state.toBeEncoded);

  const [showDenyModal, setShowDenyModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    dispatch(getAllToBeEncoded());
  }, [dispatch, encodingSuccess, denySuccess]);

  const handleEncode = (card) => {
    console.log("Encoding lead:", card);
    dispatch(approveLeadEncodingLead({ lead: card }));
  };

  const handleDeny = (card) => {
    // Show confirmation modal first
    setSelectedCard(card);
    setShowDenyModal(true);
  };

  const confirmDeny = () => {
    if (selectedCard) {
      dispatch(denyLeadEncodingLead({ id: selectedCard.id }));
      setShowDenyModal(false);
      setSelectedCard(null);
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    } else if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="relative h-screen w-full p-0 flex justify-center items-center">
      <div className="absolute top-0 mx-auto container z-50">
        <NavBar />
      </div>

      <div className="z-40 w-9/12 relative h-screen flex justify-center items-center">
        <div className="absolute top-24 pb-20 w-full">
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

      {/* Confirmation Modal */}
      <AlertDialog open={showDenyModal} onOpenChange={setShowDenyModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deny</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deny this lead? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDenyModal(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeny}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ToEncodeList;
