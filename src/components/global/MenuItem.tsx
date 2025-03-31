'use client';
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { MenuItem, SubMenuItem } from "@/lib/routes";

export default function MenuItemComponent({ item, pathname, userId, isOpen, toggleDropdown }: MenuItemProps) {
  const isActive = 
    (pathname === item.href || 
    (pathname.startsWith(item.href + '/') && item.href !== `/users/${userId}`) || 
    (item.href === `/users/${userId}` && pathname === `/users/${userId}`)) && item.href !== '/users';

  return (
    <li className="flex flex-col">
      <div 
        className={`flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer ${
          isActive ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
        }`}
        onClick={() => {
          if (item.hasDropdown) {
            toggleDropdown(item.href);
          }
        }}
      >
        <div className="flex items-center">
          {item.icon}
          {item.hasDropdown ? (
            <span>{item.label}</span>
          ) : (
            <Link href={item.href}>{item.label}</Link>
          )}
        </div>
        {item.hasDropdown && (
          isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        )}
      </div>
      
      {item.hasDropdown && isOpen && (
        <SubMenuItems items={item.dropdownItems} pathname={pathname} />
      )}
    </li>
  );
}

function SubMenuItems({ items, pathname }: { items?: SubMenuItem[]; pathname: string }) {
  if (!items) return null;
  
  return (
    <ul className="ml-6 mt-2 space-y-1">
      {items.map((subItem) => (
        <li key={subItem.href}>
          <Link 
            href={subItem.href}
            className={`block p-2 rounded-md text-sm transition-colors ${
              pathname === subItem.href
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {subItem.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

interface MenuItemProps {
  item: MenuItem;
  pathname: string;
  userId: number
  isOpen: boolean;
  toggleDropdown: (key: string) => void;
}