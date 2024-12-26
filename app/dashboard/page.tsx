'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (!storedName) {
      router.push('/')
    } else {
      setUserName(storedName)
    }
  }, [router])

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
              <Button className="w-full">Submit Pie</Button>
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
              <Button className="w-full">Vote</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

