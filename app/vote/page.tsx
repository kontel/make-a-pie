'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useGet, usePost } from '@/hooks/useApi'

export default function Vote() {
  const [userName, setUserName] = useState<string | null>(null)
  const [votes, setVotes] = useState<{ [key: string]: number }>({})
  const router = useRouter()
  const { data: pies, error: piesError, isLoading: piesLoading } = useGet('/api/pies')
  const [createVote] = usePost('/api/votes')

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (!storedName) {
      router.push('/')
    } else {
      setUserName(storedName)
    }
  }, [router])

  const handleVote = async (pieId: string) => {
    if (!userName) return

    setVotes((prevVotes) => {
      const currentVotes = prevVotes[pieId] || 0
      const totalVotes = Object.values(prevVotes).reduce((a, b) => a + b, 0)
      
      if (currentVotes < 3 && totalVotes < 3) {
        const newVotes = { ...prevVotes, [pieId]: currentVotes + 1 }
        createVote({ stars: 1, userName, pieId })
        return newVotes
      }
      return prevVotes
    })
  }

  if (!userName || piesLoading) {
    return null
  }

  if (piesError) {
    return <div>Error: {piesError.message}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vote for Pies</h1>
      <p>You have {3 - Object.values(votes).reduce((a, b) => a + b, 0)} stars left to allocate.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pies && pies.map((pie: any) => (
          <Card key={pie.id}>
            <CardHeader>
              <CardTitle>{pie.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img src={pie.imageUrl} alt={pie.title} className="w-full h-48 object-cover rounded-md" />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">View Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{pie.title}</DialogTitle>
                  </DialogHeader>
                  <img src={pie.imageUrl} alt={pie.title} className="w-full h-64 object-cover rounded-md" />
                  <p>{pie.description}</p>
                </DialogContent>
              </Dialog>
              <Button 
                onClick={() => handleVote(pie.id)} 
                disabled={votes[pie.id] === 3 || Object.values(votes).reduce((a, b) => a + b, 0) === 3}
                className="w-full"
              >
                Vote ({votes[pie.id] || 0} stars)
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
