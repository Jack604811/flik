"use client";

import { useState } from "react";
import { useDomainStatus } from "./use-domain-status";
import { getSubdomain } from "@/server/helpers/domains";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export default function DomainConfiguration({ domain }: { domain: string }) {
  const [recordType, setRecordType] = useState<"A" | "CNAME">("A");

  const { status, domainJson } = useDomainStatus({ domain });

  if (!status || status === "Valid Configuration" || !domainJson) return null;

  const subdomain = getSubdomain(domainJson.name, domainJson.apexName);

  const txtVerification =
    (status === "Pending Verification" &&
      domainJson.verification.find((x: any) => x.type === "TXT")) ||
    null;

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4">
      <CardHeader>{/* Optional Card Title */}</CardHeader>
      <CardContent className="mb-6 space-y-6">
        {status === "Pending Verification" ? (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Verification in Progress</AlertTitle>
            <AlertDescription>
              The DNS records verification is in progress. It may take a few
              minutes or hours, depending on domain propagation time.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{status}</AlertTitle>
            <AlertDescription>
              There was an error verifying your domain. Please ensure your DNS
              records are set correctly.
            </AlertDescription>
          </Alert>
        )}

        {txtVerification ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center space-x-2">
              <h3 className="text-lg font-semibold">
                TXT Verification Record
              </h3>
              <Badge variant="secondary">Required</Badge>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>TXT</TableCell>
                    <TableCell>
                      {txtVerification.domain.slice(
                        0,
                        txtVerification.domain.length -
                          domainJson.apexName.length -
                          1
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {txtVerification.value}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground">
              Please add this TXT record to your DNS settings to verify domain
              ownership.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-start space-x-4">
              <button
                type="button"
                onClick={() => setRecordType("A")}
                className={`${
                  recordType === "A"
                    ? "border-black text-black dark:border-white dark:text-white"
                    : "border-transparent text-stone-400 dark:text-stone-600"
                } border-b-2 pb-1 text-sm transition-all duration-150`}
              >
                A Record{!subdomain && " (recommended)"}
              </button>
              <button
                type="button"
                onClick={() => setRecordType("CNAME")}
                className={`${
                  recordType === "CNAME"
                    ? "border-black text-black dark:border-white dark:text-white"
                    : "border-transparent text-stone-400 dark:text-stone-600"
                } border-b-2 pb-1 text-sm transition-all duration-150`}
              >
                CNAME Record{subdomain && " (recommended)"}
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center space-x-2 mt-4">
                <h3 className="text-lg font-semibold">DNS Configuration</h3>
                <ExternalLink className="h-4 w-4" />
                <Badge variant="secondary">Required</Badge>
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Hostname</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>TTL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{recordType}</TableCell>
                      <TableCell>
                        {recordType === "A" ? "@" : subdomain ?? "www"}
                      </TableCell>
                      <TableCell>
                        {recordType === "A"
                          ? "76.76.21.21"
                          : `cname.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                      </TableCell>
                      <TableCell>Auto</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <p className="text-sm text-muted-foreground">
                Please add this DNS record to your domain&apos;s DNS settings.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
