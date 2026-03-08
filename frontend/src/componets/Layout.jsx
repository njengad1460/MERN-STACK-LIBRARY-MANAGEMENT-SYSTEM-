// Layout.jsx is the "skeleton" of your application. It ensures that the navigation, sidebar, and branding remain consistent while the central content changes based on the URL.

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Home, 
  User, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Library
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth(); // Dynamic UI: By pulling user and isAdmin from your context, you can make the layout "smart."
  // ex you can show the user's name in the header or hide the "Admin Dashboard" link if the user doesn't have the correct permissions.
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [ // Role-Based Navigation Arrays
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Books', href: '/books', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const adminNavigation = [
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'Transactions', href: '/admin/transactions', icon: FileText },
  ];

  const NavItem = ({ item, mobile = false }) => ( // The Reusable NavItem Component
    //  DRY (Don't Repeat Yourself): You have two different menus (Desktop and Mobile)
    <NavLink // Automatic Styling: Unlike a standard Link, NavLink knows if the current URL matches its to prop.
      to={item.href}
      className={({ isActive }) => // Your code uses a function inside className to swap styles (e.g., changing colors to primary-700 when active).
        `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
          isActive
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        } ${mobile ? 'text-base px-3 py-2' : ''}`
      }
      onClick={() => mobile && setSidebarOpen(false)}
    >
      <item.icon
        className={`mr-3 shrink-0 h-5 w-5 ${mobile ? 'h-6 w-6' : ''}`}
        aria-hidden="true"
      />
      {item.name}
    </NavLink>
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)} // It provides a clear visual signal that the background is inactive. 
                                              // By adding the onClick handler here, you allow users to close the menu simply by tapping anywhere outside of it—a standard mobile behavior users expect.
        />
        
        {/* Mobile sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="shrink-0 flex items-center px-4 mb-8">
              <Library className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LibraryMS</span>
            </div>
            
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} mobile />
              ))}
              
              {isAdmin && ( // Role-Based Rendering
              //  uses the isAdmin boolean from your AuthContext to determine whether to show the "Manage Users" and "Transactions" links
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin
                  </p>
                  <div className="mt-2 space-y-1">
                    {adminNavigation.map((item) => (
                      <NavItem key={item.name} item={item} mobile />
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>
          
          <div className="shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700"> 
                  {user?.firstName} {user?.lastName} 
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto p-2 text-gray-400 hover:text-gray-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0"> 
        {/* The lg:flex class tells Tailwind: "Once the screen is at least 1024px wide, stop being hidden and display as a flex container." */}
        <div className="flex flex-col w-64">
          {/* By setting a specific width (w-64, which is 16rem or 256px) and using shrink-0, you ensure that the sidebar stays exactly that size. */}
          <div className="flex flex-col h-0 flex-1 bg-white shadow-sm"> 
            {/* This block is divided into three distinct vertical zones: */}
            <div className="flex items-center h-16 shrink-0 px-4 border-b border-gray-200">
              <Library className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LibraryMS</span>
            </div>
            
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
              {/* the overflow-y-auto ensures the sidebar gets its own scrollbar, rather than making the whole page scroll awkwardly. */}
              <nav className="flex-1 px-2 space-y-1"> 
                {/* Semantic Navigation */}
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
                
                {isAdmin && (
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Admin
                    </p>
                    <div className="mt-2 space-y-1">
                      {adminNavigation.map((item) => (
                        <NavItem key={item.name} item={item} />
                      ))}
                    </div>
                  </div>
                )}
              </nav>
            </div>
            
            <div className="shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* By using flex-1, you’re telling this div: "Take up all the remaining space that the sidebar didn't use." */}
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-white px-4 py-2 border-b border-gray-200">
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <div className="flex items-center">
              <Library className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">LibraryMS</span>
            </div>
            
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 




/*
2. The Mobile Top-Bar (lg:hidden)
Since your sidebar is hidden on mobile, the user needs a way to actually open it.

The Hamburger Menu (Menu icon): This button triggers setSidebarOpen(true), which slides out the mobile menu we discussed earlier.

Visual Branding: It repeats the LibraryMS logo. This is important for Brand Consistency; users should always know what app they are in, even if the sidebar is closed.

The "Centering Spacer": That empty div with w-10 is a clever CSS trick. It balances the "Menu" button on the left, ensuring the logo in the middle stays perfectly centered.

3. The Page Content Area (<main>)
Independent Scrolling (overflow-y-auto): This is critical. You want your Sidebar to stay fixed while only the Main Content scrolls. This keeps the navigation always within reach of the user.

Focus Management (focus:outline-none): This helps with accessibility, ensuring that when a user navigates between pages, the focus doesn't create awkward outlines on the main container.

4. The Outlet (The Heart of the Layout)
Dynamic Injection: This is where the magic happens. When the URL is /books, the Books component renders here. When it's /profile, the Profile component renders here.

Efficiency: Because the Outlet is inside this layout, React doesn't have to re-render the Sidebar or Header when you switch pages. This makes your app feel much faster and smoother */