import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';
import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import AnimatedThemeToggle from './components/AnimatedThemeToggle';
import { getAllRoutes } from '../sidebar/data/sidebar-item';

const Navbar = () => {
    const pathname = usePathname();
    const { toggleSidebar } = useSidebar();
    const routes = useMemo(() => getAllRoutes(), []);

    const routeName = useMemo(() => {
        return routes.find((r) => r.route === pathname)?.name ?? 'Not Found';
    }, [routes, pathname]);

    return (
        <div className="flex flex-col gap-2">
            <div className="w-full h-16 border-b flex items-center py-5 justify-between px-6">
                <div className="flex items-center gap-4 w-full h-full">
                    <PanelLeft
                        onClick={toggleSidebar}
                        className="size-4 cursor-pointer mr-2"
                    />
                    <Separator orientation="vertical" className="h-1/2" />
                    <p>{routeName}</p>
                </div>
                <div className="flex items-center gap-4 h-full">
                    <AnimatedThemeToggle />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
