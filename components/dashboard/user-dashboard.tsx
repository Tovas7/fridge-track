"use client"

import { useState, useEffect } from "react"
import { supabase, type FoodItem } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Bell,
  Settings,
  LogOut,
  Refrigerator,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Heart,
  Leaf,
  ChefHat,
} from "lucide-react"
import { getExpiryStatus } from "@/lib/utils/food"
import AddFoodItemDialog from "./add-food-item-dialog"
import UserFoodCard from "./user-food-card"

export default function UserDashboard() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getUser()
    fetchFoodItems()
  }, [])

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchFoodItems = async () => {
    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .eq("is_consumed", false)
      .order("expiry_date", { ascending: true })

    if (error) {
      console.error("Error fetching food items:", error)
    } else {
      setFoodItems(data || [])
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const getStats = () => {
    const total = foodItems.length
    const expiringSoon = foodItems.filter((item) => getExpiryStatus(item.expiry_date) === "expiring_soon").length
    const expired = foodItems.filter((item) => getExpiryStatus(item.expiry_date) === "expired").length
    const fresh = total - expiringSoon - expired

    // Calculate estimated savings (average family wastes $1,500/year)
    const wastePercentage = total > 0 ? (expired / total) * 100 : 0
    const monthlySavings = Math.round(125 * (1 - wastePercentage / 100)) // $125 is monthly average waste

    return { total, fresh, expiringSoon, expired, monthlySavings, wastePercentage }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Refrigerator className="h-16 w-16 mx-auto mb-4 text-green-600 animate-pulse" />
          <p className="text-gray-600 text-lg">Loading your fridge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                <Refrigerator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FridgeTrack</h1>
                <p className="text-xs text-gray-500">Smart Food Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {stats.expiringSoon > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.expiringSoon}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hi {user?.user_metadata?.full_name?.split(" ")[0] || "there"}! 👋
          </h2>
          <p className="text-gray-600 text-lg">
            You're doing great! Keep tracking your food to save money and help the planet.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-green-500 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-600">This Month</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-1">${stats.monthlySavings}</div>
              <p className="text-green-600 font-medium">Money Saved</p>
              <p className="text-sm text-gray-600 mt-2">By reducing food waste, you're saving money every month!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-blue-600">Health</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 mb-1">{stats.fresh}</div>
              <p className="text-blue-600 font-medium">Fresh Items</p>
              <p className="text-sm text-gray-600 mt-2">Fresh food means better nutrition for you and your family!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-purple-600">Impact</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 mb-1">{(100 - stats.wastePercentage).toFixed(0)}%</div>
              <p className="text-purple-600 font-medium">Waste Prevented</p>
              <p className="text-sm text-gray-600 mt-2">You're helping reduce your environmental footprint!</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-green-600">{stats.fresh}</div>
            <p className="text-sm text-gray-600">Fresh</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
            <p className="text-sm text-gray-600">Use Soon</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-sm text-gray-600">Expired</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Your Food Items</h3>
            <p className="text-gray-600">Keep track of what's in your fridge, freezer, and pantry</p>
          </div>
          <div className="flex gap-3">
            {stats.expiringSoon > 0 && (
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                <ChefHat className="h-4 w-4 mr-2" />
                Get Recipes ({stats.expiringSoon})
              </Button>
            )}
            <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Food
            </Button>
          </div>
        </div>

        {/* Food Items */}
        {foodItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Refrigerator className="h-20 w-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Your fridge is empty!</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start adding your groceries to track expiry dates, get reminders, and save money by reducing waste.
              </p>
              <Button onClick={() => setShowAddDialog(true)} size="lg" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Priority Items */}
            {stats.expiringSoon > 0 && (
              <Card className="mb-6 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <CardTitle className="text-yellow-800">Use These Soon!</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {foodItems
                      .filter((item) => getExpiryStatus(item.expiry_date) === "expiring_soon")
                      .map((item) => (
                        <UserFoodCard key={item.id} item={item} onUpdate={fetchFoodItems} priority />
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodItems
                .filter((item) => getExpiryStatus(item.expiry_date) !== "expiring_soon")
                .map((item) => (
                  <UserFoodCard key={item.id} item={item} onUpdate={fetchFoodItems} />
                ))}
            </div>
          </>
        )}

        {/* Motivational Footer */}
        {foodItems.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-0">
            <CardContent className="text-center py-8">
              <div className="flex justify-center items-center gap-4 mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">You're Making a Difference!</h3>
                  <p className="text-gray-600">
                    Every item you track helps reduce waste and saves money. Keep it up! 🌟
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-8 text-sm text-gray-600">
                <div>💰 ${stats.monthlySavings} saved this month</div>
                <div>🌱 {(100 - stats.wastePercentage).toFixed(0)}% waste prevented</div>
                <div>❤️ {stats.fresh} fresh items</div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Add Food Item Dialog */}
      <AddFoodItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={fetchFoodItems} />
    </div>
  )
}
