"use client";

import { useState, useRef, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchComponent = ({ styles }) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef(null);

  const toggleSearchPanel = () => setShow((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  return (
    <div ref={wrapperRef}>
      <span className={styles.search} onClick={toggleSearchPanel}>
        <IoSearchOutline className="icon" />
      </span>

      {show && <div className={styles.search_panel}></div>}
    </div>
  );
};

export default SearchComponent;