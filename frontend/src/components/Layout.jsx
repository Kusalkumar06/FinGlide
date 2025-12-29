import { Outlet } from 'react-router-dom'
import { IoMenuOutline } from "react-icons/io5"
import Footer from './Footer'
import SideBar from './SideBar'

function Layout() {

  return (
    <div className="min-h-screen flex flex-col">
      

      <div className="flex flex-1 w-full">
        {/* Desktop Sidebar */}
        <div className="">
          <SideBar />
        </div>

        {/* Mobile Sidebar */}
        {/* {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/70 z-40 xl:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-screen w-72 z-50 xl:hidden">
              <SideBar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </>
        )} */}

        {/* Content */}
        <main className="flex-1 md:ml-16 xl:ml-[296px]">
          <div className="px-4 py-5 sm:px-6 xl:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default Layout
