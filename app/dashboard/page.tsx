'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLocalStorage } from "usehooks-ts";
import { PieGridSkeleton } from "@/components/ui/pie-skeleton";

export default function Dashboard() {
  const [userName] = useLocalStorage("userName", "", {
    initializeWithValue: true,
  });
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userName) {
      router.push('/')
    } else {
      setIsLoading(false);
    }
  }, [router, userName])

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Pie Competition Dashboard</h1>
        <PieGridSkeleton />
      </div>
    );
  }

  if (!userName) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Pie</CardTitle>
            <CardDescription>
              Upload a photo and details of your pie
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/submit-pie">
              <Button className="w-full h-12">Submit Pie</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vote for Pies</CardTitle>
            <CardDescription>
              View and vote for other participants&apos; pies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/vote">
              <Button className="w-full h-12">Vote</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}