"use client";

import useSeller from "@/hooks/useSeller";
import useSidebar from "@/hooks/useSidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./Sidebar.styles";
import Link from "next/link";
import SidebarItem from "./Sidebar.item";
import Home from "@/assets/icons/Home";
import SidebarMenu from "./Sidebar.menu";
import {
  BellPlus,
  BellRing,
  CalendarPlus,
  ListOrdered,
  LogOut,
  Mail,
  PackageSearch,
  Settings,
  SquarePlus,
  TicketPercent,
} from "lucide-react";
import Payments from "@/assets/icons/Payments";

const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href={"/"} className="flex justify-center text-center gap-4">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-12 bg-white rounded-full"
            />
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name}
              </h3>
              <h5 className="text-xs font-normal text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<Home fill={getIconColor("/dashboard")} />}
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />
          <div className="mt-2 block">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                title="Orders"
                icon={
                  <ListOrdered
                    size={24}
                    color={getIconColor("/dashboard/orders")}
                  />
                }
                isActive={activeSidebar === "/dashboard/orders"}
                href="/dashboard/orders"
              />
              <SidebarItem
                title="Payments"
                icon={<Payments fill={getIconColor("/dashboard/payments")} />}
                isActive={activeSidebar === "/dashboard/payments"}
                href="/dashboard/payments"
              />
            </SidebarMenu>
            <SidebarMenu title="Products">
              <SidebarItem
                title="Create Product"
                isActive={activeSidebar === "/dashboard/create-product"}
                href="/dashboard/create-product"
                icon={
                  <SquarePlus
                    size={24}
                    color={getIconColor("/dashboard/create-product")}
                  />
                }
              />
              <SidebarItem
                title="All Products"
                href="/dashboard/all-products"
                isActive={activeSidebar === "/dashboard/all-products"}
                icon={
                  <PackageSearch
                    size={24}
                    color={getIconColor("/dashboard/all-products")}
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Events">
              <SidebarItem
                title="Create Event"
                href="/dashboard/create-event"
                isActive={activeSidebar === "/dashboard/create-event"}
                icon={
                  <CalendarPlus
                    size={24}
                    color={getIconColor("/dashboard/create-event")}
                  />
                }
              />
              <SidebarItem
                title="All Events"
                href="/dashboard/all-events"
                isActive={activeSidebar === "/dashboard/all-events"}
                icon={
                  <BellPlus
                    size={24}
                    color={getIconColor("/dashboard/all-events")}
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Controllers">
              <SidebarItem
                title="Inbox"
                href="/dashboard/inbox"
                isActive={activeSidebar === "/dashboard/inbox"}
                icon={
                  <Mail size={24} color={getIconColor("/dashboard/inbox")} />
                }
              />
              <SidebarItem
                title="Settings"
                href="/dashboard/settings"
                isActive={activeSidebar === "/dashboard/settings"}
                icon={
                  <Settings
                    size={24}
                    color={getIconColor("/dashboard/settings")}
                  />
                }
              />
              <SidebarItem
                title="Notifications"
                href="/dashboard/notifications"
                icon={
                  <BellRing
                    size={24}
                    color={getIconColor("/dashboard/notifications")}
                  />
                }
                isActive={activeSidebar === "/dashboard/notifications"}
              />
            </SidebarMenu>
            <SidebarMenu title="Extras">
              <SidebarItem
                title="Discount Codes"
                href="/dashboard/discount-codes"
                isActive={activeSidebar === "/dashboard/discount-codes"}
                icon={
                  <TicketPercent
                    size={24}
                    color={getIconColor("/dashboard/discount-codes")}
                  />
                }
              />
              <SidebarItem
                isActive={activeSidebar === "/logout"}
                title="Logout"
                href="/"
                icon={<LogOut size={24} color={getIconColor("/logout")} />}
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;
