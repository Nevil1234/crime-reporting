export type CrimeReport = {
    id: string
    crimeType: string
    description?: string
    location: string
    isAnonymous: boolean
    evidence: string[]
    status: 'PENDING' | 'UNDER_INVESTIGATION' | 'RESOLVED'
    createdAt: Date
    updatedAt: Date
  }

export type EvidenceType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'

export interface FileUpload {
  name: string
  size: number
  type: string
  preview?: string
}