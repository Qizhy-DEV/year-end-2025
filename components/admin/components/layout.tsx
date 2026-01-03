"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../libs/auth";
import { Users, Gift, QrCode, LogOut, Settings, Menu, List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/libs/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {

    return children
}
