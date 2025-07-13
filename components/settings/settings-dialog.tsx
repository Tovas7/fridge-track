"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { notify } from "@/lib/notifications"
import { User, Bell, Shield, Download, Trash2, CreditCard } from "lucide-react"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    expiryReminders: true,
    recipesSuggestions: true,
    weeklyReports: true,
  })

  useEffect(() => {
    if (open) {
      loadUserData()
    }
  }, [open])

  const loadUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(profile)

      if (profile) {
        setNotifications({
          email: profile.email_notifications ?? true,
          push: profile.push_notifications ?? true,
          sms: profile.sms_notifications ?? false,
          expiryReminders: profile.expiry_reminders ?? true,
          recipesSuggestions: profile.recipe_suggestions ?? true,
          weeklyReports: profile.weekly_reports ?? true,
        })
      }
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user) return

    setLoading(true)
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      ...updates,
    })

    if (error) {
      notify.error("Failed to update profile", { description: error.message })
    } else {
      notify.success("Profile updated successfully")
      setProfile({ ...profile, ...updates })
    }
    setLoading(false)
  }

  const updateNotifications = async (key: string, value: boolean) => {
    const newNotifications = { ...notifications, [key]: value }
    setNotifications(newNotifications)

    const dbKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
    await updateProfile({ [dbKey]: value })
  }

  const exportData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data: foodItems } = await supabase.from("food_items").select("*").eq("user_id", user.id)

      const exportData = {
        profile: profile,
        foodItems: foodItems,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fridgetrack-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      notify.success("Data exported successfully")
    } catch (error) {
      notify.error("Failed to export data")
    }
    setLoading(false)
  }

  const deleteAccount = async () => {
    if (!user) return
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return

    setLoading(true)
    try {
      // Delete user data
      await supabase.from("food_items").delete().eq("user_id", user.id)
      await supabase.from("profiles").delete().eq("id", user.id)

      // Delete auth user (requires admin privileges in production)
      notify.info("Account deletion requested", {
        description: "Please contact support to complete account deletion.",
      })
    } catch (error) {
      notify.error("Failed to delete account")
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your account settings and preferences</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      defaultValue={profile?.full_name || ""}
                      onBlur={(e) => updateProfile({ full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email || ""} disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue={profile?.phone_number || ""}
                    onBlur={(e) => updateProfile({ phone_number: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about your food items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => updateNotifications("email", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive browser push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => updateNotifications("push", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">Receive text message alerts</p>
                        <Badge variant="secondary">Premium</Badge>
                      </div>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notifications.sms}
                      onCheckedChange={(checked) => updateNotifications("sms", checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="expiry-reminders">Expiry Reminders</Label>
                      <p className="text-sm text-gray-500">Get notified when items are about to expire</p>
                    </div>
                    <Switch
                      id="expiry-reminders"
                      checked={notifications.expiryReminders}
                      onCheckedChange={(checked) => updateNotifications("expiryReminders", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="recipe-suggestions">Recipe Suggestions</Label>
                      <p className="text-sm text-gray-500">Get recipe ideas for expiring ingredients</p>
                    </div>
                    <Switch
                      id="recipe-suggestions"
                      checked={notifications.recipesSuggestions}
                      onCheckedChange={(checked) => updateNotifications("recipesSuggestions", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-sm text-gray-500">Receive weekly waste reduction summaries</p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => updateNotifications("weeklyReports", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Data
                </CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Export Your Data</h4>
                    <p className="text-sm text-gray-500">Download all your data in JSON format</p>
                  </div>
                  <Button variant="outline" onClick={exportData} disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                  <div>
                    <h4 className="font-medium text-red-700">Delete Account</h4>
                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" onClick={deleteAccount} disabled={loading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing & Subscription
                </CardTitle>
                <CardDescription>Manage your subscription and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-green-800">Free Plan</h4>
                      <p className="text-sm text-green-600">You're currently on the free plan</p>
                    </div>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Upgrade to Premium</h4>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• SMS notifications</li>
                    <li>• Advanced analytics</li>
                    <li>• Recipe recommendations</li>
                    <li>• Family sharing</li>
                    <li>• Priority support</li>
                  </ul>
                  <Button className="w-full">Upgrade to Premium - $4.99/month</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
