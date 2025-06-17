"use client"

import { useState, useMemo } from "react"
import { CalendarDays, GitCommit, Search, Filter, User, Clock } from "lucide-react"
import { format, parseISO, isWithinInterval } from "date-fns"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import DashboardPageLayout from "../-dashboard-page-layout"
import RepositorySelector from "@/components/repository/repository-selector"

// Mock commit data
const mockCommits = [
  {
    id: "abc123",
    message: "Add user authentication system",
    author: "John Doe",
    email: "john@example.com",
    date: "2024-01-15T10:30:00Z",
    additions: 145,
    deletions: 23,
    files: 8,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "def456",
    message: "Fix responsive design issues",
    author: "Jane Smith",
    email: "jane@example.com",
    date: "2024-01-14T14:20:00Z",
    additions: 67,
    deletions: 34,
    files: 5,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "ghi789",
    message: "Update dependencies and security patches",
    author: "Mike Johnson",
    email: "mike@example.com",
    date: "2024-01-13T09:15:00Z",
    additions: 234,
    deletions: 189,
    files: 12,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "jkl012",
    message: "Implement dark mode toggle",
    author: "Sarah Wilson",
    email: "sarah@example.com",
    date: "2024-01-12T16:45:00Z",
    additions: 89,
    deletions: 12,
    files: 6,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "mno345",
    message: "Add API rate limiting",
    author: "John Doe",
    email: "john@example.com",
    date: "2024-01-11T11:30:00Z",
    additions: 156,
    deletions: 45,
    files: 9,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "pqr678",
    message: "Refactor database queries for performance",
    author: "Jane Smith",
    email: "jane@example.com",
    date: "2024-01-10T13:20:00Z",
    additions: 78,
    deletions: 123,
    files: 7,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "stu901",
    message: "Add unit tests for user service",
    author: "Mike Johnson",
    email: "mike@example.com",
    date: "2024-01-09T08:45:00Z",
    additions: 267,
    deletions: 15,
    files: 11,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "vwx234",
    message: "Fix memory leak in image processing",
    author: "Sarah Wilson",
    email: "sarah@example.com",
    date: "2024-01-08T15:10:00Z",
    additions: 34,
    deletions: 67,
    files: 3,
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const chartConfig = {
  commits: {
    label: "Commits",
    color: "hsl(var(--chart-1))",
  },
}

export default function CommitsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [authorFilter, setAuthorFilter] = useState("all")
  const [selectedCommit, setSelectedCommit] = useState<(typeof mockCommits)[0] | null>(null)

  // Get unique authors for filter
  const authors = useMemo(() => {
    const uniqueAuthors = [...new Set(mockCommits.map((commit) => commit.author))]
    return uniqueAuthors
  }, [])

  // Filter commits based on search term, date range, and author
  const filteredCommits = useMemo(() => {
    return mockCommits.filter((commit) => {
      const matchesSearch =
        commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.author.toLowerCase().includes(searchTerm.toLowerCase())

      const commitDate = parseISO(commit.date)
      const matchesDateRange =
        !dateRange.from || !dateRange.to || isWithinInterval(commitDate, { start: dateRange.from, end: dateRange.to })

      const matchesAuthor = authorFilter === "all" || commit.author === authorFilter

      return matchesSearch && matchesDateRange && matchesAuthor
    })
  }, [searchTerm, dateRange, authorFilter])

  // Prepare chart data
  const chartData = useMemo(() => {
    return filteredCommits.map((commit, index) => ({
      x: index + 1,
      y: commit.additions + commit.deletions,
      date: format(parseISO(commit.date), "MMM dd"),
      commit: commit,
    }))
  }, [filteredCommits])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const commit = data.commit
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <GitCommit className="h-4 w-4" />
            <span className="font-medium text-sm">{commit.message}</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>{commit.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>{format(parseISO(commit.date), "MMM dd, yyyy 'at' HH:mm")}</span>
            </div>
            <div className="flex gap-4 mt-2">
              <span className="text-green-600">+{commit.additions}</span>
              <span className="text-red-600">-{commit.deletions}</span>
              <span>{commit.files} files</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <DashboardPageLayout rightContent={<Badge variant="secondary" className="text-sm">
      {filteredCommits.length} commits
    </Badge>} title="Repository Commits" description="Track and analyze commit activity for your repository">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter commits by date range, author, or search terms</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
            <RepositorySelector />
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search commits or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date Range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full lg:w-auto">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Author Filter */}
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Filter by author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setDateRange({})
                setAuthorFilter("all")
              }}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Commit Activity Chart</CardTitle>
          <CardDescription>
            Interactive visualization of commits over time. Each dot represents a commit sized by lines changed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Commit Order" tickFormatter={(value) => `#${value}`} />
                <YAxis type="number" dataKey="y" name="Lines Changed" tickFormatter={(value) => `${value}`} />
                <ChartTooltip content={<CustomTooltip />} />
                <Scatter
                  dataKey="y"
                  fill="var(--color-commits)"
                  onClick={(data) => setSelectedCommit(data.commit)}
                  className="cursor-pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={selectedCommit?.id === entry.commit.id ? "hsl(var(--chart-2))" : "var(--color-commits)"}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Commit List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Commits</CardTitle>
          <CardDescription>Detailed list of filtered commits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCommits.map((commit, index) => (
              <div
                key={commit.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                  selectedCommit?.id === commit.id ? "bg-muted border-primary" : ""
                }`}
                onClick={() => setSelectedCommit(commit)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={commit.avatar || "/placeholder.svg"} alt={commit.author} />
                  <AvatarFallback>
                    {commit.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium leading-none">{commit.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        by {commit.author} • {format(parseISO(commit.date), "MMM dd, yyyy 'at' HH:mm")}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {commit.id.substring(0, 7)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>+{commit.additions}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>-{commit.deletions}
                    </span>
                    <span>{commit.files} files changed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardPageLayout>
  )
}
