'use client';
import React, { Suspense } from 'react';
import { SidebarProvider } from '../ui/sidebar';
import { SideBar } from '../sidebar';
import Navbar from '../navbar';
import { AuthAdminProvider } from '@/context/auth-admin-context';

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <AuthAdminProvider>
            <Suspense>
                <SidebarProvider className="bg-sidebar">
                    <SideBar />
                    <div className="w-full border overflow-hidden md:m-2 md:rounded-2xl flex flex-col h-screen md:h-[calc(100vh-16px)] relative bg-background">
                        <Navbar />
                        <div className="flex-1 overflow-auto h-full mt-2 px-6 py-2">
                            {children}
                        </div>
                    </div>
                </SidebarProvider>
            </Suspense>
        </AuthAdminProvider>
    );
};

export default Layout;
