'use client';
import { usePathname } from "next/navigation";
import { getMenuItems } from "@/app/lib/routes";
import { useSidebarState } from "@/app/hooks/useSidebarState";
import MenuItemComponent from "@/app/components/global/MenuItem";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/app/contexts/UserContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { toggleDropdown, isDropdownOpen } = useSidebarState();
  const { user } = useUser();
  const menuItems = getMenuItems(user!.id!);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
        aria-label="Menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside className={`
        fixed md:sticky top-0 right-0 md:left-0 md:right-auto z-40 
        h-screen w-64 bg-white shadow-md p-4 overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 md:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <MenuItemComponent
                key={item.href}
                item={item}
                pathname={pathname}
                userId={user!.id!}
                isOpen={isDropdownOpen(item.href)}
                toggleDropdown={toggleDropdown}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}