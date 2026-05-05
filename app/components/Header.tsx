'use client'

import { useSession } from 'next-auth/react';
import { LuShoppingCart } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { RiDraftLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import SearchComp from "../../components/SearchComponent";
import ProfileComp from "../../components/ProfileComponent";
import Link from "next/link";
import { useState } from 'react';
import { MdOutlineLocalShipping } from "react-icons/md";


type HeaderProps = {
  styles: Record<string, string>;
};

export default function Header({ styles }: HeaderProps) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === 'admin';

  return (
    <>
      <header className={styles.header}>
        <div className={styles.hamburger_container}>
          <button 
            className={styles.hamburger_button}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <GiHamburgerMenu size={24} />
          </button>
        </div>
        <SearchComp styles={styles} />
        <Link href="/" className={styles.logo_link}> 
          <p className={styles.p}>Ecom App</p>
        </Link>
        <nav className={styles.nav}>
          <ol className={styles.ol}>
            <li className={styles.icon_style}>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/categories">Categories</Link>
            </li>
            <li>Most Rated</li>
          </ol>
        </nav>
        <div className={styles.header_secondary_nav}>
          <ul>
            {isAdmin && (
              <>
              <li>
                <Link href="/admin/addproduct" className={styles.addButton}>
                  <IoMdAdd className="icon" />
                </Link>
              </li>
              <li>
                <Link href="/admin/drafts" className={styles.draftButton}>
                  <RiDraftLine className="icon" />
                </Link>
              </li>
              
              </>
            )}
            
            <li>
              <span>
                <LuShoppingCart className="icon" />
              </span>
            </li>
            <li>
              <ProfileComp styles={styles} />
            </li>
          </ul>
        </div>
      </header>
      
      {menuOpen && (
        <>
          <div 
            className={styles.modal_overlay}
            onClick={() => setMenuOpen(false)}
          />
          <div className={styles.mobile_menu_modal}>
            <nav className={styles.mobile_menu_nav}>
              <ol className={styles.mobile_menu_ol}>
                <li>
                  <Link href="/products" onClick={() => setMenuOpen(false)}>Products</Link>
                </li>
                <li>
                  <Link href="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
                </li>
                <li>Most Rated</li>
              </ol>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
