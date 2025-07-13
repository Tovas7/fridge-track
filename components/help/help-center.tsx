"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  HelpCircle,
  Book,
  MessageCircle,
  Video,
  Mail,
  Phone,
  ExternalLink,
  Star,
  Clock,
  Users,
} from "lucide-react"

interface HelpCenterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HelpCenter({ open, onOpenChange }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const faqItems = [
    {
      question: "How do I add food items to my fridge?",
      answer:
        "Click the 'Add Food' button on your dashboard, fill in the item details including name, category, purchase date, and expiry date. You can also add quantity, storage location, and notes.",
      category: "Getting Started",
    },
    {
      question: "How do expiry notifications work?",
      answer:
        "FridgeTrack automatically calculates when your food items are about to expire and sends you notifications 3 days before the expiry date. You can customize notification preferences in Settings.",
      category: "Notifications",
    },
    {
      question: "Can I share my fridge with family members?",
      answer:
        "Family sharing is available with our Premium plan. You can invite family members to view and manage the same fridge inventory together.",
      category: "Premium Features",
    },
    {
      question: "How accurate are the money savings calculations?",
      answer:
        "Our savings calculations are based on average food prices and waste statistics. The estimates help you understand your impact, but actual savings may vary based on your shopping habits and local prices.",
      category: "Analytics",
    },
    {
      question: "Can I export my data?",
      answer:
        "Yes! Go to Settings > Privacy & Data and click 'Export Your Data' to download all your information in JSON format. This includes your profile, food items, and usage statistics.",
      category: "Data & Privacy",
    },
    {
      question: "How do I cancel my Premium subscription?",
      answer:
        "You can cancel your Premium subscription anytime in Settings > Billing. Your Premium features will remain active until the end of your current billing period.",
      category: "Billing",
    },
  ]

  const tutorials = [
    {
      title: "Getting Started with FridgeTrack",
      description: "Learn the basics of food tracking and waste reduction",
      duration: "5 min",
      type: "Video",
      popular: true,
    },
    {
      title: "Setting Up Notifications",
      description: "Configure alerts for expiring food items",
      duration: "3 min",
      type: "Guide",
      popular: false,
    },
    {
      title: "Understanding Your Analytics",
      description: "Make sense of your waste reduction statistics",
      duration: "4 min",
      type: "Video",
      popular: true,
    },
    {
      title: "Recipe Integration Tips",
      description: "Get the most out of recipe suggestions",
      duration: "6 min",
      type: "Guide",
      popular: false,
    },
  ]

  const filteredFAQs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Help Center
          </DialogTitle>
          <DialogDescription>Find answers, tutorials, and get support for FridgeTrack</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for help articles, tutorials, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                <Badge variant="secondary">{filteredFAQs.length} articles</Badge>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <span>{item.question}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No articles found matching your search.</p>
                  <Button variant="outline" className="mt-2" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tutorials" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Video Tutorials & Guides</h3>
                <Badge variant="secondary">{tutorials.length} tutorials</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {tutorial.type === "Video" ? (
                            <Video className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Book className="h-4 w-4 text-green-600" />
                          )}
                          <Badge variant={tutorial.type === "Video" ? "default" : "secondary"} className="text-xs">
                            {tutorial.type}
                          </Badge>
                        </div>
                        {tutorial.popular && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base">{tutorial.title}</CardTitle>
                      <CardDescription>{tutorial.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {tutorial.duration}
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <h3 className="text-lg font-semibold">Get in Touch</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MessageCircle className="h-4 w-4" />
                      Live Chat
                    </CardTitle>
                    <CardDescription>Get instant help from our support team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Available: Mon-Fri, 9AM-6PM EST</p>
                        <p className="text-green-600 font-medium">● Online now</p>
                      </div>
                      <Button>Start Chat</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Mail className="h-4 w-4" />
                      Email Support
                    </CardTitle>
                    <CardDescription>Send us a detailed message</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Response time: Within 24 hours</p>
                        <p>support@fridgetrack.com</p>
                      </div>
                      <Button variant="outline">Send Email</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Phone className="h-4 w-4" />
                      Phone Support
                    </CardTitle>
                    <CardDescription>Premium subscribers only</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Available: Mon-Fri, 9AM-5PM EST</p>
                        <p>+1 (555) 123-4567</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Users className="h-4 w-4" />
                      Community Forum
                    </CardTitle>
                    <CardDescription>Connect with other FridgeTrack users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Get tips and share experiences</p>
                        <p>1,200+ active members</p>
                      </div>
                      <Button variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit Forum
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="status" className="space-y-4">
              <h3 className="text-lg font-semibold">System Status</h3>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">All Systems Operational</CardTitle>
                    <Badge className="bg-green-100 text-green-800">● Operational</Badge>
                  </div>
                  <CardDescription>Last updated: 2 minutes ago</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Services</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recipe Integration</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border-l-2 border-green-500 pl-4">
                    <p className="text-sm font-medium">New Recipe Integration</p>
                    <p className="text-xs text-gray-500">Added 500+ new recipes for expiring ingredients</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-4">
                    <p className="text-sm font-medium">Performance Improvements</p>
                    <p className="text-xs text-gray-500">Faster loading times and better mobile experience</p>
                    <p className="text-xs text-gray-400">1 week ago</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
