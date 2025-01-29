import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation, useMatch, useNavigate, useNavigation, useParams, useSearchParams } from 'react-router-dom';

const SideMenu = ({isOpen,toggleMenu}) => {
const [parameters, setparameters] = useState('');
const {pathname} = useLocation()
console.log(pathname);
const [isWAMenuOpen, setisWAMenuOpen] = useState(true);


  return (
    <div className={`flex ${!isOpen?'w-64':'w-0'}`}>
      {/* Side Menu */}
      <div className={`fixed lg:static z-40 inset-y-0 top-16 left-0 transform ${!isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-[#f9fafc] overflow-scroll dark:bg-gray-800 ${!isOpen?'w-64':'w-0'} h-[570px] p-4`}>
        {/* <button
          className="text-white mb-8"
          onClick={toggleMenu}
        >
          {isOpen ? 'Close' : 'Open'} Menu
        </button> */}
        <nav className="space-y-4">
          <div>
            <Link to="/" className={`text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/'&&'bg-[#6c82a8]'} transition`}>Home</Link>

            {/* <Link to="/sectors" className={`text-gray-800 dark:text-[#e6efff] block hidden px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/sectors'&&'bg-[#6c82a8]'} transition`}>Sectors</Link> */}
            
            {/* <Link to="/complete-customer-data" className={`text-text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/complete-customer-data'&&'bg-[#6c82a8]'} transition`}>All Customers</Link> */}

            {/* <Link to="/positive-customer-data" className={`text-gray-800 dark:text-[#e6efff] block hidden px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/positive-customer-data'&&'bg-[#6c82a8]'} transition`}>Positive Customer</Link> */}

            {/* <Link to="/employees" className={`text-gray-800 dark:text-[#e6efff] block hidden px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/employees'&&'bg-[#6c82a8]'} transition`}>Employees</Link> */}

            {/* <Link to="/meetings" className={`text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/meetings'&&'bg-[#6c82a8]'} transition`}>Meetings</Link> */}

            {/* <Link to="/notification" className={`text-text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/notification'&&'bg-[#6c82a8]'} transition`}>Notification</Link> */}


            {/* <Link to="/todaysscedule" className={`text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/todaysscedule'&&'bg-[#6c82a8]'} transition`}>Todays schedule</Link> */}
            
            {/* <Link to="/assigntask" className={`text-gray-800 dark:text-[#e6efff] block hidden px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/assigntask'&&'bg-[#6c82a8]'} transition`}>Assigning Task</Link> */}


          </div>

          <div className='border-t border-gray-400'>
            <p onClick={()=>setisWAMenuOpen((prev)=>!prev)} className='text-text-gray-800 dark:text-[#e6efff] px-4 py-2 rounded hover:bg-[#6c82a8] w-full flex justify-between'>
              <span>Whatsapp</span> 
              <span><FontAwesomeIcon icon={!isWAMenuOpen?faChevronDown:faChevronUp} /></span></p>
            <div className={`pl-3 ${isWAMenuOpen?"h-auto":"h-0"} overflow-hidden`}>
              

                <Link to="/wa/" className={`text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/wa/'&&'bg-[#5c6067]'} transition`}>WA Home</Link>

                {/* <Link to="/wa/messages" className={`text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/wa/messages'&&'bg-[#4c4f55]'} transition`}>Messages</Link> */}

                <Link to="/wa/add-number" className={`text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/wa/add-number'&&'bg-[#6c82a8]'} transition`}>Numbers</Link>

                <Link to="/wa/import-number" className={`text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/wa/import-number'&&'bg-[#6c82a8]'} transition`}>Import Numbers</Link>

                <Link to="/wa/set-schedule" className={`text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/wa/set-schedule'&&'bg-[#6c82a8]'} transition`}>Add Schedule</Link>

                <Link to="/wa/my-schedule" className={`text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/wa/my-schedule'&&'bg-[#6c82a8]'} transition`}>My Schedule </Link>

                {/* <Link to="/wa/history" className={`text-text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/wa/history'&&'bg-[#6c82a8]'} transition`}>History</Link> */}

                {/* <Link to="/wa/setup" className={`text-text-gray-800 dark:text-[#e6efff] block px-4 py-2 rounded hover:bg-[#6c82a8] ${pathname==='/wa/setup'&&'bg-[#6c82a8]'} transition`}>Setup</Link> */}
            </div>
            
          </div>
        </nav>
        
      </div>

      {/* Main Content Area */}
      {/* <div className="flex-1 p-8">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md mb-8"
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faCoffee} />
        </button>
        
      </div> */}
    </div>
  );
};

export default SideMenu;
