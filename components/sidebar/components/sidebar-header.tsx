import {
    SidebarHeader as SidebarHeaderElement,
    useSidebar,
} from '@/components/ui/sidebar';
import { useScreenWidth } from '@/context/screen-width';
import { cn } from '@/lib/utils';

const SidebarHeader = () => {
    const { open } = useSidebar();

    const { isXs, isSm } = useScreenWidth();

    const display = open || isXs || isSm;

    return (
        <SidebarHeaderElement className="p-0">
            <div
                className={cn(
                    'flex items-center justify-center px-2 pt-4 pb-2',
                    display && 'justify-between pl-5'
                )}
            >
                <div className="flex items-center gap-2">

                    {display && (
                        <div className="flex flex-col gap-1">
                            <p className="translate-y-1 text-base font-semibold">
                                Administrator
                            </p>
                            <p className="text-xs whitespace-nowrap">
                                Management System
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SidebarHeaderElement>
    );
};

export default SidebarHeader;
