import {
    SidebarContent as SidebarContentComponent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from '@/components/ui/sidebar';
import { sidebarItems } from '../../data/sidebar-item';
import SidebarItem from './sidebar-item';

const SidebarContent = () => {
    return (
        <SidebarContentComponent>
            {sidebarItems.map((navItem) => (
                <SidebarGroup
                    key={navItem.name}
                    className="flex justify-center pl-4"
                >
                    <SidebarGroupLabel>{navItem.name}</SidebarGroupLabel>
                    <SidebarGroupContent className="px-2">
                        <SidebarMenu>
                            {navItem.items.map((item) => (
                                <SidebarItem
                                    key={item.name}
                                    sidebarItem={item}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            ))}
        </SidebarContentComponent>
    );
};

export default SidebarContent;
