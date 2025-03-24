"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { urlBase64ToUint8Array } from "@/lib/utils";
import useSWR from "swr";
import { getWebNotificationSubscription, handleWebNotificationSubscribe, handleWebNotificationUnsubscribe } from "@/server/actions/notification";
import { useSession } from "next-auth/react";

export function NotificationSettings() {
  const { data: session } = useSession();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  const { data, isLoading: fetchingSubscription, mutate,} = useSWR(null, async () => {
    const serializedSub = JSON.parse(JSON.stringify(subscription))
    const workspaceId = JSON.parse(localStorage.getItem("workspaceCache")??"{}").currentWorkspaceId;
    const webNotification = await getWebNotificationSubscription(session?.user?.id!, workspaceId, serializedSub.auth);
    if(webNotification){
      setPermission("granted");
    }
    return webNotification;
  }, {
    revalidateOnMount: true,
    keepPreviousData: true,
  });
 
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])
 
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub)
  }

  const handleNotificationToggle = async () => {
    setLoading(true);
    const workspaceId = JSON.parse(localStorage.getItem("workspaceCache")??"{}").currentWorkspaceId;
    try {
    
      if (permission === "granted") {
        const serializedSub = JSON.parse(JSON.stringify(subscription));
        const final = await handleWebNotificationUnsubscribe(session?.user?.id!,workspaceId, serializedSub.auth);
        if(final){
          await subscription?.unsubscribe();
          setSubscription(null);
        }
        setPermission("default");
        toast.success("Notifications disabled");
      } else {
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
        })
        setSubscription(sub)
        const serializedSub = JSON.parse(JSON.stringify(sub));
        
        await handleWebNotificationSubscribe(session?.user?.id!, workspaceId, serializedSub.auth, serializedSub);
        toast.success("Notifications enabled");
      }
    } catch (error) {
      toast.error("Failed to update notification settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how you receive notifications about your workspace activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            {permission === "granted" ? (
              <Bell className="h-5 w-5 text-primary" />
            ) : (
              <BellOff className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <h4 className="text-sm font-medium">Web Notifications</h4>
              <p className="text-sm text-muted-foreground">
                {permission === "granted"
                  ? "You will receive notifications about important updates"
                  : "Enable notifications to stay updated"}
              </p>
            </div>
          </div>
          <Button
            variant={permission === "granted" ? "destructive" : "default"}
            onClick={handleNotificationToggle}
            disabled={loading}
          >
            {loading ? (
              "Updating..."
            ) : permission === "granted" ? (
              "Disable"
            ) : (
              "Enable"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}