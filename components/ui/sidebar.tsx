"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/libs/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
    ({ className, children, ...props }, ref) => {
        const [collapsed, setCollapsed] = React.useState(false);

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex h-full flex-col border-r bg-background transition-all duration-300",
                    collapsed ? "w-16" : "w-64",
                    className
                )}
                {...props}
            >
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-9 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md hover:bg-accent"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        );
    }
);
Sidebar.displayName = "Sidebar";

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    collapsed?: boolean;
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
    ({ className, collapsed, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center border-b px-4 py-4",
                    collapsed && "justify-center px-2",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("flex flex-col gap-2 p-4", className)}
            {...props}
        />
    );
});
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("mt-auto border-t p-4", className)}
            {...props}
        />
    );
});
SidebarFooter.displayName = "SidebarFooter";

interface SidebarMenuItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    collapsed?: boolean;
}

const SidebarMenuItem = ({
    href,
    icon,
    label,
    collapsed,
}: SidebarMenuItemProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center"
            )}
        >
            <div className="flex h-5 w-5 items-center justify-center">{icon}</div>
            {!collapsed && <span>{label}</span>}
        </Link>
    );
};

export {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenuItem,
};
