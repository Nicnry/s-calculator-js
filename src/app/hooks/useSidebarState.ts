'use client';
import { useState } from "react";

export function useSidebarState() {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isDropdownOpen = (key: string): boolean => {
    return !!openDropdowns[key];
  };

  return {
    openDropdowns,
    toggleDropdown,
    isDropdownOpen
  };
}