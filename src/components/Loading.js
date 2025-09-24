import React, { memo } from "react";
import Modal from "@/components/MotionModel";
import { Mosaic } from "react-loading-indicators";

const Loading = ({ yes }) => {
  return (
    <div className="relative z-50">
      <Modal isOpen={yes}>
        <div className="text-3xl font-bold p-5 min-h-[500px] flex-center">
          <Mosaic
            color="#32cd32"
            size="medium"
            text="Loading..."
            textColor=""
          />
        </div>
      </Modal>
    </div>
  );
};

export default memo(Loading);
