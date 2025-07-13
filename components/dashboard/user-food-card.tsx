"use client"

import { useState } from "react"
import { supabase, type FoodItem } from "@/lib/supabase"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, MapPin, Hash, CheckCircle, Trash2, Edit, Clock, ChefHat } from "lucide-react"
import { getDaysUntilExpiry, getExpiryStatus } from "@/lib/utils/food"

interface UserFoodCardProps {
  item: FoodItem
  onUpdate: () => void
  priority?: boolean
}

export default function UserFoodCard({ item, onUpdate, priority = false }: UserFoodCardProps) {
  const [loading, setLoading] = useState(false)

  const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date)
  const expiryStatus = getExpiryStatus(item.expiry_date)

  const handleMarkAsConsumed = async () => {
    setLoading(true)
    const { error } = await supabase.from("food_items").update({ is_consumed: true }).eq("id", item.id)

    if (!error) {
      onUpdate()
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase.from("food_items").delete().eq("id", item.id)

    if (!error) {
      onUpdate()
    }
    setLoading(false)
  }

  const getExpiryText = () => {
    if (daysUntilExpiry < 0) {
      return `Expired ${Math.abs(daysUntilExpiry)} days ago`
    } else if (daysUntilExpiry === 0) {
      return "Expires today!"
    } else if (daysUntilExpiry === 1) {
      return "Expires tomorrow!"
    } else {
      return `${daysUntilExpiry} days left`
    }
  }

  const getCardStyle = () => {
    if (priority) return "border-yellow-300 bg-yellow-50"
    switch (expiryStatus) {
      case "fresh":
        return "border-green-200 bg-white hover:shadow-md"
      case "expiring_soon":
        return "border-yellow-300 bg-yellow-50"
      case "expired":
        return "border-red-300 bg-red-50"
    }
  }

  const getStatusBadge = () => {
    switch (expiryStatus) {
      case "fresh":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Fresh ✨</Badge>
      case "expiring_soon":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Use Soon ⏰</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired ⚠️</Badge>
    }
  }

  return (
    <Card className={`transition-all duration-200 ${getCardStyle()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
              {getStatusBadge()}
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Clock className="h-4 w-4 mr-1" />
              {getExpiryText()}
            </div>
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleMarkAsConsumed} disabled={loading}>
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Mark as Eaten
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2 text-blue-600" />
                Edit Item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={loading} className="text-red-600 focus:text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Hash className="h-4 w-4 mr-2 text-gray-400" />
            <span className="font-medium">{item.quantity}</span>
            <span className="ml-1">{item.unit}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{item.location}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Added {new Date(item.purchase_date).toLocaleDateString()}</span>
        </div>

        {item.notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">{item.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={handleMarkAsConsumed} disabled={loading} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            Eaten
          </Button>
          {(expiryStatus === "expiring_soon" || priority) && (
            <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              <ChefHat className="h-4 w-4 mr-1" />
              Recipes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
