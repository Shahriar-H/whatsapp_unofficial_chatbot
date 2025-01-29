import React from 'react'
import HomePage from './Pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Numberlist from './Pages/Numberlist'
import Importxldata from './Pages/Importxldata'
import Schedule from './Components/Schedule'
import Setup from './Pages/Setup'
import MessageHistoryTable from './Pages/History'
import Schedulelist from './Pages/ScheduleList'
import PrivetRoute from './Components/PrivetRoute'
import Sectors from './Pages/Sectors'
import CompleteCustomer from './Pages/CompleteCustomer'
import PositiveCustomer from './Pages/PositiveCumtomer'
import Employees from './Pages/Employees'
import Meetings from './Pages/Meetings'
import Login from './Pages/Login'
import Notifications from './Pages/Notification'
import Todaysschedule from './Pages/Todaysschedule'
import AssignTask from './Pages/AssignTask'
import Dashboard from './Pages/Dashboard'
import Messages from './Pages/Messages'

export default function () {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}>
            <Route path='/' element={<PrivetRoute><Dashboard/></PrivetRoute>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/sectors' element={<PrivetRoute><Sectors/></PrivetRoute>} />

            <Route path='/complete-customer-data' element={<PrivetRoute><CompleteCustomer/></PrivetRoute>} />
            <Route path='/positive-customer-data' element={<PrivetRoute><PositiveCustomer/></PrivetRoute>} />
            <Route path='/employees' element={<PrivetRoute><Employees/></PrivetRoute>} />
            <Route path='/meetings' element={<PrivetRoute><Meetings/></PrivetRoute>} />
            <Route path='/notification' element={<PrivetRoute><Notifications/></PrivetRoute>} />
            <Route path='/todaysscedule' element={<PrivetRoute><Todaysschedule/></PrivetRoute>} />
            <Route path='/assigntask' element={<PrivetRoute><AssignTask/></PrivetRoute>} />

            <Route path='/wa/' element={<PrivetRoute><Home/></PrivetRoute>} />

            <Route path='/wa/add-number' element={<PrivetRoute><Numberlist/></PrivetRoute>} />
            <Route path='/wa/import-number' element={<PrivetRoute><Importxldata/></PrivetRoute>} />
            <Route path='/wa/set-schedule' element={<PrivetRoute><Schedule/></PrivetRoute>} />
            <Route path='/wa/setup' element={<Setup/>} />
            <Route path='/wa/history' element={<PrivetRoute><MessageHistoryTable/></PrivetRoute>} />
            <Route path='/wa/my-schedule' element={<PrivetRoute><Schedulelist/></PrivetRoute>} />
            <Route path='/wa/messages' element={<PrivetRoute><Messages/></PrivetRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
