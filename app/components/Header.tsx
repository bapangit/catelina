'use client'

import { useSession } from 'next-auth/react';
import { LuShoppingCart } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { RiDraftLine } from "react-icons/ri";
import SearchComp from "../../components/SearchComponent";
import ProfileComp from "../../components/ProfileComponent";
import Link from "next/link";

type HeaderProps = {
  styles: Record<string, string>;
};

export default function Header({ styles }: HeaderProps) {
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === 'admin';

  return (
    <header className={styles.header}>
      <SearchComp styles={styles} />
      <Link href="/"> <p className={styles.p}>Ecom App</p></Link>
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
            <li>
              <Link href="/admin/addproduct" className={styles.addButton}>
                <IoMdAdd className="icon" />
              </Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link href="/admin/drafts" className={styles.draftButton}>
                <RiDraftLine className="icon" />
              </Link>
            </li>
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
  );
}
