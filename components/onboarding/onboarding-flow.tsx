"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { notify } from "@/lib/notifications"
import {
  User,
  Bell,
  Smartphone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Refrigerator,
  Target,
  DollarSign,
  Leaf,
} from "lucide-react"

interface OnboardingFlowProps {
  onComplete: () => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    householdSize: "2",
    goals: [] as string[],
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  })

  const steps = [
    {
      title: "Welcome to FridgeTrack!",
      description: "Let's get you set up to start saving food and money",
      icon: Refrigerator,
    },
    {
      title: "Tell us about yourself",
      description: "Help us personalize your experience",
      icon: User,
    },
    {
      title: "Set your goals",
      description: "What do you want to achieve with FridgeTrack?",
      icon: Target,
    },
    {
      title: "Notification preferences",
      description: "Choose how you'd like to be reminded",
      icon: Bell,
    },
    {
      title: "You're all set!",
      description: "Ready to start your food waste reduction journey",
      icon: CheckCircle,
    },
  ]

  const goalOptions = [
    { id: "save-money", label: "Save money on groceries", icon: DollarSign },
    { id: "reduce-waste", label: "Reduce food waste", icon: Leaf },
    { id: "eat-healthier", label: "Eat fresher, healthier food", icon: CheckCircle },
    { id: "meal-planning", label: "Better meal planning", icon: Target },
  ]

  const handleNext = async () => {
    if (currentStep === steps.length - 2) {
      // Last step before completion - save data
      await saveOnboardingData()
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const saveOnboardingData = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          household_size: Number.parseInt(formData.householdSize),
          goals: formData.goals,
          email_notifications: formData.notifications.email,
          push_notifications: formData.notifications.push,
          sms_notifications: formData.notifications.sms,
          onboarding_completed: true,
          created_at: new Date().toISOString(),
        })

        if (error) throw error

        notify.success("Welcome to FridgeTrack!", {
          description: "Your account has been set up successfully",
        })
      }
    } catch (error) {
      notify.error("Failed to save your preferences", {
        description: "Please try again or contact support",
      })
    }
    setLoading(false)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleGoal = (goalId: string) => {
    const newGoals = formData.goals.includes(goalId)
      ? formData.goals.filter((g) => g !== goalId)
      : [...formData.goals, goalId]
    updateFormData("goals", newGoals)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <Refrigerator className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to FridgeTrack!</h2>
              <p className="text-gray-600 text-lg">
                Join thousands of families who are saving money and reducing food waste with smart food tracking.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Save $1,500+</p>
                <p className="text-xs text-gray-500">per year</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">40% Less Waste</p>
                <p className="text-xs text-gray-500">on average</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Fresher Food</p>
                <p className="text-xs text-gray-500">better health</p>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">This helps us personalize your FridgeTrack experience</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-xs text-gray-500 mt-1">For SMS notifications (Premium feature)</p>
              </div>
              <div>
                <Label htmlFor="householdSize">Household Size</Label>
                <select
                  id="householdSize"
                  value={formData.householdSize}
                  onChange={(e) => updateFormData("householdSize", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5+ people</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">What are your goals?</h2>
              <p className="text-gray-600">Select all that apply - we'll help you achieve them!</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {goalOptions.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.goals.includes(goal.id)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleGoal(goal.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox checked={formData.goals.includes(goal.id)} readOnly />
                    <goal.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{goal.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Bell className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Stay informed</h2>
              <p className="text-gray-600">Choose how you'd like to receive notifications</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Expiry reminders and weekly reports</p>
                  </div>
                </div>
                <Checkbox
                  checked={formData.notifications.email}
                  onCheckedChange={(checked) =>
                    updateFormData("notifications", { ...formData.notifications, email: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded">
                    <Smartphone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">Real-time alerts in your browser</p>
                  </div>
                </div>
                <Checkbox
                  checked={formData.notifications.push}
                  onCheckedChange={(checked) =>
                    updateFormData("notifications", { ...formData.notifications, push: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg opacity-60">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded">
                    <Smartphone className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">SMS Notifications</p>
                      <Badge variant="secondary" className="text-xs">
                        Premium
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">Text message alerts</p>
                  </div>
                </div>
                <Checkbox disabled />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
              <p className="text-gray-600 text-lg">
                Welcome to FridgeTrack, {formData.fullName}! Let's start reducing food waste together.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">What's next?</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Add your first food items to start tracking</li>
                <li>• Set up expiry date reminders</li>
                <li>• Explore recipe suggestions for expiring items</li>
                <li>• Check your weekly waste reduction reports</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? "bg-green-600" : "bg-gray-200"
                  } transition-colors`}
                />
              ))}
            </div>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Button onClick={handleNext} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? (
                "Saving..."
              ) : currentStep === steps.length - 1 ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
