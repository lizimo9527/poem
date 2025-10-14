export interface Poem {
  id: number
  title: string
  author: string
  dynasty: string
  content: string
  tags: string[]
  translation?: string
  explanation?: string
}

export interface Author {
  id: number
  name: string
  dynasty: string
  intro: string
  poemsCount: number
}