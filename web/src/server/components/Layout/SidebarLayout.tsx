'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';

type TSidebarLayoutProps = {
  children: React.ReactNode;
  isSidebarOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setSidebarOpen: (isOpen: boolean) => void;
};

const SidebarLayout = ({
  children,
  isSidebarOpen,
  setSidebarOpen,
}: TSidebarLayoutProps) => {
  const [showOverlay, setShowOverlay] = useState(true);

  const setSidebarState = useCallback(
    (open: boolean) => {
      if (open) {
        setSidebarOpen(true);
        setShowOverlay(true);
      } else {
        setSidebarOpen(false);
        setTimeout(() => {
          setShowOverlay(false);
        }, 250);
      }
    },
    [setSidebarOpen]
  );

  const toggleSidebar = useCallback(() => {
    setSidebarState(!isSidebarOpen);
  }, [isSidebarOpen, setSidebarState]);

  return (
    <>
      <div className={`w-full h-full top-0 left-0 right-0 z-20`}>
        {/* Side bar menu */}
        <div
          className={`w-64 h-full
                    m-0 z-20 bg-zinc-900
                    shadow-xl shadow-black md:shadow-none md:border-r md:border-zinc-800 rounded
                    fixed ${isSidebarOpen ? 'left-0' : '-left-64'}
                    transition-all duration-[250ms]`}
        >
          <div className='h-full flex flex-col overflow-y-auto'>
            <Sidebar toggle={toggleSidebar} />
          </div>
        </div>

        {/* Navbar */}
        <div className='fixed w-full flex flex-row justify-between items-center bg-zinc-900 border-b border-zinc-800 p-2 z-10'>
          {/* Burger button */}
          <div className='block'>
            <button
              className='flex items-center px-3 py-2 rounded'
              onClick={toggleSidebar}
            >
              <FontAwesomeIcon icon={faBars} size='2x' />
            </button>
          </div>

          {/* Logo */}
          <div className='w-full block h-14'>
            <figure>
              <img
                src='/nbw-white.png'
                alt='NoteBlockWorld logo'
                className='h-10 mx-auto my-2'
              />
            </figure>
          </div>
        </div>

        <div
          className={`h-full ${
            isSidebarOpen ? 'md:ml-64' : 'ml-0'
          } bg-zinc-900 pt-24 px-6 sm:px-10 transition-all duration-[250ms]`}
        >
          {children}
        </div>

        {/* Overlay when the sidebar is open on mobile */}
        {showOverlay && (
          <div
            className={`${
              isSidebarOpen ? 'opacity-50' : 'opacity-0'
            } md:hidden w-full h-full fixed z-10 top-0 left-0 right-0 bg-black transition-opacity duration-[250ms]`}
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </>
  );
};

export default SidebarLayout;