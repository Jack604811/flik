import React from "react";
import BookingDetailSheet from "../modal-and-sheets/BookingDetailSheet";

const ModalAndSheetProvider = () => {
  return (
    <div className="fixed">
        <BookingDetailSheet />
    </div>
  );
};

export default ModalAndSheetProvider;