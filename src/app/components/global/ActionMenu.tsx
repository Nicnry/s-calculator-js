import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export type ActionItem = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  isLoading?: boolean;
};

interface ActionMenuProps {
  actions: ActionItem[];
  position?: 'left' | 'right';
  buttonSize?: number;
  menuWidth?: number;
  className?: string;
}

export default function ActionMenu({
  actions,
  position = 'right',
  buttonSize = 20,
  menuWidth = 48,
  className = '',
}: ActionMenuProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  function getVariantClasses(variant: ActionItem['variant'] = 'default') {
    switch (variant) {
      case 'danger':
        return 'text-red-600 hover:bg-red-50';
      case 'success':
        return 'text-green-600 hover:bg-green-50';
      case 'warning':
        return 'text-yellow-600 hover:bg-yellow-50';
      default:
        return 'text-gray-700 hover:bg-gray-100';
    }
  }

  function renderMenuItem(action: ActionItem, index: number) {
    const itemClasses = `flex items-center w-full text-left px-4 py-2 text-sm ${getVariantClasses(action.variant)}`;
    
    const content = (
      <>
        {action.isLoading ? (
          <span className="inline-block w-4 h-4 mr-2 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        ) : (
          <span className="mr-2">{action.icon}</span>
        )}
        {action.isLoading ? `${action.label}...` : action.label}
      </>
    );

    if (action.href) {
      return (
        <a 
          key={index} 
          href={action.href}
          className={itemClasses}
          onClick={() => {
            setMenuOpen(false);
            action.onClick?.();
          }}
        >
          {content}
        </a>
      );
    }

    return (
      <button 
        key={index} 
        className={itemClasses}
        onClick={() => {
          action.onClick?.();
          if (!action.isLoading) {
            setMenuOpen(false);
          }
        }}
        disabled={action.isLoading}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button 
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Options"
      >
        <MoreVertical size={buttonSize} />
      </button>
      
      {menuOpen && (
        <div 
          className={`absolute ${position}-0 mt-2 w-${menuWidth} bg-white rounded-md shadow-lg z-10 border border-gray-200`}
          style={{ width: `${menuWidth === 48 ? '12rem' : menuWidth + 'px'}` }}
        >
          <div className="py-1">
            {actions.map((action, index) => renderMenuItem(action, index))}
          </div>
        </div>
      )}
    </div>
  );
}
