"use client"
import { useState } from "react"
import Link from "next/link"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertTriangle,
  UserX,
  UserCheck,
  Building2,
  Filter,
  ActivityIcon,
} from "lucide-react"

interface Activity {
  id: string
  type: "bill_generated" | "bill_paid" | "bill_past_due" | "tenant_contract_expired" | "tenant_contract_signed"
  building: string
  details: string
  updatedAt: string
  tenantName?: string
  amount?: number
}

export default function ActivitiesPage() {
  const [buildingFilter, setBuildingFilter] = useState("all")
  const [activityTypeFilter, setActivityTypeFilter] = useState("all")

  // Sample activities data
  const [activities] = useState<Activity[]>([
    {
      id: "1",
      type: "bill_paid",
      building: "Tòa nhà A",
      details: "Nguyễn Văn An đã thanh toán hóa đơn HD001 - 3.500.000₫",
      updatedAt: "2025-07-17 16:30:00",
      tenantName: "Nguyễn Văn An",
      amount: 3500000,
    },
    {
      id: "2",
      type: "bill_generated",
      building: "Tòa nhà B",
      details: "Tạo hóa đơn HD007 cho Trần Thị Bình - 4.200.000₫",
      updatedAt: "2025-07-17 15:45:00",
      tenantName: "Trần Thị Bình",
      amount: 4200000,
    },
    {
      id: "3",
      type: "tenant_contract_signed",
      building: "Chung cư Sunshine",
      details: "Lê Văn Cường đã ký hợp đồng thuê phòng 301 - Thời hạn: 12 tháng",
      updatedAt: "2025-07-17 14:20:00",
      tenantName: "Lê Văn Cường",
    },
    {
      id: "4",
      type: "bill_past_due",
      building: "Tòa nhà A",
      details: "Hóa đơn HD003 của Phạm Thị Dung đã quá hạn thanh toán - 3.200.000₫",
      updatedAt: "2025-07-17 13:10:00",
      tenantName: "Phạm Thị Dung",
      amount: 3200000,
    },
    {
      id: "5",
      type: "bill_generated",
      building: "Tòa nhà B",
      details: "Tạo hóa đơn HD008 cho Hoàng Văn Em - 4.500.000₫",
      updatedAt: "2025-07-17 12:30:00",
      tenantName: "Hoàng Văn Em",
      amount: 4500000,
    },
    {
      id: "6",
      type: "tenant_contract_expired",
      building: "Chung cư Sunshine",
      details: "Hợp đồng của Võ Thị Lan đã hết hạn - Phòng 205",
      updatedAt: "2025-07-17 11:15:00",
      tenantName: "Võ Thị Lan",
    },
    {
      id: "7",
      type: "bill_paid",
      building: "Tòa nhà A",
      details: "Phạm Thị Dung đã thanh toán hóa đơn HD004 - 3.200.000₫",
      updatedAt: "2025-07-17 10:45:00",
      tenantName: "Phạm Thị Dung",
      amount: 3200000,
    },
    {
      id: "8",
      type: "bill_past_due",
      building: "Tòa nhà B",
      details: "Hóa đơn HD006 của Trần Thị Bình đã quá hạn thanh toán - 4.200.000₫",
      updatedAt: "2025-07-17 09:30:00",
      tenantName: "Trần Thị Bình",
      amount: 4200000,
    },
    {
      id: "9",
      type: "tenant_contract_signed",
      building: "Tòa nhà A",
      details: "Nguyễn Thị Mai đã ký hợp đồng thuê phòng 102 - Thời hạn: 6 tháng",
      updatedAt: "2025-07-17 08:20:00",
      tenantName: "Nguyễn Thị Mai",
    },
    {
      id: "10",
      type: "bill_generated",
      building: "Chung cư Sunshine",
      details: "Tạo hóa đơn HD009 cho Lê Văn Cường - 3.800.000₫",
      updatedAt: "2025-07-17 07:15:00",
      tenantName: "Lê Văn Cường",
      amount: 3800000,
    },
  ])

  const buildings = ["Tòa nhà A", "Tòa nhà B", "Chung cư Sunshine"]

  const activityTypes = [
    { value: "bill_generated", label: "Tạo hóa đơn" },
    { value: "bill_paid", label: "Thanh toán hóa đơn" },
    { value: "bill_past_due", label: "Hóa đơn quá hạn" },
    { value: "tenant_contract_expired", label: "Hợp đồng hết hạn" },
    { value: "tenant_contract_signed", label: "Ký hợp đồng mới" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "bill_generated":
        return <FileText className="h-5 w-5 text-black" />
      case "bill_paid":
        return <CheckCircle className="h-5 w-5 text-black" />
      case "bill_past_due":
        return <AlertTriangle className="h-5 w-5 text-black" />
      case "tenant_contract_expired":
        return <UserX className="h-5 w-5 text-black" />
      case "tenant_contract_signed":
        return <UserCheck className="h-5 w-5 text-black" />
      default:
        return <ActivityIcon className="h-5 w-5 text-black" />
    }
  }

  const getActivityTypeBadge = (type: string) => {
    const typeConfig = {
      bill_generated: { label: "Tạo hóa đơn", color: "bg-blue-500" },
      bill_paid: { label: "Thanh toán hóa đơn", color: "bg-[#38A169]" },
      bill_past_due: { label: "Hóa đơn quá hạn", color: "bg-[#E53E3E]" },
      tenant_contract_expired: { label: "Hợp đồng hết hạn", color: "bg-orange-500" },
      tenant_contract_signed: { label: "Ký hợp đồng mới", color: "bg-purple-500" },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || {
      label: "Không xác định",
      color: "bg-gray-500",
    }

    return (
      <Badge className={`${config.color} text-white font-semibold flex items-center`}>
        {getActivityIcon(type)}
        <span className="ml-2">{config.label}</span>
      </Badge>
    )
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesBuilding = buildingFilter === "all" || activity.building === buildingFilter
    const matchesActivityType = activityTypeFilter === "all" || activity.type === activityTypeFilter
    return matchesBuilding && matchesActivityType
  })

  // Sort by updatedAt (newest first)
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-3xl font-bold text-black">Lịch sử Hoạt động</h1>
            <p className="text-lg text-black mt-2">Theo dõi các hoạt động và thay đổi trong hệ thống</p>
          </div>

          <Link href="/buildings">
            <Button
              className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white text-lg font-semibold h-12 px-6"
              title="Quay lại trang quản lý tòa nhà"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Quay lại Tòa nhà
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-black" />
            <span className="text-lg font-semibold text-black">Bộ lọc:</span>
          </div>

          <Select value={buildingFilter} onValueChange={setBuildingFilter}>
            <SelectTrigger
              className="w-full sm:w-64 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
              title="Lọc theo tòa nhà"
            >
              <Building2 className="mr-2 h-5 w-5 text-black" />
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

          <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
            <SelectTrigger
              className="w-full sm:w-80 h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
              title="Lọc theo loại hoạt động"
            >
              <ActivityIcon className="mr-2 h-5 w-5 text-black" />
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {activityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
          <p className="text-lg text-black">
            <span className="font-semibold">Hiển thị {sortedActivities.length}</span> hoạt động
            {buildingFilter !== "all" && (
              <span className="ml-2">
                tại <span className="font-semibold">{buildingFilter}</span>
              </span>
            )}
            {activityTypeFilter !== "all" && (
              <span className="ml-2">
                loại{" "}
                <span className="font-semibold">
                  {activityTypes.find((t) => t.value === activityTypeFilter)?.label}
                </span>
              </span>
            )}
          </p>
        </div>

        {/* Activities Table */}
        <div className="border-2 border-black rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-black">
                <TableHead className="text-black font-bold text-lg p-4">Loại hoạt động</TableHead>
                <TableHead className="text-black font-bold text-lg p-4">Tòa nhà</TableHead>
                <TableHead className="text-black font-bold text-lg p-4">Chi tiết</TableHead>
                <TableHead className="text-black font-bold text-lg p-4">Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedActivities.length > 0 ? (
                sortedActivities.map((activity) => (
                  <TableRow key={activity.id} className="border-b border-gray-200">
                    <TableCell className="p-4">{getActivityTypeBadge(activity.type)}</TableCell>
                    <TableCell className="text-lg text-black p-4 font-medium">
                      <div className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4 text-black" />
                        {activity.building}
                      </div>
                    </TableCell>
                    <TableCell className="text-lg text-black p-4">{activity.details}</TableCell>
                    <TableCell className="text-lg text-black p-4 font-mono">
                      {formatDateTime(activity.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <ActivityIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-black mb-2">Không có hoạt động nào</h3>
                    <p className="text-lg text-gray-600">
                      {buildingFilter !== "all" || activityTypeFilter !== "all"
                        ? "Không tìm thấy hoạt động phù hợp với bộ lọc đã chọn"
                        : "Chưa có hoạt động nào được ghi nhận trong hệ thống"}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Activity Statistics */}
        {sortedActivities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {activityTypes.map((type) => {
              const count = sortedActivities.filter((activity) => activity.type === type.value).length
              return (
                <div key={type.value} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getActivityIcon(type.value)}
                    <span className="ml-2 text-2xl font-bold text-black">{count}</span>
                  </div>
                  <p className="text-base font-semibold text-black">{type.label}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
