import React from "react";

const Mainlayout = ({ children }) => {
  return <div className="container mx-auto pt-24 pb-12 min-h-screen overflow-y-visible">{children}</div>;
};

export default Mainlayout;