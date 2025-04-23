import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const currentFilters = Object.fromEntries(searchParams.entries());
    setFilters(currentFilters);
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    //console.log("updateFilter")
  };

  const resetFilters = ()=> {
    setFilters({
      search: "",
      sort: "",
      order: "",
      artist: "",
      genre: "",
    });

    setSearchParams(new URLSearchParams());
  }

  return (
    <FilterContext.Provider value={{ filters, updateFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
