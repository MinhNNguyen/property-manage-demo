"use client"

import type React from "react"
import { useState } from "react"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Building2, MapPin, Users, Check, Trash2, Edit, Info } from "lucide-react"

interface RoomType {
  id: string
  name: string
  numberOfRooms: number
  price: number
  serviceFees: number
}

interface Building {
  id: string
  name: string
  address: string
  occupiedRooms: number
  totalRooms: number
  roomTypes: RoomType[]
}

export default function BuildingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [buildingForm, setBuildingForm] = useState({
    name: "",
    address: "",
    roomTypes: [{ id: "1", name: "", numberOfRooms: 0, price: 0, serviceFees: 500000 }],
  })

  // Sample buildings data
  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: "1",
      name: "Tòa nhà Sunshine",
      address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
      occupiedRooms: 12,
      totalRooms: 21,
      roomTypes: [],
    },
    {
      id: "2",
      name: "Chung cư Green Park",
      address: "456 Lê Văn Việt, Quận 9, TP.HCM",
      occupiedRooms: 8,
      totalRooms: 15,
      roomTypes: [],
    },
    {
      id: "3",
      name: "Tòa nhà Central Plaza",
      address: "789 Võ Văn Tần, Quận 3, TP.HCM",
      occupiedRooms: 25,
      totalRooms: 30,
      roomTypes: [],
    },
    {
      id: "4",
      name: "Căn hộ Riverside",
      address: "321 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM",
      occupiedRooms: 6,
      totalRooms: 12,
      roomTypes: [],
    },
  ])

  const openModal = () => {
    setIsModalOpen(true)
    setMessage(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setMessage(null)
    setBuildingForm({
      name: "",
      address: "",
      roomTypes: [{ id: "1", name: "", numberOfRooms: 0, price: 0, serviceFees: 500000 }],
    })
  }

  const addRoomType = () => {
    const newId = (buildingForm.roomTypes.length + 1).toString()
    setBuildingForm({
      ...buildingForm,
      roomTypes: [...buildingForm.roomTypes, { id: newId, name: "", numberOfRooms: 0, price: 0, serviceFees: 500000 }],
    })
  }

  const removeRoomType = (id: string) => {
    if (buildingForm.roomTypes.length > 1) {
      setBuildingForm({
        ...buildingForm,
        roomTypes: buildingForm.roomTypes.filter((rt) => rt.id !== id),
      })
    }
  }

  const updateRoomType = (id: string, field: keyof RoomType, value: string | number) => {
    setBuildingForm({
      ...buildingForm,
      roomTypes: buildingForm.roomTypes.map((rt) => (rt.id === id ? { ...rt, [field]: value } : rt)),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!buildingForm.name || !buildingForm.address) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ tên tòa nhà và địa chỉ" })
      return
    }

    const hasEmptyRoomType = buildingForm.roomTypes.some((rt) => !rt.name || rt.numberOfRooms <= 0 || rt.price <= 0)

    if (hasEmptyRoomType) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin cho tất cả loại phòng" })
      return
    }

    const totalRooms = buildingForm.roomTypes.reduce((sum, rt) => sum + rt.numberOfRooms, 0)

    const newBuilding: Building = {
      id: (buildings.length + 1).toString(),
      name: buildingForm.name,
      address: buildingForm.address,
      occupiedRooms: 0,
      totalRooms: totalRooms,
      roomTypes: buildingForm.roomTypes,
    }

    setBuildings([...buildings, newBuilding])
    setMessage({ type: "success", text: "Tạo tòa nhà mới thành công!" })

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
            <h1 className="text-3xl font-bold text-black">Quản lý Tòa nhà</h1>
            <p className="text-lg text-black mt-2">Danh sách các tòa nhà và căn hộ trong hệ thống</p>
          </div>

          <Button
            onClick={openModal}
            className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white text-lg font-semibold h-12 px-6"
            title="Tạo tòa nhà mới - Thêm tòa nhà vào hệ thống quản lý"
          >
            <Plus className="mr-2 h-5 w-5" />
            Tạo tòa nhà mới
          </Button>
        </div>

        {/* Buildings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((building) => (
            <Card key={building.id} className="border-2 border-black hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-xl font-bold text-black">
                  <div className="flex items-center">
                    <Building2 className="mr-2 h-6 w-6 text-black" />
                    {building.name}
                  </div>
                  <Badge
                    className="bg-[#1E90FF] text-white text-lg font-semibold px-3 py-1"
                    title={`${building.occupiedRooms} phòng đã thuê / ${building.totalRooms} tổng số phòng`}
                  >
                    {building.occupiedRooms}/{building.totalRooms}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="mr-2 h-5 w-5 text-black mt-1 flex-shrink-0" />
                  <p className="text-lg text-black">{building.address}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center text-black">
                    <Users className="mr-2 h-5 w-5" />
                    <span className="text-lg font-semibold">
                      {Math.round((building.occupiedRooms / building.totalRooms) * 100)}% đã thuê
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-black hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] bg-transparent"
                      title="Chỉnh sửa thông tin tòa nhà"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                      title="Xóa tòa nhà"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {buildings.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">Chưa có tòa nhà nào</h3>
            <p className="text-lg text-gray-600 mb-6">Bắt đầu bằng cách tạo tòa nhà đầu tiên của bạn</p>
            <Button
              onClick={openModal}
              className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white text-lg font-semibold h-12 px-6"
            >
              <Plus className="mr-2 h-5 w-5" />
              Tạo tòa nhà mới
            </Button>
          </div>
        )}
      </div>

      {/* Create Building Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-2xl bg-white border-2 border-black max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black text-center">Tạo tòa nhà mới</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Building Name */}
            <div className="space-y-2">
              <Label htmlFor="building-name" className="text-lg font-semibold text-black">
                Tên tòa nhà *
              </Label>
              <Input
                id="building-name"
                type="text"
                placeholder="Nhập tên tòa nhà (VD: Chung cư Sunshine)"
                value={buildingForm.name}
                onChange={(e) => setBuildingForm({ ...buildingForm, name: e.target.value })}
                className="h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                title="Nhập tên đầy đủ của tòa nhà"
              />
            </div>

            {/* Building Address */}
            <div className="space-y-2">
              <Label htmlFor="building-address" className="text-lg font-semibold text-black">
                Địa chỉ *
              </Label>
              <Input
                id="building-address"
                type="text"
                placeholder="Nhập địa chỉ đầy đủ (VD: 123 Nguyễn Văn Linh, Quận 7, TP.HCM)"
                value={buildingForm.address}
                onChange={(e) => setBuildingForm({ ...buildingForm, address: e.target.value })}
                className="h-12 text-lg border-2 border-black focus:border-[#1E90FF]"
                title="Nhập địa chỉ chi tiết của tòa nhà"
              />
            </div>

            {/* Room Types */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold text-black">Loại phòng *</Label>
                <Button
                  type="button"
                  onClick={addRoomType}
                  className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white text-sm font-semibold h-10 px-4"
                  title="Thêm loại phòng mới"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm loại phòng
                </Button>
              </div>

              {buildingForm.roomTypes.map((roomType, index) => (
                <div key={roomType.id} className="border-2 border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-black">Loại phòng {index + 1}</h4>
                    {buildingForm.roomTypes.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeRoomType(roomType.id)}
                        variant="outline"
                        size="sm"
                        className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        title="Xóa loại phòng này"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-black">Tên loại phòng</Label>
                      <Input
                        type="text"
                        placeholder="VD: Phòng 1 người, Phòng 2 người"
                        value={roomType.name}
                        onChange={(e) => updateRoomType(roomType.id, "name", e.target.value)}
                        className="h-10 text-base border-2 border-black focus:border-[#1E90FF]"
                        title="Nhập tên mô tả loại phòng"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-black">Số lượng phòng</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="1"
                        value={roomType.numberOfRooms || ""}
                        onChange={(e) =>
                          updateRoomType(roomType.id, "numberOfRooms", Number.parseInt(e.target.value) || 0)
                        }
                        className="h-10 text-base border-2 border-black focus:border-[#1E90FF]"
                        title="Nhập số lượng phòng của loại này"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-black">Giá thuê (VNĐ/tháng)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={roomType.price || ""}
                        onChange={(e) => updateRoomType(roomType.id, "price", Number.parseInt(e.target.value) || 0)}
                        className="h-10 text-base border-2 border-black focus:border-[#1E90FF]"
                        title="Nhập giá thuê hàng tháng"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold text-black">Phí dịch vụ (VNĐ/tháng)</Label>
                      <Input
                        type="number"
                        placeholder="500000"
                        min="0"
                        value={roomType.serviceFees || ""}
                        onChange={(e) =>
                          updateRoomType(roomType.id, "serviceFees", Number.parseInt(e.target.value) || 0)
                        }
                        className="h-10 text-base border-2 border-black focus:border-[#1E90FF]"
                        title="Phí dịch vụ hàng tháng (điện, nước, internet, v.v.)"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
              title="Tạo tòa nhà mới với thông tin đã nhập"
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
