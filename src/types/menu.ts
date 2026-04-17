export interface MenuItem {
  id: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
}

export interface MenuSection {
  id: string
  title: string
  items: MenuItem[]
}

export interface AIAgent {
  id: string
  name: string
  description: string
  icon?: string
}

export interface AIAgentGroup {
  id: string
  label: string
  agents: AIAgent[]
}
