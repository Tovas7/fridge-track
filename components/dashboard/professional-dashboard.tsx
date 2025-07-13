"use client"

import { useState, useEffect } from "react"
import { supabase, type FoodItem } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
} from "lucide-react"
import { getExpiryStatus } from "@/lib/utils/food"
import AddFoodItemDialog from "./add-food-item-dialog"
import ProfessionalFoodCard from "./professional-food-card"
import AnalyticsDashboard from "./analytics-dashboard"

export default function ProfessionalDashboard() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

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

  const getAdvancedStats = () => {
    const total = foodItems.length
    const expiringSoon = foodItems.filter((item) => getExpiryStatus(item.expiry_date) === "expiring_soon").length
    const expired = foodItems.filter((item) => getExpiryStatus(item.expiry_date) === "expired").length
    const fresh = total - expiringSoon - expired

    // Calculate estimated value (mock calculation)
    const estimatedValue = foodItems.reduce((acc, item) => {
      const baseValue = item.category === "Meat" ? 15 : item.category === "Dairy" ? 8 : 5
      return acc + baseValue * item.quantity
    }, 0)

    const wasteValue = foodItems
      .filter((item) => getExpiryStatus(item.expiry_date) === "expired")
      .reduce((acc, item) => {
        const baseValue = item.category === "Meat" ? 15 : item.category === "Dairy" ? 8 : 5
        return acc + baseValue * item.quantity
      }, 0)

    return {
      total,
      fresh,
      expiringSoon,
      expired,
      estimatedValue,
      wasteValue,
      wastePercentage: total > 0 ? Math.round((expired / total) * 100) : 0,
    }
  }

  const stats = getAdvancedStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-green-600 p-2 rounded-lg mr-3">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FridgeTrack Pro</h1>
                <p className="text-xs text-gray-500">Food Waste Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Good morning, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}
              </h2>
              <p className="text-gray-600">Here's your food waste management overview for today.</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700 h-11 px-6">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Inventory</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-xs text-gray-500 mt-1">Active items</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Estimated Value</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">${stats.estimatedValue}</div>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Waste Prevention</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{100 - stats.wastePercentage}%</div>
              <p className="text-xs text-gray-500 mt-1">Efficiency rate</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Potential Loss</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${stats.wasteValue}</div>
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                {stats.expired} expired items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-green-700">Fresh Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stats.fresh}</div>
                  <p className="text-sm text-gray-600">Items in good condition</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-yellow-700">Expiring Soon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.expiringSoon}</div>
                  <p className="text-sm text-gray-600">Use within 3 days</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-red-700">Expired</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">{stats.expired}</div>
                  <p className="text-sm text-gray-600">Requires immediate attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Food Items Grid */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Inventory Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Badge variant="secondary">{foodItems.length} items</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {foodItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items in inventory</h3>
                    <p className="text-gray-600 mb-6">Start tracking your food items to optimize waste management.</p>
                    <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {foodItems.map((item) => (
                      <ProfessionalFoodCard key={item.id} item={item} onUpdate={fetchFoodItems} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard foodItems={foodItems} />
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Expiry Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Calendar view coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Waste Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Detailed reports coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Food Item Dialog */}
      <AddFoodItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={fetchFoodItems} />
    </div>
  )
}
