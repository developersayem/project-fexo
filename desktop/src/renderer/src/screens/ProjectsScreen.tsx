import React from 'react'
import { FolderOpen } from 'lucide-react'

export const ProjectsContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-4 flex-1">
      <div className="size-12 rounded-full bg-neutral-800 flex items-center justify-center">
        <FolderOpen className="size-6 text-neutral-500" />
      </div>
      <div>
        <h3 className="font-semibold text-neutral-200 text-base leading-6">
          DevTrack Projects Module
        </h3>
        <p className="text-[oklch(0.708_0_0)] text-xs leading-4 mt-1">
          This dashboard is currently under active development.
        </p>
      </div>
    </div>
  )
}
