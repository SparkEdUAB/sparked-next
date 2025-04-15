import useNavigation from '@hooks/useNavigation';
import { Sidebar } from 'flowbite-react';
import Link from 'next/link';
import { AiOutlineMenu, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

const AdminSidebar = ({
  sidebarIsCollapsed,
  toggleSidebar,
}: {
  sidebarIsCollapsed: boolean;
  toggleSidebar: () => void;
}) => {
  const { fetchAdminMenuItems, isActiveMenuItem } = useNavigation();
  const menuItems = fetchAdminMenuItems();

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 transition-all duration-300 z-20 h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg ${
          sidebarIsCollapsed ? 'w-20' : 'w-64'
        } flex-none md:static md:block md:h-auto md:overflow-y-visible`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <span className={`font-bold text-lg ${sidebarIsCollapsed ? 'hidden' : 'block'}`}>Admin</span>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarIsCollapsed ? <AiOutlineArrowRight /> : <AiOutlineArrowLeft />}
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          <ul className="py-4 space-y-2">
            {menuItems
              .sort((a, b) => a.index - b.index)
              .map((i) => (
                <li key={i.key}>
                  <Link
                    href={i.link}
                    className={`flex items-center p-3 mx-2 rounded-lg transition-colors ${
                      isActiveMenuItem(i)
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${sidebarIsCollapsed ? 'justify-center' : 'justify-start'}`}
                  >
                    <span className="text-xl">{i.icon()}</span>
                    <span
                      className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                        sidebarIsCollapsed ? 'hidden' : 'block'
                      }`}
                    >
                      {i.label}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 z-10 transition-all duration-300 rounded-br-full cursor-pointer bg-gray-900/50 dark:bg-gray-900/60 md:hidden backdrop-blur-sm ${
          sidebarIsCollapsed ? 'w-0 h-0' : 'w-[200vmax] h-[200vmax]'
        }`}
      />
    </>
  );
};

export default AdminSidebar;
