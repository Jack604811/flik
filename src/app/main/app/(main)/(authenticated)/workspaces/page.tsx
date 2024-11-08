'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlusCircle, ChevronRight, Grid, List, Search, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { getWorkspaces } from '@/server/actions/workspace.action';
import { updateCurrentWorkspace } from '@/server/actions/user.action';
import { getSiteData } from '@/server/actions/domain.action';
import { AFTER_SIGNIN_REDIRECT_URL } from '@/app-settings';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';

type Workspace = {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  subdomain: string;
};

export default function WorkspaceView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { data, error } = useSWR('workspaces', getWorkspaces);
  const { data: session } = useSession();
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [externalLinks, setExternalLinks] = useState<{ [id: string]: string }>({});
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

      // Fetch and store external links
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

  const handleCreateWorkspace = () => {
    console.log('Creating a new workspace');
    // Implement create workspace logic here
  };

  const SkeletonCard = ({ isGrid }: { isGrid: boolean }) => (
    <Card className={`flex ${isGrid ? 'flex-col' : 'flex-row items-center'}`}>
      {isGrid ? (
        <>
          <CardHeader className="relative">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[80%]" />
          </CardContent>
          <CardFooter className="flex justify-between mt-auto">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[80px]" />
          </CardFooter>
        </>
      ) : (
        <div className="flex items-center w-full p-4">
          <Skeleton className="h-10 w-10 rounded-full mr-4" />
          <div className="flex-grow">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px] mt-2" />
          </div>
        </div>
      )}
    </Card>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <Image src="/placeholder.svg" alt="Placeholder" width={48} height={48} className="mx-auto" />
      <h2 className="mt-4 text-lg font-semibold">No workspaces yet</h2>
      <p className="mt-2 text-sm text-gray-500">
        Get started by creating your first workspace
      </p>
      <Button onClick={handleCreateWorkspace} className="mt-4">
        <PlusCircle className="mr-2 h-4 w-4" /> Create Workspace
      </Button>
    </div>
  );

  if (error) {
    return <div>Error loading workspaces.</div>;
  }

  return (
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
          <Button onClick={handleCreateWorkspace}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Workspace
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      {workspaces.length > 0 && (
        <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')} className="mb-6">
          <TabsList className="grid w-24 grid-cols-2">
            <TabsTrigger value="grid"><Grid className="h-4 w-4" /></TabsTrigger>
            <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Content */}
      {isLoading ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} isGrid={view === 'grid'} />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <EmptyState />
      ) : filteredWorkspaces.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No workspaces found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredWorkspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className={`flex ${view === 'grid' ? 'flex-col' : 'flex-row items-center'} cursor-pointer transition-shadow hover:shadow-md`}
              onClick={() => handleWorkspaceClick(workspace.id)}
            >
              <CardHeader className="relative">
                <div className="flex items-center gap-4">
                  <Image
                    src={workspace.logo || "/placeholder.svg"}
                    alt={`${workspace.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle>{workspace.name}</CardTitle>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-2">{workspace.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    const externalLink = externalLinks[workspace.id] || '#';
                    window.open(externalLink, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardFooter className="flex justify-end mt-auto">
                <Button variant="ghost" size="sm" onClick={() => handleWorkspaceClick(workspace.id)}>
                  View <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
