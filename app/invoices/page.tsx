"use client"
import { useState } from "react"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react"

interface Invoice {
  id: string
  billId: string
  tenantName: string
  amount: number
  status: "paid" | "pending" | "overdue"
  updatedAt: string
}

type StatisticFilter = "all" | "paid" | "pending" | "overdue"

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatisticFilter>("all")
  const [activeStatistic, setActiveStatistic] = useState<StatisticFilter>("all")
  const [sortField, setSortField] = useState<keyof Invoice | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)

  // Sample invoices data
  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      billId: "HD001",
      tenantName: "Nguyễn Văn An",
      amount: 3500000,
      status: "paid",
      updatedAt: "2024-01-15 14:30:00",
    },
    {
      id: "2",
      billId: "HD002",
      tenantName: "Trần Thị Bình",
      amount: 4200000,
      status: "pending",
      updatedAt: "2024-01-14 09:15:00",
    },
    {
      id: "3",
      billId: "HD004",
      tenantName: "Phạm Thị Dung",
      amount: 3200000,
      status: "paid",
      updatedAt: "2024-01-13 11:20:00",
    },
    {
      id: "4",
      billId: "HD005",
      tenantName: "Hoàng Văn Em",
      amount: 4500000,
      status: "pending",
      updatedAt: "2024-01-12 08:30:00",
    },
    {
      id: "5",
      billId: "HD003",
      tenantName: "Lê Văn Cường",
      amount: 3800000,
      status: "overdue",
      updatedAt: "2024-01-10 16:45:00",
    },
    {
      id: "6",
      billId: "HD006",
      tenantName: "Võ Thị Lan",
      amount: 3900000,
      status: "overdue",
      updatedAt: "2024-01-08 13:15:00",
    },
  ])

  const itemsPerPage = 10

  // Calculate statistics
  const statistics = {
    total: invoices.length,
    paid: invoices.filter((inv) => inv.status === "paid").length,
    pending: invoices.filter((inv) => inv.status === "pending").length,
    overdue: invoices.filter((inv) => inv.status === "overdue").length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-[#38A169] text-white font-semibold">Đã thanh toán</Badge>
      case "pending":
        return <Badge className="bg-orange-500 text-white font-semibold">Đang chờ</Badge>
      case "overdue":
        return <Badge className="bg-[#E53E3E] text-white font-semibold">Quá hạn</Badge>
      default:
        return <Badge className="bg-gray-500 text-white font-semibold">Không xác định</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " ₫"
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.billId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.tenantName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      (statusFilter === "all" && activeStatistic === "all") ||
      invoice.status === statusFilter ||
      invoice.status === activeStatistic

    return matchesSearch && matchesStatus
  })

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvoices = sortedInvoices.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleStatisticClick = (filter: StatisticFilter) => {
    setActiveStatistic(filter)
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold text-black">Quản lý Hóa đơn</h1>
          <p className="text-lg text-black mt-2">Theo dõi và quản lý hóa đơn của khách thuê</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className={`border-2 cursor-pointer transition-colors ${
              activeStatistic === "all" ? "border-[#1E90FF] bg-[#1E90FF]/10" : "border-[#1E90FF] hover:bg-gray-50"
            }`}
            onClick={() => handleStatisticClick("all")}
            title="Xem tất cả hóa đơn"
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="h-8 w-8 text-black mr-2" />
                <span className="text-3xl font-bold text-black">{statistics.total}</span>
              </div>
              <p className="text-lg font-semibold text-black">Hóa đơn đã tạo</p>
            </CardContent>
          </Card>

          <Card
            className={`border-2 cursor-pointer transition-colors ${
              activeStatistic === "paid" ? "border-[#1E90FF] bg-[#1E90FF]/10" : "border-[#1E90FF] hover:bg-gray-50"
            }`}
            onClick={() => handleStatisticClick("paid")}
            title="Xem hóa đơn đã thanh toán"
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-black mr-2" />
                <span className="text-3xl font-bold text-black">{statistics.paid}</span>
              </div>
              <p className="text-lg font-semibold text-black">Đã thanh toán</p>
            </CardContent>
          </Card>

          <Card
            className={`border-2 cursor-pointer transition-colors ${
              activeStatistic === "pending" ? "border-[#1E90FF] bg-[#1E90FF]/10" : "border-[#1E90FF] hover:bg-gray-50"
            }`}
            onClick={() => handleStatisticClick("pending")}
            title="Xem hóa đơn đang chờ thanh toán"
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-black mr-2" />
                <span className="text-3xl font-bold text-black">{statistics.pending}</span>
              </div>
              <p className="text-lg font-semibold text-black">Đang chờ</p>
            </CardContent>
          </Card>

          <Card
            className={`border-2 cursor-pointer transition-colors ${
              activeStatistic === "overdue" ? "border-[#1E90FF] bg-[#1E90FF]/10" : "border-[#1E90FF] hover:bg-gray-50"
            }`}
            onClick={() => handleStatisticClick("overdue")}
            title="Xem hóa đơn quá hạn"
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-8 w-8 text-black mr-2" />
                <span className="text-3xl font-bold text-black">{statistics.overdue}</span>
              </div>
              <p className="text-lg font-semibold text-black">Quá hạn</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
            <Input
              type="text"
              placeholder="Tìm kiếm hóa đơn"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: StatisticFilter) => {
              setStatusFilter(value)
              setActiveStatistic(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-64 h-12 text-lg border-2 border-black focus:border-[#1E90FF]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="paid">Đã thanh toán</SelectItem>
              <SelectItem value="pending">Đang chờ</SelectItem>
              <SelectItem value="overdue">Quá hạn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border-2 border-black rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black">
                <TableHead className="text-black font-bold text-lg p-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("billId")}
                    className="flex items-center hover:bg-transparent p-0 h-auto font-bold text-lg text-black"
                    title="Sắp xếp theo mã hóa đơn"
                  >
                    Mã hóa đơn
                    {sortField === "billId" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-black font-bold text-lg p-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("tenantName")}
                    className="flex items-center hover:bg-transparent p-0 h-auto font-bold text-lg text-black"
                    title="Sắp xếp theo tên khách thuê"
                  >
                    Tên khách thuê
                    {sortField === "tenantName" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-black font-bold text-lg p-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("amount")}
                    className="flex items-center hover:bg-transparent p-0 h-auto font-bold text-lg text-black"
                    title="Sắp xếp theo số tiền"
                  >
                    Số tiền
                    {sortField === "amount" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-black font-bold text-lg p-4">Trạng thái</TableHead>
                <TableHead className="text-black font-bold text-lg p-4">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("updatedAt")}
                    className="flex items-center hover:bg-transparent p-0 h-auto font-bold text-lg text-black"
                    title="Sắp xếp theo thời gian cập nhật"
                  >
                    Cập nhật lần cuối
                    {sortField === "updatedAt" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ))}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-b border-gray-200">
                  <TableCell className="text-lg text-black p-4 font-medium">{invoice.billId}</TableCell>
                  <TableCell className="text-lg text-black p-4">{invoice.tenantName}</TableCell>
                  <TableCell className="text-lg text-black p-4 font-semibold">
                    {formatCurrency(invoice.amount)}
                  </TableCell>
                  <TableCell className="p-4">{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-lg text-black p-4">{invoice.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-lg text-black">
            Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedInvoices.length)} của{" "}
            {sortedInvoices.length} hóa đơn
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-2 border-black hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
              title="Trang trước"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trước
            </Button>

            <span className="text-lg font-semibold text-black px-4">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="border-2 border-black hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
              title="Trang sau"
            >
              Sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
