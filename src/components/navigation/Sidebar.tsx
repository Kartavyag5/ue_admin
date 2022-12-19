import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Styles from './navigation.module.css'
import { FaAngleDown } from 'react-icons/fa'

function Sidebar({ sidebarData, ...props }) {

  const [SideBarData, setSideBarData] = useState<Array<any>>([])

  let navIndex = useRef<Number>();


  useEffect(() => {
    if (sidebarData.length >= 1)
      setSideBarData(sidebarData)
  }, [sidebarData])

  const TogglesubSidebar = () => {
    let subMenu = document.getElementById('sub-menu')
    if (subMenu.style.display === "none") {
      subMenu.style.display = "block";
    } else {
      subMenu.style.display = "none";
    }
  }

  const removeActiveClass = (index) => {
    if (navIndex.current !== undefined) {
      document.getElementById(`navItem-${navIndex.current}`) && document.getElementById(`navItem-${navIndex.current}`).classList.remove('active');
      document.getElementById(`navItem-sublink-${navIndex.current}`) && document.getElementById(`navItem-sublink-${navIndex.current}`).classList.remove('active');
    }
    navIndex.current = index;

  }

  return (
    <aside className={`${Styles.cr_sidebar}  cr-sidebar cr-sidebar--open`} id="cr-sidebar">
      <div className={` cr-sidebar__background`} />
      <div className={`${Styles.cr_sidebar__content} cr-sidebar__content`}>
        <ul className={`${Styles.nav} ${Styles.flex_column}`} id="nav-list">
          {SideBarData.map(({ to, name, exact, subNav, isExternal }, index) => (
            <li key={index} className={`${Styles.nav_item} nav-item`} onClick={() => { subNav.length > 0 ? TogglesubSidebar() : '' }} >
              <a
                className={` ${Styles.nav_link} ${Styles.text_capitalize} 
                  ${name === "Contact Support" ? Styles.contact_info : ''}
                  nav-link text_center`}
                id={`navItem-${index}`}
                onClick={() => {
                  removeActiveClass(index);
                  subNav.length === 0 && document.getElementById(`navItem-${index}`).classList.add('active');
                  (!isExternal && subNav.length === 0) && router.push(to);
                  isExternal && window.open(to, "_blank");
                }} >
                <span >{name} </span>
                {subNav.length > 0 && <span className="pull-right"> <FaAngleDown /> </span>}
              </a>
              {subNav.length > 0 &&
                <ul className={`${Styles.flex_column} ${Styles.pl_0}`} id="sub-menu" style={{ display: 'none' }}>
                  {subNav.length > 0 && subNav.map(({ to, name, exact }, index) => (
                    <li key={index} className={`${Styles.nav_item} sub-menu-item nav-item`} id="sub-menu-item" >
                      <a className={` ${Styles.nav_link}  ${Styles.text_capitalize} nav-sub-link nav-link text_center`} id={`navItem-sublink-${index}`}
                        onClick={(e) => {
                          removeActiveClass(index);
                          document.getElementById(`navItem-sublink-${index}`).classList.add('active');
                          router.push(to);
                          TogglesubSidebar()
                        }}>
                        <span> {name} </span>
                      </a>
                    </li>
                  ))}
                </ul>
              }
            </li>
          ))}
        </ul>

      </div>
    </aside>
  );
}

export default React.memo(Sidebar)