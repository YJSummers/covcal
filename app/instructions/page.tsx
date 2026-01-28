"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Calculator,
  Apple,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  Brain,
  Bed,
  Zap,
  ArrowLeft,
  CheckCircle,
  Target,
  Database,
  BarChart3,
  Shield,
  Smartphone,
} from "lucide-react"
import Image from "next/image"

export default function InstructionsPage() {
  const [activeSection, setActiveSection] = useState<string>("getting-started")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="CovCal Logo" width={80} height={60} className="rounded-lg" />
            <div>
              <h1 className="text-3xl font-bold text-white">App Instructions</h1>
              <p className="text-purple-200">Complete guide to using your diabetic coverage calculator</p>
            </div>
          </div>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-purple-700 text-purple-700 hover:bg-purple-100 dark:border-white dark:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>
        </div>

        {/* Quick Navigation */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { id: "getting-started", label: "Getting Started", icon: CheckCircle },
                { id: "calculator", label: "Calculator", icon: Calculator },
                { id: "food-database", label: "Food Database", icon: Apple },
                { id: "trends", label: "Trends & Analytics", icon: TrendingUp },
                { id: "advanced-features", label: "Advanced Features", icon: Activity },
                { id: "safety", label: "Safety & Tips", icon: Shield },
              ].map((item) => {
                const Icon = item.icon // convert to a capitalized component
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveSection(item.id)}
                    className="justify-start"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Getting Started */}
          {activeSection === "getting-started" && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Getting Started
                </CardTitle>
                <CardDescription>Set up your calculator for optimal results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Configure Your Insulin</h3>
                      <p className="text-sm text-gray-600">
                        Go to Settings → Insulin Medication Settings and select your fast-acting insulin type. This
                        ensures accurate IOB (Insulin on Board) calculations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Set Up Time Presets</h3>
                      <p className="text-sm text-gray-600">
                        Configure your breakfast, lunch, dinner, and bedtime settings with your doctor's prescribed
                        ratios and starting units.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Choose Your Units</h3>
                      <p className="text-sm text-gray-600">
                        Select mg/dL (US) or mmol/L (International) for blood glucose readings in Settings.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-amber-50 rounded-lg">
                    <div className="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold">Set Maximum Dose Warning</h3>
                      <p className="text-sm text-gray-600">
                        Configure a maximum dose warning to alert you when calculations exceed your typical range.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Important Reminder</h4>
                      <p className="text-sm text-yellow-700">
                        Always consult with your healthcare provider before making any changes to your insulin regimen.
                        This app is a tool to assist, not replace, medical advice.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Calculator Instructions */}
          {activeSection === "calculator" && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Using the Calculator
                </CardTitle>
                <CardDescription>Step-by-step guide to calculating your insulin dose</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible defaultValue="basic-calculation">
                  <AccordionItem value="basic-calculation">
                    <AccordionTrigger>Basic Calculation</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Step 1</Badge>
                          <span>Select a time preset (Breakfast, Lunch, Dinner, Bedtime) or use Custom</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Step 2</Badge>
                          <span>Enter your current blood sugar reading</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Step 3</Badge>
                          <span>Verify your blood sugar goal and ratio are correct</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Step 4</Badge>
                          <span>Click "Calculate Insulin Dose"</span>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Formula:</strong> (Current BG - Target BG) ÷ Ratio + Starting Units = Final Dose
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="carb-coverage">
                    <AccordionTrigger>Carbohydrate Coverage</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p>Toggle "Include Carbohydrate Coverage" to add meal insulin:</p>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Step 1</Badge>
                          <span>Enter total carbohydrates in grams</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Step 2</Badge>
                          <span>Enter your carb ratio (e.g., 15 for 1:15 ratio)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Step 3</Badge>
                          <span>The calculator adds carb units to your correction dose</span>
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Tip:</strong> Use the Food Database to quickly find carb counts for common foods and
                          meals!
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="advanced-factors">
                    <AccordionTrigger>Advanced Factors</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p>The "Advanced Factors" section accounts for lifestyle factors that affect insulin needs:</p>
                      <div className="grid gap-4">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Exercise
                          </h4>
                          <p className="text-sm text-gray-600">
                            Select activity type and duration. The app automatically reduces insulin based on exercise
                            intensity.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            Stress & Health
                          </h4>
                          <p className="text-sm text-gray-600">
                            High stress or illness typically increases insulin needs by 10-20%.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            <Bed className="h-4 w-4" />
                            Sleep Quality
                          </h4>
                          <p className="text-sm text-gray-600">
                            Poor sleep can increase insulin resistance, requiring slight dose adjustments.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="iob-tracking">
                    <AccordionTrigger>Insulin on Board (IOB)</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p>IOB shows how much active insulin remains in your system:</p>
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>Tracks insulin from previous injections</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <span>Uses advanced pharmacokinetic curves for accuracy</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <span>Helps prevent insulin stacking</span>
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Remember:</strong> Always record your doses using "Record This Dose" for accurate IOB
                          tracking.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Food Database Instructions */}
          {activeSection === "food-database" && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-green-600" />
                  Food Database Guide
                </CardTitle>
                <CardDescription>Comprehensive carb counting made easy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">🍎 What's Included</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• 500+ Foods & Ingredients</div>
                      <div>• Complete Restaurant Meals</div>
                      <div>• Fast Food Menu Items</div>
                      <div>• International Cuisines</div>
                      <div>• Packaged/Processed Foods</div>
                      <div>• Beverages & Desserts</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">How to Use:</h3>
                    <div className="grid gap-3">
                      <div className="flex gap-4 p-3 bg-blue-50 rounded-lg">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium">Search Foods</h4>
                          <p className="text-sm text-gray-600">
                            Type food name, restaurant, or category (e.g., "McDonald's", "pizza", "Chinese")
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 bg-green-50 rounded-lg">
                        <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium">Select Food Item</h4>
                          <p className="text-sm text-gray-600">
                            Click on any food to see detailed carb information and common serving sizes
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 bg-purple-50 rounded-lg">
                        <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium">Calculate Portions</h4>
                          <p className="text-sm text-gray-600">
                            Adjust quantity to match your portion size and see total carbs automatically calculated
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-3 bg-amber-50 rounded-lg">
                        <div className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium">Use in Calculator</h4>
                          <p className="text-sm text-gray-600">
                            Click "Use in Calculator" to automatically transfer carb count to your insulin calculation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Restaurant portions are often larger than listed - consider weighing when possible</li>
                      <li>• Combination meals show total carbs for the complete meal</li>
                      <li>• International foods include authentic preparation methods</li>
                      <li>• Packaged foods reflect actual nutrition labels</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trends & Analytics */}
          {activeSection === "trends" && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Trends & Analytics
                </CardTitle>
                <CardDescription>Optimize your diabetes management with data insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-3">📊 Available Analytics</h3>
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Average doses by time of day</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Time-in-range analysis</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Blood sugar patterns</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Brain className="h-4 w-4 text-amber-600" />
                        <span className="text-sm">Smart optimization suggestions</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Understanding Your Data:</h3>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="time-patterns">
                        <AccordionTrigger>Time-of-Day Patterns</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm mb-3">
                            Track how your insulin needs vary throughout the day. Look for patterns like:
                          </p>
                          <ul className="text-sm space-y-1 text-gray-600">
                            <li>• Higher morning doses (dawn phenomenon)</li>
                            <li>• Consistent lunch requirements</li>
                            <li>• Variable dinner needs</li>
                            <li>• Bedtime correction patterns</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="optimization">
                        <AccordionTrigger>Optimization Suggestions</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm mb-3">The app provides intelligent suggestions when it detects:</p>
                          <ul className="text-sm space-y-1 text-gray-600">
                            <li>• Consistently high correction doses (may need stronger ratio)</li>
                            <li>• Frequent negative corrections (may need weaker ratio)</li>
                            <li>• High blood sugar patterns (review carb ratios)</li>
                            <li>• Successful management streaks (positive reinforcement)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="sharing">
                        <AccordionTrigger>Sharing with Healthcare Providers</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm mb-3">Use your trends data during medical appointments:</p>
                          <ul className="text-sm space-y-1 text-gray-600">
                            <li>• Screenshot trend summaries</li>
                            <li>• Discuss optimization suggestions</li>
                            <li>• Review time-in-range improvements</li>
                            <li>• Identify patterns for ratio adjustments</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Advanced Features */}
          {activeSection === "advanced-features" && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-600" />
                  Advanced Features
                </CardTitle>
                <CardDescription>Professional-grade tools for optimal diabetes management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Emergency Protocols
                    </h3>
                    <p className="text-sm text-red-700 mb-3">
                      Quick access to critical treatment information for hypoglycemia and hyperglycemia.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium">Hypoglycemia (&lt;70 mg/dL)</h4>
                        <ul className="text-xs space-y-1 text-red-600">
                          <li>• 15g fast-acting carbs</li>
                          <li>• Wait 15 minutes, recheck</li>
                          <li>• Call 911 if unconscious</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium">Hyperglycemia (&gt;250 mg/dL)</h4>
                        <ul className="text-xs space-y-1 text-red-600">
                          <li>• Check ketones</li>
                          <li>• Drink water</li>
                          <li>• Contact healthcare provider</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">🧬 Advanced IOB Calculations</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Uses pharmacokinetic curves specific to your insulin type:
                    </p>
                    <div className="grid gap-2 text-sm">
                      <div>
                        <strong>Biexponential:</strong> Humalog, Novolog, Apidra (most accurate for rapid-acting)
                      </div>
                      <div>
                        <strong>Exponential:</strong> Fiasp, Afrezza (ultra-rapid insulins)
                      </div>
                      <div>
                        <strong>Linear:</strong> Regular insulin, custom types
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">🏃‍♂️ Exercise Impact Calculator</h3>
                    <p className="text-sm text-green-700 mb-3">
                      Automatically adjusts insulin based on activity type and duration:
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <strong>Light Activities:</strong>
                        <br />
                        Walking, Yoga
                        <br />
                        <em>5-10% reduction</em>
                      </div>
                      <div>
                        <strong>Moderate Activities:</strong>
                        <br />
                        Cycling, Weight Training
                        <br />
                        <em>15-25% reduction</em>
                      </div>
                      <div>
                        <strong>Vigorous Activities:</strong>
                        <br />
                        Running, Swimming
                        <br />
                        <em>30-35% reduction</em>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-3">🧠 Multi-Factor Adjustments</h3>
                    <p className="text-sm text-purple-700 mb-3">
                      Accounts for lifestyle factors that affect insulin sensitivity:
                    </p>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>High Stress/Illness:</span>
                        <span className="font-medium">+15-20% insulin</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Poor Sleep (&lt;5 hours):</span>
                        <span className="font-medium">+5% insulin</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Luteal Phase (menstrual):</span>
                        <span className="font-medium">+10% insulin</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Safety & Tips */}
          {activeSection === "safety" && (
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Safety & Best Practices
                </CardTitle>
                <CardDescription>Essential safety information and tips for optimal use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">⚠️ Critical Safety Reminders</h3>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• This app is a tool to assist, not replace, medical advice</li>
                        <li>• Always consult your healthcare provider before changing insulin regimens</li>
                        <li>• Double-check all calculations before administering insulin</li>
                        <li>• Never rely solely on this app for emergency situations</li>
                        <li>• Keep emergency contacts and supplies readily available</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">🔒 Data Privacy & Security</h3>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>All data stored locally on your device only</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span>No data transmitted to external servers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>Different devices maintain separate records</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">✅ Best Practices</h3>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li>
                        <strong>Regular Updates:</strong> Keep your presets updated as your insulin needs change
                      </li>
                      <li>
                        <strong>Consistent Recording:</strong> Always record doses for accurate IOB tracking
                      </li>
                      <li>
                        <strong>Pattern Recognition:</strong> Review trends weekly to identify optimization
                        opportunities
                      </li>
                      <li>
                        <strong>Backup Important Settings:</strong> Screenshot your settings for reference
                      </li>
                      <li>
                        <strong>Share with Care Team:</strong> Show trends to your healthcare providers
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-3">💡 Pro Tips for Success</h3>
                    <ul className="text-sm text-amber-700 space-y-2">
                      <li>
                        <strong>Start Conservative:</strong> When trying new features, start with smaller adjustments
                      </li>
                      <li>
                        <strong>Track Patterns:</strong> Look for trends over days/weeks, not individual calculations
                      </li>
                      <li>
                        <strong>Use Food Database:</strong> More accurate carb counting leads to better outcomes
                      </li>
                      <li>
                        <strong>Consider All Factors:</strong> Exercise, stress, and sleep all affect insulin needs
                      </li>
                      <li>
                        <strong>Emergency Preparedness:</strong> Always have fast-acting carbs and glucagon available
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">📞 When to Contact Healthcare Providers</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Frequent high or low blood sugars</li>
                    <li>• Significant changes in insulin requirements</li>
                    <li>• Questions about optimization suggestions</li>
                    <li>• Before making major lifestyle changes</li>
                    <li>• Any concerns about your diabetes management</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Diabetic Coverage Calculator - Advanced insulin management tool</p>
              <p className="text-xs text-gray-500">Powered by Operational Excellence Advisors | Version 2.0</p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Return to Calculator
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
