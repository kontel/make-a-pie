import type { Pie, Vote } from '@prisma/client'

export type PieWithVotes = Pie & {
  votes: Vote[]
}

export type { Pie, Vote }
