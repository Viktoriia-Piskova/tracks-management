import React from "react";

const Header = () => {
  return (
    <header data-testid="tracks-header" className="w-full text-center p-4">
      <h1 className="font-semi-bold">Welcome to The Tracks List</h1>
      <p className="p-4">View, sort, search, filter, edit and create tracks</p>
    </header>
  );
};

export default Header;
