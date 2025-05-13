"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Publication {
  id: number;
  title: string;
  note?: string;
  embed_code: string;
  isActive: boolean;
}

export default function PublicationCard() {
  const [publication, setPublication] = useState<Publication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivePublication = async () => {
      try {
        // In a real application, fetch from API
        const response = await fetch("/api/latest-publications/active");
        const data = await response.json();
        setPublication(data);
      } catch (error) {
        console.error("Failed to fetch active publication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivePublication();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!publication) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{publication.title}</CardTitle>
        {publication.note && (
          <p className="text-sm text-muted-foreground">{publication.note}</p>
        )}
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: publication.embed_code }} />
      </CardContent>
    </Card>
  );
}
