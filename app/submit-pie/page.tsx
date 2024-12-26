'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePost } from '@/hooks/useApi'

export default function SubmitPie() {
  const [userName, setUserName] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const router = useRouter()
  const [createPie] = usePost('/api/pies')

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    if (!storedName) {
      router.push('/')
    } else {
      setUserName(storedName)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName) return

    // In a real application, you would upload the image to a storage service
    // and get a URL back. For this example, we'll just use a placeholder.
    const imageUrl = '/placeholder.svg'

    try {
      await createPie({ title, description, imageUrl, userName })
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to submit pie:', error)
    }
  }

  if (!userName) {
    return null
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Pie</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Pie Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Short description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Pie
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
