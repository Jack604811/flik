"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  PlusCircle,
  Search,
  ArrowUpRightSquare,
  Copy,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { getWorkspaces } from "@/server/actions/workspace.action";
import { updateCurrentWorkspace } from "@/server/actions/user.action";
import { getSiteData } from "@/server/actions/domain.action";
import { AFTER_SIGNIN_REDIRECT_URL } from "@/app-settings";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/main/empty-state";
import { LogoutButton } from "@/components/auth/logout-button";

type Workspace = {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  subdomain: string;
};

export default function WorkspaceView() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error } = useSWR("workspaces", getWorkspaces);
  const { data: session } = useSession();
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [externalLinks, setExternalLinks] = useState<{ [id: string]: string }>(
    {}
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isLoading = !data && !error;

  useEffect(() => {
    if (data) {
      const Workspaces: Workspace[] = data.workspaces.map((workspace: any) => ({
        id: workspace.id,
        name: workspace.siteName || "Untitled Workspace",
        description: workspace.aboutUs || "No description available.",
        logo: workspace.logo || null,
        subdomain: workspace.subdomain,
      }));
      setWorkspaces(Workspaces);

      Workspaces.forEach(async (workspace) => {
        const siteData = await getSiteData(
          `${workspace.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
        );
        setExternalLinks((prev) => ({
          ...prev,
          [workspace.id]: siteData
            ? `https://${siteData.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
            : "#",
        }));
      });
    }
  }, [data]);

  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWorkspaceClick = async (workspaceId: string) => {
    if (session?.user?.id) {
      await updateCurrentWorkspace(session.user.id, workspaceId);

      // Update the local storage cache (so the switcher sees the new workspace)
      if (typeof window !== "undefined") {
        const savedCache = window.localStorage.getItem("workspaceCache");
        if (savedCache) {
          const parsedCache = JSON.parse(savedCache);
          parsedCache.currentWorkspaceId = workspaceId;
          window.localStorage.setItem("workspaceCache", JSON.stringify(parsedCache));
        }
      }

      router.push(AFTER_SIGNIN_REDIRECT_URL);
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  if (error) {
    return error;
  }

  return (
    <TooltipProvider>
        {/* Header and Search */}
        <header className="sticky top-0 z-10 hidden md:flex flex-row w-full h-16 bg-background px-4 items-center justify-between gap-2 border-b">
        <div className="flex w-full items-center gap-2 py-5">
          {/* <SidebarTrigger className="-ml-1 h-4 w-5 text-muted-foreground" />
          <Separator orientation="vertical" className="mr-2 h-4" /> */}
          <h1 className="text-lg font-semibold whitespace-nowrap">Workspaces</h1>
        </div>
        <div className="relative w-[460px]">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-16"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <span className="text-xs text-gray-500 border bg-muted/50 rounded px-1 py-0.5">
              ⌘ K
            </span>
          </span>
        </div>
        <Link href="/create-workspace">
          <Button 
          variant="add"
          className="h-10 gap-1 xs:rounded-full lg:rounded-md"
          >
            New Workspace
          </Button>
        </Link>
      </header>
        <div className="mt-16 mx-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="h-[80vh]">
            <EmptyState
            title={searchTerm ? "No results found" : "No workspaces found"}
            description={searchTerm ? "Try adjusting your search or filters." : "Start by adding a new workspace to see it here."}
            imageUrl="/placeholder.svg"
            buttonLabel="Add Workspace"
            onButtonClick={() => window.location.href = "/create-workspace"}
          />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className="flex flex-col cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => handleWorkspaceClick(workspace.id)}
              >
                <div className="px-6 pt-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Image
                        src={workspace.logo || "/placeholder.svg"}
                        alt={`${workspace.name} logo`}
                        width={40}
                        height={40}
                        className="rounded-full w-12 h-12 object-cover"
                        priority={true}
                      />
                      <span className="text-xl font-bold">{workspace.name}</span>
                    </div>
                    <button className="text-muted-foreground hover:text-primary">
                      <ArrowUpRightSquare className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-lg text-gray-500 mb-6 truncate">
                    {workspace.description}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="mt-auto bg-gray-50 px-6 py-4 rounded-b-lg text-[15px] text-gray-500 flex items-center justify-between shadow-[0_-1px_1px_rgba(0,0,0,0.05)] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(workspace.id);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span>ID: {workspace.id}</span>
                        <Copy className="h-4 w-4 hover:text-primary" />
                      </div>
                      <span>3 days ago</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{copiedId === workspace.id ? "Copied!" : "Click to Copy ID"}</span>
                  </TooltipContent>
                </Tooltip>
              </Card>
            ))}
          </div>
        )}
        </div>
    </TooltipProvider>
  );
}
