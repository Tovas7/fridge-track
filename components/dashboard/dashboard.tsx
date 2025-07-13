"use client"

import { useState, useEffect } from "react"
import { supabase, type FoodItem } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Bell, Settings, LogOut, Refrigerator, AlertTriangle, CheckCircle } from "lucide-react"
import { getExpiryStatus } from "@/lib/utils/food"
import AddFoodItemDialog from "./add-food-item-dialog"
import FoodItemCard from "./food-item-card"

export default function Dashboard() {
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

    return { total, fresh, expiringSoon, expired }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Refrigerator className="h-12 w-12 mx-auto mb-4 text-green-600 animate-pulse" />
          <p className="text-gray-600">Loading your fridge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Refrigerator className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">FridgeTrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || "there"}! 👋
          </h2>
          <p className="text-gray-600">Let's keep track of your food and reduce waste together.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Refrigerator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fresh</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.fresh}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Food Items</h3>
          <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Food Item
          </Button>
        </div>

        {/* Food Items Grid */}
        {foodItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Refrigerator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your fridge is empty!</h3>
              <p className="text-gray-600 mb-4">Start tracking your food items to reduce waste and save money.</p>
              <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodItems.map((item) => (
              <FoodItemCard key={item.id} item={item} onUpdate={fetchFoodItems} />
            ))}
          </div>
        )}
      </main>

      {/* Add Food Item Dialog */}
      <AddFoodItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={fetchFoodItems} />
    </div>
  )
}
