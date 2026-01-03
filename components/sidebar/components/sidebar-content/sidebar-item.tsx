import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { SidebarItem as SidebarItemType } from '../../data/sidebar-item';
import {
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
} from '@/components/ui/sidebar';

interface Props {
    sidebarItem: SidebarItemType;
}

const SidebarItem = ({ sidebarItem }: Props) => {
    const [open, setOpen] = React.useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const getSecondSegment = (route: string) => {
        return route.split('/')[2];
    };

    const checkActive = (route: string) => {
        return getSecondSegment(pathname) === getSecondSegment(route)
    };

    return (
        <Collapsible
            onOpenChange={setOpen}
            key={sidebarItem.name}
            className="group/collapsible"
        >
            <SidebarMenuItem key={sidebarItem.name}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        className={cn(
                            'rounded-md',
                            checkActive(
                                sidebarItem.route,
                            )
                                ? 'bg-primary/90 hover:bg-none!important text-white hover:text-white'
                                : ''
                        )}
                        asChild
                    >
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                !sidebarItem.childrens &&
                                    router.push(sidebarItem.route);
                            }}
                        >
                            <sidebarItem.icon />
                            <span>{sidebarItem.name}</span>
                            {sidebarItem.childrens && (
                                <SidebarMenuAction>
                                    <ChevronDown
                                        className={cn(
                                            'transition-all duration-200',
                                            !open && '-rotate-90'
                                        )}
                                    />
                                </SidebarMenuAction>
                            )}
                        </div>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent
                    className={cn(
                        sidebarItem.childrens ? 'mt-1 p-0' : 'hidden'
                    )}
                >
                    {sidebarItem.childrens?.map((child) => (
                        <SidebarMenuSub key={child.name}>
                            <SidebarMenuButton
                                className={cn(
                                    'rounded-md',
                                    checkActive(child.route)
                                        ? 'bg-primary/90 hover:bg-none!important mt-1 text-white hover:text-white'
                                        : ''
                                )}
                                asChild
                            >
                                <Link
                                    href={`${sidebarItem.route}${child.route}`}
                                >
                                    <child.icon />
                                    <span>{child.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuSub>
                    ))}
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

export default SidebarItem;
