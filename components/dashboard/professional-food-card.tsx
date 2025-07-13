"use client"

import { useState } from "react"
import { supabase, type FoodItem } from "@/lib/supabase"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, MapPin, Hash, CheckCircle, Trash2, Edit, Clock, DollarSign } from "lucide-react"
import { getDaysUntilExpiry, getExpiryStatus } from "@/lib/utils/food"

interface ProfessionalFoodCardProps {
  item: FoodItem
  onUpdate: () => void
}

export default function ProfessionalFoodCard({ item, onUpdate }: ProfessionalFoodCardProps) {
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
      return "Expires today"
    } else if (daysUntilExpiry === 1) {
      return "Expires tomorrow"
    } else {
      return `${daysUntilExpiry} days remaining`
    }
  }

  const getStatusColor = () => {
    switch (expiryStatus) {
      case "fresh":
        return "bg-green-50 text-green-700 border-green-200"
      case "expiring_soon":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "expired":
        return "bg-red-50 text-red-700 border-red-200"
    }
  }

  const getEstimatedValue = () => {
    const baseValue = item.category === "Meat" ? 15 : item.category === "Dairy" ? 8 : 5
    return baseValue * item.quantity
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
            </div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}
            >
              <Clock className="h-3 w-3 mr-1" />
              {getExpiryText()}
            </div>
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
                Mark as Consumed
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2 text-blue-600" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={loading} className="text-red-600 focus:text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Item
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

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
            <span className="font-medium">${getEstimatedValue()}</span>
            <span className="ml-1 text-gray-500">est. value</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(item.purchase_date).toLocaleDateString()}</span>
          </div>
        </div>

        {item.notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">{item.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={handleMarkAsConsumed} disabled={loading} className="flex-1 h-9">
            <CheckCircle className="h-4 w-4 mr-1" />
            Consumed
          </Button>
          {expiryStatus === "expiring_soon" && (
            <Button size="sm" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700">
              Find Recipes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
