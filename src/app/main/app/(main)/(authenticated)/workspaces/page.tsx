'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  PlusCircle,
  Search,
  ArrowUpRightSquare,
  Copy,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { getWorkspaces } from '@/server/actions/workspace.action';
import { updateCurrentWorkspace } from '@/server/actions/user.action';
import { getSiteData } from '@/server/actions/domain.action';
import { AFTER_SIGNIN_REDIRECT_URL } from '@/app-settings';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Workspace = {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  subdomain: string;
};

export default function WorkspaceView() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, error } = useSWR('workspaces', getWorkspaces);
  const { data: session } = useSession();
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [externalLinks, setExternalLinks] = useState<{ [id: string]: string }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null); // Track the ID being copied
  const isLoading = !data && !error;

  useEffect(() => {
    if (data) {
      const Workspaces: Workspace[] = data.workspaces.map((workspace: any) => ({
        id: workspace.id,
        name: workspace.siteName || 'Untitled Workspace',
        description: workspace.aboutUs || 'No description available.',
        logo: workspace.logo || null,
        subdomain: workspace.subdomain,
      }));
      setWorkspaces(Workspaces);

      Workspaces.forEach(async (workspace) => {
        const siteData = await getSiteData(`${workspace.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
        setExternalLinks((prev) => ({
          ...prev,
          [workspace.id]: siteData ? `https://${siteData.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : '#',
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
      router.push(AFTER_SIGNIN_REDIRECT_URL);
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id)
      .then(() => {
        setCopiedId(id); // Show "Copied!" message
        setTimeout(() => setCopiedId(null), 1500); // Reset the tooltip after 1.5 seconds
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  if (error) {
    return <div>Error loading workspaces.</div>;
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search workspaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <button className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
              <PlusCircle className="mr-2 h-4 w-4" /> New Workspace
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No workspaces found. Try adjusting your search.</p>
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
                        src={workspace.logo || '/placeholder.svg'}
                        alt={`${workspace.name} logo`}
                        width={40}
                        height={40}
                        className="rounded-full w-12 h-12 object-cover"
                      />
                      <span className="text-xl font-bold">{workspace.name}</span>
                    </div>
                    <button className="text-muted-foreground hover:text-primary">
                      <ArrowUpRightSquare className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-lg text-gray-500 mb-6 truncate">{workspace.description}</p>
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
                    <span>{copiedId === workspace.id ? 'Copied!' : 'Click to Copy ID'}</span>
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
