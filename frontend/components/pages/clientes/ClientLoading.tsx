import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ClientesLoading() {
  return (
    <div className=" bg-background text-foreground  overflow-hidden">
     
      {/* <div className="mb-6">
        <Skeleton className="h-10 w-40 bg-gray-500 mb-2" />
        <Skeleton className="h-5 w-64 bg-gray-500" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <div className="relative flex-1">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <Skeleton className="h-10 w-full bg-gray-500 rounded-md" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 bg-gray-500 rounded-md" />
          <Skeleton className="h-10 w-32 bg-gray-500 rounded-md" />
        </div>
      </div> */}

      {/* Table Skeleton */}
      <div className="border  rounded-md overflow-hidden">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-12 gap-4 p-4  border-gray-500">
          <Skeleton className="h-5 w-20 bg-gray-600 col-span-2" />
          <Skeleton className="h-5 w-20 bg-gray-600 col-span-2" />
          <Skeleton className="h-5 w-20 bg-gray-600 col-span-3" />
          <Skeleton className="h-5 w-20 bg-gray-600 col-span-2" />
          <Skeleton className="h-5 w-10 bg-gray-600 col-span-1" />
          <Skeleton className="h-5 w-20 bg-gray-600 col-span-1" />
          <div className=" flex justify-end">
            <Skeleton className="h-5 w-10 bg-gray-600 col-span-1 text-end" />
          </div>
        
        </div>

        {/* Table Rows Skeleton */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 p-4  border-gray-500 items-center">
            <div className="col-span-2 flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full bg-gray-500" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-500" />
                <Skeleton className="h-3 w-12 bg-gray-500" />
              </div>
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-32 bg-gray-500" />
            </div>
            <div className="col-span-3 space-y-2">
              <Skeleton className="h-4 w-40 bg-gray-500" />
              <Skeleton className="h-3 w-28 bg-gray-500" />
            </div>
            <div className="col-span-2">
              <Skeleton className="h-4 w-24 bg-gray-500" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-8 bg-gray-500" />
            </div>
            <div className="col-span-1">
              <Skeleton className="h-4 w-20 bg-gray-500" />
            </div>
            <div className="col-span-1  flex flex-col items-end pr-3">
              <Skeleton className="h-8 w-3 rounded-full bg-gray-500 " />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
