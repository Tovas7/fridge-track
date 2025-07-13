"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { FoodItem } from "@/lib/supabase"
import { getExpiryStatus } from "@/lib/utils/food"
import { TrendingUp, DollarSign, Package, Leaf, Target } from "lucide-react"

interface AnalyticsDashboardProps {
  foodItems: FoodItem[]
}

export default function AnalyticsDashboard({ foodItems }: AnalyticsDashboardProps) {
  const getCategoryBreakdown = () => {
    const categories = foodItems.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }

  const getWasteAnalysis = () => {
    const total = foodItems.length
    const expired = foodItems.filter((item) => getExpiryStatus(item.expiry_date) === "expired").length
    const expiringSoon = foodItems.filter((item) => getExpiryStatus(item.expiry_date) === "expiring_soon").length

    const wasteRate = total > 0 ? (expired / total) * 100 : 0
    const riskRate = total > 0 ? ((expired + expiringSoon) / total) * 100 : 0

    return { wasteRate, riskRate, total, expired, expiringSoon }
  }

  const getLocationAnalysis = () => {
    const locations = foodItems.reduce(
      (acc, item) => {
        acc[item.location] = (acc[item.location] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(locations).map(([location, count]) => ({ location, count }))
  }

  const categoryBreakdown = getCategoryBreakdown()
  const wasteAnalysis = getWasteAnalysis()
  const locationAnalysis = getLocationAnalysis()

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Waste Reduction</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{(100 - wasteAnalysis.wasteRate).toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">Efficiency rate</p>
            <Progress value={100 - wasteAnalysis.wasteRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Risk Items</CardTitle>
            <Target className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{wasteAnalysis.expiringSoon}</div>
            <p className="text-xs text-gray-500 mt-1">Expiring soon</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="text-xs text-yellow-600">Requires attention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              $
              {foodItems.reduce((acc, item) => {
                const baseValue = item.category === "Meat" ? 15 : item.category === "Dairy" ? 8 : 5
                return acc + baseValue * item.quantity
              }, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Estimated inventory value</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Items</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{foodItems.length}</div>
            <p className="text-xs text-gray-500 mt-1">Currently tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryBreakdown.map(({ category, count }) => {
              const percentage = (count / foodItems.length) * 100
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {count} items
                      </Badge>
                      <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Storage Location Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Storage Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {locationAnalysis.map(({ location, count }) => {
              const percentage = (count / foodItems.length) * 100
              return (
                <div key={location} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{location}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {count} items
                      </Badge>
                      <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Waste Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Waste Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {(100 - wasteAnalysis.wasteRate).toFixed(1)}%
              </div>
              <p className="text-sm text-green-700 font-medium">Waste Prevention Rate</p>
              <p className="text-xs text-gray-600 mt-1">Items consumed before expiry</p>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{wasteAnalysis.expiringSoon}</div>
              <p className="text-sm text-yellow-700 font-medium">At Risk Items</p>
              <p className="text-xs text-gray-600 mt-1">Expiring within 3 days</p>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">{wasteAnalysis.expired}</div>
              <p className="text-sm text-red-700 font-medium">Expired Items</p>
              <p className="text-xs text-gray-600 mt-1">Require immediate attention</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
