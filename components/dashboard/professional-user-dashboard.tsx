"use client"

import { useState, useEffect } from "react"
import { supabase, type FoodItem } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notify } from "@/lib/notifications"
import { Loading } from "@/components/ui/loading"
import SettingsDialog from "@/components/settings/settings-dialog"
import HelpCenter from "@/components/help/help-center"
import OnboardingFlow from "@/components/onboarding/onboarding-flow"
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
  HelpCircle,
  Download,
  Share2,
} from "lucide-react"
import { getExpiryStatus } from "@/lib/utils/food"
import AddFoodItemDialog from "./add-food-item-dialog"
import UserFoodCard from "./user-food-card"

export default function ProfessionalUserDashboard() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      await getUser()
      await fetchFoodItems()
    } catch (error) {
      notify.error("Failed to load dashboard", {
        description: "Please refresh the page or contact support if the problem persists.",
      })
    }
  }

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(profile)

      // Show onboarding if user hasn't completed it
      if (!profile?.onboarding_completed) {
        setShowOnboarding(true)
      }
    }
  }

  const fetchFoodItems = async () => {
    try {
      const { data, error } = await supabase
        .from("food_items")
        .select("*")
        .eq("is_consumed", false)
        .order("expiry_date", { ascending: true })

      if (error) throw error

      setFoodItems(data || [])

      // Show notifications for expiring items
      const expiringSoon = data?.filter((item) => getExpiryStatus(item.expiry_date) === "expiring_soon") || []
      if (expiringSoon.length > 0) {
        notify.warning(`${expiringSoon.length} items expiring soon!`, {
          description: "Check your dashboard to see which items need attention.",
          action: {
            label: "View Items",
            onClick: () => document.getElementById("expiring-items")?.scrollIntoView({ behavior: "smooth" }),
          },
        })
      }
    } catch (error) {
      notify.error("Failed to load food items")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      notify.info("Signed out successfully", {
        description: "Thanks for using FridgeTrack! See you next time.",
      })
    } catch (error) {
      notify.error("Failed to sign out")
    }
  }

  const exportData = async () => {
    try {
      const exportData = {
        profile: profile,
        foodItems: foodItems,
        exportDate: new Date().toISOString(),
        stats: getStats(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fridgetrack-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      notify.success("Data exported successfully", {
        description: "Your FridgeTrack data has been downloaded.",
      })
    } catch (error) {
      notify.error("Failed to export data")
    }
  }

  const shareStats = async () => {
    const stats = getStats()
    const shareText = `I've saved $${stats.monthlySavings} this month and prevented ${(100 - stats.wastePercentage).toFixed(0)}% food waste with @FridgeTrack! 🌱💚 #FoodWaste #Sustainability`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My FridgeTrack Impact",
          text: shareText,
          url: window.location.origin,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText)
      notify.success("Copied to clipboard!", {
        description: "Share your impact on social media.",
      })
    }
  }

  const getStats = () => {
    const total = foodItems.length
    const expiringSoon = foodItems.filter((item) => getExpiryStatus(item.expiry_date) === "expiring_soon").length
    const expired = foodItems.filter((item) => getExpiryStatus(item.expiry_date) === "expired").length
    const fresh = total - expiringSoon - expired

    const wastePercentage = total > 0 ? (expired / total) * 100 : 0
    const monthlySavings = Math.round(125 * (1 - wastePercentage / 100))

    return { total, fresh, expiringSoon, expired, monthlySavings, wastePercentage }
  }

  const stats = getStats()

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
  }

  if (loading) {
    return <Loading fullScreen text="Loading your FridgeTrack dashboard..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
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
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={shareStats}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Impact
              </Button>
              <Button variant="ghost" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setShowHelp(true)}>
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {stats.expiringSoon > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.expiringSoon}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}! 👋
              </h2>
              <p className="text-gray-600 text-lg">
                You're making a real difference! Keep up the great work reducing food waste.
              </p>
            </div>
            <Button onClick={() => setShowAddDialog(true)} size="lg" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-5 w-5 mr-2" />
              Add Food Item
            </Button>
          </div>
        </div>

        {/* Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-green-500 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-600 hover:bg-green-600">This Month</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-1">${stats.monthlySavings}</div>
              <p className="text-green-600 font-medium">Money Saved</p>
              <p className="text-sm text-gray-600 mt-2">
                You're on track to save ${stats.monthlySavings * 12} this year! 🎉
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-blue-600 hover:bg-blue-600">Health</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 mb-1">{stats.fresh}</div>
              <p className="text-blue-600 font-medium">Fresh Items</p>
              <p className="text-sm text-gray-600 mt-2">
                Fresh food means better nutrition and taste for your family! 🥗
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-purple-600 hover:bg-purple-600">Planet Impact</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 mb-1">{(100 - stats.wastePercentage).toFixed(0)}%</div>
              <p className="text-purple-600 font-medium">Waste Prevented</p>
              <p className="text-sm text-gray-600 mt-2">You're helping save the planet, one meal at a time! 🌍</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-green-600">{stats.fresh}</div>
            <p className="text-sm text-gray-600">Fresh & Good</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
            <p className="text-sm text-gray-600">Use Soon</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <p className="text-sm text-gray-600">Past Due</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Your Food Inventory</h3>
            <p className="text-gray-600">Track what's in your fridge, freezer, and pantry</p>
          </div>
          <div className="flex gap-3">
            {stats.expiringSoon > 0 && (
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                <ChefHat className="h-4 w-4 mr-2" />
                Find Recipes ({stats.expiringSoon})
              </Button>
            )}
            <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Food Item
            </Button>
          </div>
        </div>

        {/* Food Items */}
        {foodItems.length === 0 ? (
          <Card className="text-center py-16 hover:shadow-lg transition-shadow">
            <CardContent>
              <Refrigerator className="h-20 w-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Ready to start your journey?</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Add your first food items to begin tracking expiry dates, reducing waste, and saving money!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setShowAddDialog(true)} size="lg" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Item
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowHelp(true)}>
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Learn How It Works
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Priority Items */}
            {stats.expiringSoon > 0 && (
              <Card
                id="expiring-items"
                className="mb-6 border-yellow-200 bg-yellow-50 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <CardTitle className="text-yellow-800">⚡ Priority: Use These Soon!</CardTitle>
                    <Badge className="bg-yellow-200 text-yellow-800">{stats.expiringSoon} items</Badge>
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
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Food Items</CardTitle>
                  <Badge variant="secondary">
                    {foodItems.filter((item) => getExpiryStatus(item.expiry_date) !== "expiring_soon").length} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foodItems
                    .filter((item) => getExpiryStatus(item.expiry_date) !== "expiring_soon")
                    .map((item) => (
                      <UserFoodCard key={item.id} item={item} onUpdate={fetchFoodItems} />
                    ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Motivational Footer */}
        {foodItems.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-0 hover:shadow-lg transition-shadow">
            <CardContent className="text-center py-8">
              <div className="flex justify-center items-center gap-4 mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Amazing Progress! 🌟</h3>
                  <p className="text-gray-600">
                    You're part of a community making a real difference in reducing food waste worldwide.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>${stats.monthlySavings} saved this month</span>
                </div>
                <div className="flex items-center gap-1">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span>{(100 - stats.wastePercentage).toFixed(0)}% waste prevented</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{stats.fresh} fresh items tracked</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4" onClick={shareStats}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Your Impact
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Dialogs */}
      <AddFoodItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={fetchFoodItems} />
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      <HelpCenter open={showHelp} onOpenChange={setShowHelp} />
    </div>
  )
}
