"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

const ProfileComponent = ({ styles }) => {
  const { data: session } = useSession();

  const [showPanel, setShowPanel] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <CgProfile
        onClick={() => setShowPanel((prev) => !prev)}
        color={session ? "green" : "red"}
        className="icon"
      />

      <div
        className={styles.profile_panel}
        style={{ display: showPanel ? "block" : "none" }}
      >
        {/* Your panel content */}
        <h1><b>Account</b></h1>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>

            {session ? (
          <>
          <button
          className={`${styles.status_button} ${styles.view_profile}`}
            onClick={() => {}}
          >
            View Profile
          </button>

          <Link
            href="/address"
            className={`${styles.status_button} ${styles.view_profile}`}
            onClick={() => setShowPanel(false)}
          >
            Address
          </Link>
          
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`${styles.authButton} ${styles.logoutButton}`}
          >
            LOGOUT
          </button>
          </>
        ) : (
          <>

          <button
          className={styles.status_button}
            onClick={()=>{}}
          >
            Not Signed
          </button>
          
          <button
            onClick={() => signIn("google")}
            className={`${styles.authButton} ${styles.loginButton}`}
          >
            LOGIN
          </button>
          </>
        )}

        </div>
        

      </div>
    </div>
  );
};

export default ProfileComponent;
