import React from "react";
import { SIDEBAR_ROUTES } from "@/app_settings";
import { Dock, DockIcon } from "@/components/magicui/dock";
import Link from 'next/link';

export function Docker() {
  // Exclude routes with names
  const filteredRoutes = SIDEBAR_ROUTES.filter(
    (route) => route.name !== "Billing" && route.name !== "Spots" && route.name !== "Extras"
  );

  return (
    <div className="relative w-full">
      <Dock direction="middle" className="rounded-none  bg-white border-t w-full justify-center dark:bg-black">
        {filteredRoutes.map((route) => (
          <DockIcon key={route.path}>
            <Link href={route.path} className="flex justify-center items-center">
              <route.icon className="w-5 h-5" />
            </Link>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
}

export default Docker;
