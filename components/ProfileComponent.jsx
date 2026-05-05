"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

const ProfileComponent = ({ styles }) => {
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email || "User";

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
    <div ref={wrapperRef} className={styles.profile_component}>
      <CgProfile
        onClick={() => setShowPanel((prev) => !prev)}
        color={session ? "green" : "red"}
        className="icon"
      />

      <div
        className={styles.profile_panel}
        style={{ display: showPanel ? "block" : "none" }}
      >
        <div className={styles.profile_card}>
          <div className={styles.profile_avatar}>
            {session ? userName.charAt(0).toUpperCase() : "?"}
          </div>
          <div className={styles.profile_meta}>
            <span className={styles.profile_label}>Account</span>
            <h2 className={styles.profile_name}>
              {session ? userName : "Guest user"}
            </h2>
          </div>

          {session ? (
            <div className={styles.profile_actions}>
              <Link
                href="/orders"
                className={styles.profile_action_button}
                onClick={() => setShowPanel(false)}
              >
                Orders
              </Link>

              <Link
                href="/address"
                className={styles.profile_action_button}
                onClick={() => setShowPanel(false)}
              >
                Addresses
              </Link>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className={`${styles.profile_action_button} ${styles.profile_logout_button}`}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google")}
              className={`${styles.profile_action_button} ${styles.profile_login_button}`}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
