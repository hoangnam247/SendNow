import React from "react";

const CampaignCard = ({ title, value, status, onEdit }) => {
    return (
      <div className="flex items-center justify-between p-8 border-b">
        <div className="flex items-center space-x-4">
          {status === "success" ? (
            <span className="text-green-500 text-2xl">✔️</span>
          ) : (
            <span className="text-red-500 text-2xl">❌</span>
          )}
          <div>
            <p className="font-bold text-xl">{title}</p>
            <p className="text-gray-600 text-lg">{value}</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="bg-gray-500 text-white px-4 py-2 rounded-md text-xl"
        >
          Chỉnh sửa
        </button>
      </div>
    );
  };
  
  

export default CampaignCard;
