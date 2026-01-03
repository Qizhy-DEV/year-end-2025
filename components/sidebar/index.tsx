'use client';

import { Sidebar } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import SidebarHeader from './components/sidebar-header';
import SidebarContent from './components/sidebar-content';
import SidebarFooter from './components/sidebar-footer';

export function SideBar() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Sidebar collapsible="icon" className="overflow-hidden p-0 border-0!">
            <SidebarHeader />
            <SidebarContent />
            <SidebarFooter />
        </Sidebar>
    );
}
