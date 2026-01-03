import {
  SidebarFooter as SidebarFooterElement,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthAdmin } from "@/context/auth-admin-context";
import { LogOut } from "lucide-react";

const SidebarFooter = () => {
  const { logout } = useAuthAdmin();
  return (
    <SidebarFooterElement>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={logout}
            className="text-red-500 hover:text-red-600 ml-2 hover:bg-red-50"
            tooltip="Đăng xuất"
          >
            <LogOut />
            <span>Đăng xuất</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooterElement>
  );
};

export default SidebarFooter;
