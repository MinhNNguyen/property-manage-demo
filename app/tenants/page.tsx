"use client"

import type React from "react"
import { useState } from "react"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  Calendar,
  Trash2,
  Check,
  Info,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Tenant {
  id: string
  name: string
  phone: string
  zalo: string
  socialId: string
  building: string
  billStatus: "paid" | "unpaid" | "overdue"
  contractEndDate: string
}

export default function TenantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState("all")
  const [sortField, setSortField] = useState<keyof Tenant | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [tenantForm, setTenantForm] = useState({
    name: "",
    phone: "",
    zalo: "",
    socialId: "",
  })

  // Sample tenants data
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "Trần Thị Bình",
      phone: "0901234567",
      zalo: "0901234567",
      socialId: "123456789012",
      building: "Tòa nhà B",
      billStatus: "unpaid",
      contractEndDate: "2024-11-15",
    },
    {
      id: "2",
      name: "Hoàng Văn Em",
      phone: "0912345678",
      zalo: "0912345678",
      socialId: "234567890123",
      building: "Tòa nhà B",
      billStatus: "unpaid",
      contractEndDate: "2025-01-10",
    },
    {
      id: "3",
      name: "Phạm Thị Dung",
      phone: "0923456789",
      zalo: "0923456789",
      socialId: "345678901234",
      building: "Tòa nhà A",
      billStatus: "overdue",
      contractEndDate: "2024-10-05",
    },
    {
      id: "4",
      name: "Nguyễn Văn An",
      phone: "0934567890",
      zalo: "0934567890",
      socialId: "456789012345",
      building: "Tòa nhà A",
      billStatus: "paid",
      contractEndDate: "2024-12-31",
    },
    {
      id: "5",
      name: "Lê Văn Cường",
      phone: "0945678901",
      zalo: "0945678901",
      socialId: "567890123456",
      building: "Chung cư Sunshine",
      billStatus: "paid",
      contractEndDate: "2025-03-20",
    },
  ])

  const buildings = ["Tòa nhà A", "Tòa nhà B", "Chung cư Sunshine"]
  const itemsPerPage = 5

  const getBillStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-[#38A169] text-white font-semibold">Đã thanh toán</Badge>
      case "unpaid":
        return <Badge className="bg-orange-500 text-white font-semibold">Chưa thanh toán</Badge>
      case "overdue":
        return <Badge className="bg-[#E53E3E] text-white font-semibold">Quá hạn</Badge>
      default:
        return <Badge className="bg-gray-500 text-white font-semibold">Không xác định</Badge>
    }
  }

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBuilding = selectedBuilding === "all" || tenant.building === selectedBuilding
    return matchesSearch && matchesBuilding
  })

  const sortedTenants = [...filteredTenants].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedTenants.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTenants = sortedTenants.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof Tenant) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
    setMessage(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setMessage(null)
    setTenantForm({
      name: "",
      phone: "",
      zalo: "",
      socialId: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!tenantForm.name || !tenantForm.phone || !tenantForm.socialId) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin bắt buộc" })
      return
    }

    if (tenantForm.phone.length < 10) {
      setMessage({ type: "error", text: "Số điện thoại phải có ít nhất 10 số" })
      return
    }

    if (tenantForm.socialId.length !== 12) {
      setMessage({ type: "error", text: "Số CCCD/CMND phải có đúng 12 số" })
      return
    }

    const newTenant: Tenant = {
      id: (tenants.length + 1).toString(),
      name: tenantForm.name,
      phone: tenantForm.phone,
      zalo: tenantForm.zalo || tenantForm.phone,
      socialId: tenantForm.socialId,
      building: "Chưa phân bổ",
      billStatus: "unpaid",
      contractEndDate: "2025-12-31",
    }

    setTenants([...tenants, newTenant])
    setMessage({ type: "success", text: "Ghi nhận khách thuê mới thành công!" })

    setTimeout(() => {
      closeModal()
    }, 2000)
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Quản lý Khách thuê</h1>
            <p className="text-lg text-black mt-2">Thông tin và hồ sơ của các khách thuê</p>
          </div>

          <Button
            onClick={openModal}
            className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white text-lg font-semibold h-12 px-6"
            title="Ghi nhận khách thuê mới - Thêm khách thuê vào hệ thống"
          >
            <Plus className="mr-2 h-5 w-5" />
            Ghi nhận khách thuê mới
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
            />
          </div>

          <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
            <SelectTrigger className="w-full sm:w-48 h-12 text-lg border-2 border-black focus:border-[#1E90FF]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {buildings.map((building) => (
                <SelectItem key={building} value={building}>
                  {building}
                </SelectItem>
              ))}
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
                    onClick={() => handleSort("name")}
                    className="flex items-center hover:bg-transparent p-0 h-auto font-bold text-lg text-black"
                    title="Sắp xếp theo tên khách thuê"
                  >
                    Tên khách thuê
                    <Info className="ml-1 h-4 w-4" />
                    {sortField === "name" &&
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
                    onClick={() => handleSort("building")}
                    className="flex items-center hover:bg-transparent p-0 h-auto font-bold text-lg text-black"
                    title="Sắp xếp theo tòa nhà"
                  >
                    Tòa nhà
                    {sortField === "building" &&
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
                    onClick={() => handleSort("billStatus")}
                    className="flex items-center hover:bg-transparent p-0 h-auto font-bold text-lg text-black"
                    title="Sắp xếp theo trạng thái hóa đơn"
                  >
                    Trạng thái hóa đơn
                    <ChevronUp className="ml-1 h-4 w-4 text-[#1E90FF]" />
                    {sortField === "billStatus" &&
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
                    onClick={() => handleSort("contractEndDate")}
                    className="flex items-center hover:bg-transparent p-0 h-auto font-bold text-lg text-black"
                    title="Sắp xếp theo ngày hết hạn hợp đồng"
                  >
                    Ngày hết hạn HĐ
                    <Info className="ml-1 h-4 w-4" />
                    {sortField === "contractEndDate" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 text-[#1E90FF]" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-black font-bold text-lg p-4">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTenants.map((tenant) => (
                <TableRow key={tenant.id} className="border-b border-gray-200">
                  <TableCell className="text-lg text-black p-4 font-medium">{tenant.name}</TableCell>
                  <TableCell className="text-lg text-black p-4">{tenant.building}</TableCell>
                  <TableCell className="p-4">{getBillStatusBadge(tenant.billStatus)}</TableCell>
                  <TableCell className="text-lg text-black p-4">{tenant.contractEndDate}</TableCell>
                  <TableCell className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-black hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] bg-transparent"
                        title="Xem lịch hợp đồng và thanh toán"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                        title="Xóa khách thuê"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-lg text-black">
            Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedTenants.length)} của{" "}
            {sortedTenants.length} khách thuê
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

      {/* Add Tenant Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md bg-white border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black text-center">Ghi nhận khách thuê mới</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="tenant-name" className="text-lg font-semibold text-black">
                Họ và tên *
              </Label>
              <Input
                id="tenant-name"
                type="text"
                placeholder="Nhập họ và tên đầy đủ (VD: Nguyễn Văn An)"
                value={tenantForm.name}
                onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                className="h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                title="Nhập họ và tên đầy đủ của khách thuê"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="tenant-phone" className="text-lg font-semibold text-black">
                Số điện thoại *
              </Label>
              <Input
                id="tenant-phone"
                type="tel"
                placeholder="Nhập số điện thoại (VD: 0901234567)"
                value={tenantForm.phone}
                onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
                className="h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                title="Nhập số điện thoại liên lạc của khách thuê"
              />
            </div>

            {/* Zalo */}
            <div className="space-y-2">
              <Label htmlFor="tenant-zalo" className="text-lg font-semibold text-black">
                Số Zalo
              </Label>
              <Input
                id="tenant-zalo"
                type="tel"
                placeholder="Nhập số Zalo (để trống nếu giống SĐT)"
                value={tenantForm.zalo}
                onChange={(e) => setTenantForm({ ...tenantForm, zalo: e.target.value })}
                className="h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                title="Nhập số Zalo để liên lạc (có thể để trống nếu giống số điện thoại)"
              />
            </div>

            {/* Social ID */}
            <div className="space-y-2">
              <Label htmlFor="tenant-social-id" className="text-lg font-semibold text-black">
                Số CCCD/CMND *
              </Label>
              <Input
                id="tenant-social-id"
                type="text"
                placeholder="Nhập số CCCD/CMND (12 số)"
                value={tenantForm.socialId}
                onChange={(e) => setTenantForm({ ...tenantForm, socialId: e.target.value })}
                className="h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                title="Nhập số căn cước công dân hoặc chứng minh nhân dân (12 số)"
                maxLength={12}
              />
            </div>

            {/* Messages */}
            {message && (
              <Alert
                className={`border-2 ${message.type === "success" ? "border-[#38A169] bg-[#38A169]/10" : "border-[#E53E3E] bg-[#E53E3E]/10"}`}
              >
                <Info className="h-5 w-5" />
                <AlertDescription
                  className={`text-lg font-semibold ${message.type === "success" ? "text-[#38A169]" : "text-[#E53E3E]"}`}
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white"
              title="Ghi nhận khách thuê mới với thông tin đã nhập"
            >
              <Check className="mr-2 h-5 w-5" />
              Gửi
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  )
}
