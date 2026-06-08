export interface Task {
  id: string
  title: string
  category: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  priorityColor: string
  estimatedTime: string
  estimatedHours: number
  loggedTime: number // in seconds
  status: 'In Progress' | 'Pending' | 'Completed' | 'Overdue'
  dueDate: string
  dueDateLabel: string
  description: string
  tags: string[]
}
