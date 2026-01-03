import {
    Gift,
    QrCode,
    Settings,
    UserIcon,
    Users,
} from 'lucide-react';

export interface SidebarItem {
    name: string;
    route: string;
    icon: any;
    childrens?: SidebarItem[];
}

export interface NavItem {
    name: string;
    items: SidebarItem[];
}

export const sidebarItems: NavItem[] = [
    {
        name: 'Year End Party',
        items: [
            {
                name: 'Người Tham Dự',
                icon: Users,
                route: '/admin/participants',
            },
            {
                name: 'Phần Thưởng',
                icon: Gift,
                route: '/admin/prizes',
            },
            {
                name: 'QR Scanner',
                icon: QrCode,
                route: '/admin/qr-scanner',
            },
        ],
    },
];

export const getAllRoutes = (): SidebarItem[] => {
    const routes: SidebarItem[] = [];

    [...sidebarItems].forEach((group) => {
        group.items.forEach((item) => {
            if (item.route) {
                routes.push(item);
            }
            if (item.childrens) {
                item.childrens.forEach((child) => {
                    routes.push(child);
                });
            }
        });
    });

    return routes;
};
