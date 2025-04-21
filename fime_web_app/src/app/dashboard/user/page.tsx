"use client";
import { Button } from "@/components/ui/button";
import http from "@/lib/http";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState<string>("");

  const fetchProfile = async () => {
    try {
      const res = await http.get("/auth/profile");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData((res as any).payload.email);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // const res = await http.get("/auth/profile");
  // const data: string = (res as any).payload.email;

  return (
    <div className="flex flex-col gap-4">
      <div>User Page</div>
      <div>{data}</div>
      <Button
        variant={"gradient"}
        className="d-flex"
        onClick={() => fetchProfile()}
      >
        fetch
      </Button>
    </div>
  );
}
