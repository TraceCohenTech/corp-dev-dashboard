export interface Acquisition {
  target: string
  year: number
  dealSize: string
  description: string
  failed?: boolean
}

export interface CVCArm {
  name: string
  fundSize: string
  investments: number | string
}

export interface CorpDevContact {
  name: string
  title: string
  linkedIn: string
}

export type MATier = 'Very Active' | 'Active' | 'Moderate' | 'Low' | 'Minimal' | 'N/A'

export interface Company {
  name: string
  ticker: string
  tier: MATier
  dealCount: number
  totalSpend: string
  totalSpendNum: number // in millions, for sorting
  corpDev: CorpDevContact
  cvc: CVCArm | null
  acquisitions: Acquisition[]
  notes: string
}
