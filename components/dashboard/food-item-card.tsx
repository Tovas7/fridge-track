"use client"

import { useState } from "react"
import { supabase, type FoodItem } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, MapPin, Hash, CheckCircle, Trash2, Edit } from "lucide-react"
import { getDaysUntilExpiry, getExpiryStatus, getExpiryColor } from "@/lib/utils/food"

interface FoodItemCardProps {
  item: FoodItem
  onUpdate: () => void
}

export default function FoodItemCard({ item, onUpdate }: FoodItemCardProps) {
  const [loading, setLoading] = useState(false)

  const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date)
  const expiryStatus = getExpiryStatus(item.expiry_date)
  const expiryColor = getExpiryColor(expiryStatus)

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
      return `Expires in ${daysUntilExpiry} days`
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">
              {item.category}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleMarkAsConsumed} disabled={loading}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Consumed
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={loading} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expiryColor}`}>
          <Calendar className="h-3 w-3 mr-1" />
          {getExpiryText()}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <Hash className="h-4 w-4 mr-1" />
          {item.quantity} {item.unit}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {item.location}
        </div>

        {item.notes && <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{item.notes}</p>}

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={handleMarkAsConsumed} disabled={loading} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            Consumed
          </Button>
          {expiryStatus === "expiring_soon" && (
            <Button size="sm" variant="outline" className="flex-1">
              Get Recipes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
