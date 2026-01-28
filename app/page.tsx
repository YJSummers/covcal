"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Calculator,
  AlertTriangle,
  Info,
  Clock,
  Save,
  Trash2,
  History,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  Activity,
  TrendingUp,
  Apple,
  Zap,
  Heart,
  Brain,
  Bed,
  Search,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SplashScreen from "@/components/splash-screen"

// Guarantees we always pass a **string** to any <Input value={}> prop
const asString = (v: unknown) => (v ?? "").toString()

// Types
type GlucoseUnit = "mg/dL" | "mmol/L"
type TimePreset = "breakfast" | "lunch" | "dinner" | "bedtime" | "custom"

interface InsulinMedication {
  name: string
  brand: string
  duration: number // in hours
  peakTime: string
  description: string
  curve: "linear" | "exponential" | "biexponential"
}

interface FoodItem {
  name: string
  carbsPer100g: number
  category: string
  commonServing?: string
  servingCarbs?: number
}

interface ExerciseActivity {
  name: string
  category: string
  metValue: number
  insulinReduction: number // percentage reduction per hour
}

const INSULIN_MEDICATIONS: InsulinMedication[] = [
  {
    name: "Humalog",
    brand: "Lispro",
    duration: 4,
    peakTime: "1-2 hours",
    description: "Fast-acting insulin, typically lasts 3-5 hours",
    curve: "biexponential",
  },
  {
    name: "Novolog",
    brand: "Aspart",
    duration: 4,
    peakTime: "1-3 hours",
    description: "Fast-acting insulin, typically lasts 3-5 hours",
    curve: "biexponential",
  },
  {
    name: "Apidra",
    brand: "Glulisine",
    duration: 4,
    peakTime: "1-2 hours",
    description: "Fast-acting insulin, typically lasts 3-4 hours",
    curve: "biexponential",
  },
  {
    name: "Fiasp",
    brand: "Faster Aspart",
    duration: 4,
    peakTime: "1-3 hours",
    description: "Ultra-fast acting insulin, typically lasts 3-5 hours",
    curve: "exponential",
  },
  {
    name: "Regular/Humulin R",
    brand: "Regular Human Insulin",
    duration: 6,
    peakTime: "2-4 hours",
    description: "Short-acting insulin, typically lasts 5-8 hours",
    curve: "linear",
  },
  {
    name: "Afrezza",
    brand: "Inhaled Insulin",
    duration: 3,
    peakTime: "15-60 minutes",
    description: "Ultra-rapid inhaled insulin, typically lasts 1.5-3 hours",
    curve: "exponential",
  },
  {
    name: "Other/Custom",
    brand: "Custom Duration",
    duration: 4,
    peakTime: "Varies",
    description: "Set custom duration for other insulin types",
    curve: "linear",
  },
]

const FOOD_DATABASE: FoodItem[] = [
  // === FRUITS ===
  { name: "Apple", carbsPer100g: 14, category: "Fruits", commonServing: "1 medium (182g)", servingCarbs: 25 },
  { name: "Banana", carbsPer100g: 23, category: "Fruits", commonServing: "1 medium (118g)", servingCarbs: 27 },
  { name: "Orange", carbsPer100g: 12, category: "Fruits", commonServing: "1 medium (154g)", servingCarbs: 18 },
  { name: "Grapes", carbsPer100g: 16, category: "Fruits", commonServing: "1 cup (151g)", servingCarbs: 24 },
  { name: "Strawberries", carbsPer100g: 8, category: "Fruits", commonServing: "1 cup (152g)", servingCarbs: 12 },
  { name: "Blueberries", carbsPer100g: 14, category: "Fruits", commonServing: "1 cup (148g)", servingCarbs: 21 },
  { name: "Pineapple", carbsPer100g: 13, category: "Fruits", commonServing: "1 cup chunks (165g)", servingCarbs: 21 },
  { name: "Mango", carbsPer100g: 15, category: "Fruits", commonServing: "1 cup sliced (165g)", servingCarbs: 25 },
  { name: "Watermelon", carbsPer100g: 8, category: "Fruits", commonServing: "1 cup cubed (152g)", servingCarbs: 12 },
  { name: "Peach", carbsPer100g: 10, category: "Fruits", commonServing: "1 medium (150g)", servingCarbs: 15 },

  // === GRAINS & STARCHES ===
  { name: "White Rice", carbsPer100g: 28, category: "Grains", commonServing: "1 cup cooked (158g)", servingCarbs: 44 },
  { name: "Brown Rice", carbsPer100g: 23, category: "Grains", commonServing: "1 cup cooked (195g)", servingCarbs: 45 },
  { name: "Pasta", carbsPer100g: 25, category: "Grains", commonServing: "1 cup cooked (140g)", servingCarbs: 35 },
  { name: "White Bread", carbsPer100g: 49, category: "Grains", commonServing: "1 slice (28g)", servingCarbs: 14 },
  { name: "Whole Wheat Bread", carbsPer100g: 41, category: "Grains", commonServing: "1 slice (28g)", servingCarbs: 12 },
  { name: "Bagel", carbsPer100g: 49, category: "Grains", commonServing: "1 medium (95g)", servingCarbs: 47 },
  { name: "Oatmeal", carbsPer100g: 12, category: "Grains", commonServing: "1 cup cooked (234g)", servingCarbs: 28 },
  { name: "Quinoa", carbsPer100g: 22, category: "Grains", commonServing: "1 cup cooked (185g)", servingCarbs: 41 },
  { name: "Cereal (General)", carbsPer100g: 76, category: "Grains", commonServing: "1 cup (30g)", servingCarbs: 23 },

  // === VEGETABLES ===
  { name: "Potato", carbsPer100g: 17, category: "Vegetables", commonServing: "1 medium (173g)", servingCarbs: 29 },
  {
    name: "Sweet Potato",
    carbsPer100g: 20,
    category: "Vegetables",
    commonServing: "1 medium (128g)",
    servingCarbs: 26,
  },
  { name: "Corn", carbsPer100g: 19, category: "Vegetables", commonServing: "1 cup (145g)", servingCarbs: 27 },
  { name: "Peas", carbsPer100g: 14, category: "Vegetables", commonServing: "1 cup (145g)", servingCarbs: 20 },
  {
    name: "Carrots",
    carbsPer100g: 10,
    category: "Vegetables",
    commonServing: "1 cup chopped (128g)",
    servingCarbs: 13,
  },
  { name: "Broccoli", carbsPer100g: 7, category: "Vegetables", commonServing: "1 cup chopped (91g)", servingCarbs: 6 },

  // === DAIRY ===
  { name: "Milk (2%)", carbsPer100g: 5, category: "Dairy", commonServing: "1 cup (244g)", servingCarbs: 12 },
  { name: "Yogurt (Plain)", carbsPer100g: 4, category: "Dairy", commonServing: "1 cup (245g)", servingCarbs: 10 },
  { name: "Greek Yogurt", carbsPer100g: 4, category: "Dairy", commonServing: "1 cup (245g)", servingCarbs: 10 },
  { name: "Ice Cream", carbsPer100g: 22, category: "Dairy", commonServing: "1/2 cup (66g)", servingCarbs: 15 },

  // === FAST FOOD - MCDONALD'S ===
  { name: "Big Mac", carbsPer100g: 19, category: "McDonald's", commonServing: "1 burger (230g)", servingCarbs: 44 },
  {
    name: "Quarter Pounder",
    carbsPer100g: 16,
    category: "McDonald's",
    commonServing: "1 burger (220g)",
    servingCarbs: 35,
  },
  { name: "McChicken", carbsPer100g: 21, category: "McDonald's", commonServing: "1 sandwich (143g)", servingCarbs: 30 },
  {
    name: "Chicken McNuggets",
    carbsPer100g: 13,
    category: "McDonald's",
    commonServing: "10 pieces (164g)",
    servingCarbs: 21,
  },
  {
    name: "French Fries (McDonald's)",
    carbsPer100g: 43,
    category: "McDonald's",
    commonServing: "Medium (115g)",
    servingCarbs: 49,
  },
  {
    name: "McFlurry Oreo",
    carbsPer100g: 31,
    category: "McDonald's",
    commonServing: "1 regular (348g)",
    servingCarbs: 108,
  },

  // === FAST FOOD - BURGER KING ===
  { name: "Whopper", carbsPer100g: 18, category: "Burger King", commonServing: "1 burger (290g)", servingCarbs: 52 },
  {
    name: "Chicken Royale",
    carbsPer100g: 20,
    category: "Burger King",
    commonServing: "1 sandwich (219g)",
    servingCarbs: 44,
  },
  {
    name: "French Fries (Burger King)",
    carbsPer100g: 41,
    category: "Burger King",
    commonServing: "Medium (116g)",
    servingCarbs: 48,
  },

  // === FAST FOOD - KFC ===
  {
    name: "Original Recipe Chicken",
    carbsPer100g: 8,
    category: "KFC",
    commonServing: "1 piece (85g)",
    servingCarbs: 7,
  },
  { name: "KFC Coleslaw", carbsPer100g: 14, category: "KFC", commonServing: "1 serving (130g)", servingCarbs: 18 },
  { name: "KFC Biscuit", carbsPer100g: 45, category: "KFC", commonServing: "1 biscuit (56g)", servingCarbs: 25 },

  // === FAST FOOD - SUBWAY ===
  {
    name: 'Subway 6" Turkey Breast',
    carbsPer100g: 19,
    category: "Subway",
    commonServing: "1 sandwich (238g)",
    servingCarbs: 45,
  },
  {
    name: 'Subway 6" Italian BMT',
    carbsPer100g: 20,
    category: "Subway",
    commonServing: "1 sandwich (236g)",
    servingCarbs: 47,
  },
  {
    name: "Subway Chocolate Chip Cookie",
    carbsPer100g: 67,
    category: "Subway",
    commonServing: "1 cookie (45g)",
    servingCarbs: 30,
  },

  // === FAST FOOD - TACO BELL ===
  { name: "Crunchy Taco", carbsPer100g: 25, category: "Taco Bell", commonServing: "1 taco (78g)", servingCarbs: 20 },
  {
    name: "Burrito Supreme",
    carbsPer100g: 18,
    category: "Taco Bell",
    commonServing: "1 burrito (248g)",
    servingCarbs: 45,
  },
  {
    name: "Quesadilla",
    carbsPer100g: 22,
    category: "Taco Bell",
    commonServing: "1 quesadilla (184g)",
    servingCarbs: 40,
  },

  // === PIZZA ===
  { name: "Pizza (Cheese)", carbsPer100g: 33, category: "Pizza", commonServing: "1 slice (107g)", servingCarbs: 35 },
  { name: "Pizza (Pepperoni)", carbsPer100g: 32, category: "Pizza", commonServing: "1 slice (108g)", servingCarbs: 35 },
  { name: "Pizza (Supreme)", carbsPer100g: 30, category: "Pizza", commonServing: "1 slice (123g)", servingCarbs: 37 },
  {
    name: "Domino's Medium Pizza",
    carbsPer100g: 31,
    category: "Pizza",
    commonServing: "1 slice (78g)",
    servingCarbs: 24,
  },
  {
    name: "Pizza Hut Personal Pan",
    carbsPer100g: 35,
    category: "Pizza",
    commonServing: "1 pizza (255g)",
    servingCarbs: 89,
  },

  // === CHINESE FOOD ===
  { name: "Fried Rice", carbsPer100g: 25, category: "Chinese", commonServing: "1 cup (166g)", servingCarbs: 42 },
  { name: "Lo Mein", carbsPer100g: 20, category: "Chinese", commonServing: "1 cup (200g)", servingCarbs: 40 },
  {
    name: "Sweet and Sour Chicken",
    carbsPer100g: 28,
    category: "Chinese",
    commonServing: "1 cup (217g)",
    servingCarbs: 61,
  },
  {
    name: "General Tso's Chicken",
    carbsPer100g: 25,
    category: "Chinese",
    commonServing: "1 cup (146g)",
    servingCarbs: 37,
  },
  { name: "Beef and Broccoli", carbsPer100g: 8, category: "Chinese", commonServing: "1 cup (217g)", servingCarbs: 17 },
  { name: "Egg Roll", carbsPer100g: 24, category: "Chinese", commonServing: "1 roll (64g)", servingCarbs: 15 },

  // === MEXICAN FOOD ===
  {
    name: "Burrito (Bean & Rice)",
    carbsPer100g: 20,
    category: "Mexican",
    commonServing: "1 burrito (217g)",
    servingCarbs: 43,
  },
  {
    name: "Quesadilla (Cheese)",
    carbsPer100g: 22,
    category: "Mexican",
    commonServing: "1 quesadilla (142g)",
    servingCarbs: 31,
  },
  {
    name: "Tacos (Soft Shell)",
    carbsPer100g: 18,
    category: "Mexican",
    commonServing: "2 tacos (186g)",
    servingCarbs: 33,
  },
  {
    name: "Nachos with Cheese",
    carbsPer100g: 36,
    category: "Mexican",
    commonServing: "1 serving (113g)",
    servingCarbs: 41,
  },
  { name: "Spanish Rice", carbsPer100g: 23, category: "Mexican", commonServing: "1 cup (158g)", servingCarbs: 36 },
  { name: "Refried Beans", carbsPer100g: 15, category: "Mexican", commonServing: "1/2 cup (120g)", servingCarbs: 18 },

  // === ITALIAN FOOD ===
  {
    name: "Spaghetti with Marinara",
    carbsPer100g: 25,
    category: "Italian",
    commonServing: "1 cup (140g)",
    servingCarbs: 35,
  },
  {
    name: "Fettuccine Alfredo",
    carbsPer100g: 19,
    category: "Italian",
    commonServing: "1 cup (162g)",
    servingCarbs: 31,
  },
  { name: "Lasagna", carbsPer100g: 13, category: "Italian", commonServing: "1 piece (215g)", servingCarbs: 28 },
  { name: "Garlic Bread", carbsPer100g: 48, category: "Italian", commonServing: "1 slice (28g)", servingCarbs: 13 },
  { name: "Caesar Salad", carbsPer100g: 5, category: "Italian", commonServing: "1 cup (94g)", servingCarbs: 5 },

  // === INDIAN FOOD ===
  {
    name: "Basmati Rice",
    carbsPer100g: 25,
    category: "Indian",
    commonServing: "1 cup cooked (163g)",
    servingCarbs: 41,
  },
  { name: "Naan Bread", carbsPer100g: 45, category: "Indian", commonServing: "1 piece (90g)", servingCarbs: 41 },
  { name: "Chicken Curry", carbsPer100g: 6, category: "Indian", commonServing: "1 cup (236g)", servingCarbs: 14 },
  { name: "Dal (Lentil Curry)", carbsPer100g: 20, category: "Indian", commonServing: "1 cup (198g)", servingCarbs: 40 },
  { name: "Samosa", carbsPer100g: 28, category: "Indian", commonServing: "1 piece (85g)", servingCarbs: 24 },

  // === JAPANESE FOOD ===
  {
    name: "Sushi Roll (California)",
    carbsPer100g: 24,
    category: "Japanese",
    commonServing: "6 pieces (156g)",
    servingCarbs: 37,
  },
  {
    name: "Sushi Roll (Spicy Tuna)",
    carbsPer100g: 23,
    category: "Japanese",
    commonServing: "6 pieces (156g)",
    servingCarbs: 36,
  },
  { name: "Teriyaki Chicken", carbsPer100g: 12, category: "Japanese", commonServing: "1 cup (132g)", servingCarbs: 16 },
  { name: "Miso Soup", carbsPer100g: 4, category: "Japanese", commonServing: "1 cup (240g)", servingCarbs: 10 },
  { name: "Tempura", carbsPer100g: 18, category: "Japanese", commonServing: "3 pieces (75g)", servingCarbs: 14 },

  // === BREAKFAST ITEMS ===
  { name: "Pancakes", carbsPer100g: 34, category: "Breakfast", commonServing: "2 pancakes (152g)", servingCarbs: 52 },
  { name: "Waffles", carbsPer100g: 33, category: "Breakfast", commonServing: "1 waffle (75g)", servingCarbs: 25 },
  { name: "French Toast", carbsPer100g: 24, category: "Breakfast", commonServing: "1 slice (65g)", servingCarbs: 16 },
  {
    name: "Breakfast Burrito",
    carbsPer100g: 18,
    category: "Breakfast",
    commonServing: "1 burrito (220g)",
    servingCarbs: 40,
  },
  { name: "Hash Browns", carbsPer100g: 35, category: "Breakfast", commonServing: "1 cup (156g)", servingCarbs: 55 },
  {
    name: "Muffin (Blueberry)",
    carbsPer100g: 51,
    category: "Breakfast",
    commonServing: "1 muffin (113g)",
    servingCarbs: 58,
  },

  // === BEVERAGES ===
  { name: "Orange Juice", carbsPer100g: 10, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 25 },
  { name: "Apple Juice", carbsPer100g: 11, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 27 },
  { name: "Cranberry Juice", carbsPer100g: 12, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 30 },
  { name: "Grape Juice", carbsPer100g: 14, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 35 },

  // Regular Sodas
  { name: "Coca-Cola", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 39 },
  { name: "Pepsi", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 41 },
  { name: "Sprite", carbsPer100g: 10, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 38 },
  { name: "7-Up", carbsPer100g: 10, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 38 },
  {
    name: "Mountain Dew",
    carbsPer100g: 12,
    category: "Beverages",
    commonServing: "12 oz can (355ml)",
    servingCarbs: 46,
  },
  { name: "Dr Pepper", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 40 },
  { name: "Root Beer", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 39 },
  {
    name: "Orange Soda",
    carbsPer100g: 12,
    category: "Beverages",
    commonServing: "12 oz can (355ml)",
    servingCarbs: 44,
  },
  { name: "Ginger Ale", carbsPer100g: 9, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 32 },
  {
    name: "Lemon-Lime Soda",
    carbsPer100g: 10,
    category: "Beverages",
    commonServing: "12 oz can (355ml)",
    servingCarbs: 38,
  },

  // Diet Sodas
  { name: "Diet Coke", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Diet Pepsi", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Diet Sprite", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Coke Zero", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },

  // Other Popular Beverages
  {
    name: "Sports Drink (Gatorade)",
    carbsPer100g: 6,
    category: "Beverages",
    commonServing: "20 oz bottle (591ml)",
    servingCarbs: 35,
  },
  { name: "Powerade", carbsPer100g: 6, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 34 },
  { name: "Red Bull", carbsPer100g: 11, category: "Beverages", commonServing: "8.4 oz can (248ml)", servingCarbs: 27 },
  {
    name: "Monster Energy",
    carbsPer100g: 11,
    category: "Beverages",
    commonServing: "16 oz can (473ml)",
    servingCarbs: 54,
  },
  {
    name: "Rockstar Energy",
    carbsPer100g: 12,
    category: "Beverages",
    commonServing: "16 oz can (473ml)",
    servingCarbs: 60,
  },
  {
    name: "Vitamin Water",
    carbsPer100g: 6,
    category: "Beverages",
    commonServing: "20 oz bottle (591ml)",
    servingCarbs: 33,
  },

  // === DESSERTS ===
  { name: "Chocolate Cake", carbsPer100g: 50, category: "Desserts", commonServing: "1 slice (64g)", servingCarbs: 32 },
  { name: "Cheesecake", carbsPer100g: 32, category: "Desserts", commonServing: "1 slice (80g)", servingCarbs: 26 },
  { name: "Apple Pie", carbsPer100g: 34, category: "Desserts", commonServing: "1 slice (125g)", servingCarbs: 43 },
  {
    name: "Chocolate Chip Cookies",
    carbsPer100g: 68,
    category: "Desserts",
    commonServing: "2 cookies (30g)",
    servingCarbs: 20,
  },
  { name: "Brownies", carbsPer100g: 63, category: "Desserts", commonServing: "1 brownie (24g)", servingCarbs: 15 },
  { name: "Donut (Glazed)", carbsPer100g: 51, category: "Desserts", commonServing: "1 donut (52g)", servingCarbs: 27 },

  // === SNACKS ===
  { name: "Potato Chips", carbsPer100g: 50, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 14 },
  { name: "Pretzels", carbsPer100g: 72, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 20 },
  {
    name: "Crackers (Saltine)",
    carbsPer100g: 74,
    category: "Snacks",
    commonServing: "5 crackers (16g)",
    servingCarbs: 12,
  },
  { name: "Granola Bar", carbsPer100g: 65, category: "Snacks", commonServing: "1 bar (28g)", servingCarbs: 18 },
  { name: "Trail Mix", carbsPer100g: 44, category: "Snacks", commonServing: "1/4 cup (38g)", servingCarbs: 17 },
  { name: "Popcorn", carbsPer100g: 78, category: "Snacks", commonServing: "3 cups popped (24g)", servingCarbs: 19 },

  // === ALCOHOLIC BEVERAGES ===
  {
    name: "Beer (Regular)",
    carbsPer100g: 4,
    category: "Alcohol",
    commonServing: "12 oz bottle (355ml)",
    servingCarbs: 13,
  },
  {
    name: "Beer (Light)",
    carbsPer100g: 3,
    category: "Alcohol",
    commonServing: "12 oz bottle (355ml)",
    servingCarbs: 5,
  },
  { name: "Beer (IPA)", carbsPer100g: 5, category: "Alcohol", commonServing: "12 oz bottle (355ml)", servingCarbs: 15 },
  { name: "Wine (Red)", carbsPer100g: 3, category: "Alcohol", commonServing: "5 oz glass (148ml)", servingCarbs: 4 },
  { name: "Wine (White)", carbsPer100g: 3, category: "Alcohol", commonServing: "5 oz glass (148ml)", servingCarbs: 4 },
  { name: "Champagne", carbsPer100g: 2, category: "Alcohol", commonServing: "5 oz glass (148ml)", servingCarbs: 3 },
  { name: "Vodka", carbsPer100g: 0, category: "Alcohol", commonServing: "1.5 oz shot (44ml)", servingCarbs: 0 },
  { name: "Whiskey", carbsPer100g: 0, category: "Alcohol", commonServing: "1.5 oz shot (44ml)", servingCarbs: 0 },
  { name: "Rum", carbsPer100g: 0, category: "Alcohol", commonServing: "1.5 oz shot (44ml)", servingCarbs: 0 },
  { name: "Gin", carbsPer100g: 0, category: "Alcohol", commonServing: "1.5 oz shot (44ml)", servingCarbs: 0 },
  { name: "Margarita", carbsPer100g: 11, category: "Alcohol", commonServing: "8 oz (237ml)", servingCarbs: 26 },
  { name: "Piña Colada", carbsPer100g: 22, category: "Alcohol", commonServing: "8 oz (237ml)", servingCarbs: 52 },
  { name: "Daiquiri", carbsPer100g: 15, category: "Alcohol", commonServing: "6 oz (177ml)", servingCarbs: 27 },
  { name: "Mojito", carbsPer100g: 8, category: "Alcohol", commonServing: "8 oz (237ml)", servingCarbs: 19 },
  {
    name: "Long Island Iced Tea",
    carbsPer100g: 12,
    category: "Alcohol",
    commonServing: "8 oz (237ml)",
    servingCarbs: 28,
  },
  { name: "Bloody Mary", carbsPer100g: 4, category: "Alcohol", commonServing: "8 oz (237ml)", servingCarbs: 10 },

  // === NON-ALCOHOLIC BEVERAGES ===
  {
    name: "Coffee (Black)",
    carbsPer100g: 0,
    category: "Beverages",
    commonServing: "8 oz cup (237ml)",
    servingCarbs: 0,
  },
  {
    name: "Coffee with Sugar",
    carbsPer100g: 2,
    category: "Beverages",
    commonServing: "8 oz cup (237ml)",
    servingCarbs: 5,
  },
  { name: "Latte", carbsPer100g: 4, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 14 },
  { name: "Cappuccino", carbsPer100g: 4, category: "Beverages", commonServing: "8 oz (237ml)", servingCarbs: 9 },
  { name: "Frappuccino", carbsPer100g: 15, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 71 },
  { name: "Hot Chocolate", carbsPer100g: 8, category: "Beverages", commonServing: "8 oz (237ml)", servingCarbs: 19 },
  { name: "Tea (Plain)", carbsPer100g: 0, category: "Beverages", commonServing: "8 oz cup (237ml)", servingCarbs: 0 },
  { name: "Sweet Tea", carbsPer100g: 7, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 25 },
  { name: "Bubble Tea", carbsPer100g: 9, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 43 },
  {
    name: "Smoothie (Fruit)",
    carbsPer100g: 13,
    category: "Beverages",
    commonServing: "16 oz (473ml)",
    servingCarbs: 62,
  },
  { name: "Protein Shake", carbsPer100g: 4, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 14 },
  { name: "Kombucha", carbsPer100g: 3, category: "Beverages", commonServing: "12 oz bottle (355ml)", servingCarbs: 11 },
  { name: "Coconut Water", carbsPer100g: 4, category: "Beverages", commonServing: "11 oz (325ml)", servingCarbs: 13 },
  { name: "Lemonade", carbsPer100g: 10, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 35 },
  {
    name: "Iced Tea (Sweetened)",
    carbsPer100g: 8,
    category: "Beverages",
    commonServing: "12 oz (355ml)",
    servingCarbs: 28,
  },
]

const EXERCISE_ACTIVITIES: ExerciseActivity[] = [
  { name: "Walking", category: "Light", metValue: 3.5, insulinReduction: 10 },
  { name: "Jogging", category: "Moderate", metValue: 7, insulinReduction: 20 },
  { name: "Running", category: "Vigorous", metValue: 11, insulinReduction: 30 },
  { name: "Cycling", category: "Moderate", metValue: 8, insulinReduction: 25 },
  { name: "Swimming", category: "Vigorous", metValue: 10, insulinReduction: 35 },
  { name: "Weight Training", category: "Moderate", metValue: 6, insulinReduction: 15 },
  { name: "Yoga", category: "Light", metValue: 2.5, insulinReduction: 5 },
]

// Add this array of motivational quotes after the EXERCISE_ACTIVITIES array and before the interface definitions

const MOTIVATIONAL_QUOTES = [
  "Diabetes is not a limitation, it's a reminder of how strong you are every single day.",
  "Every blood sugar check is a step toward better health and a brighter tomorrow.",
  "You don't just manage diabetes - you master it with courage and determination.",
  "Your strength isn't measured by your blood sugar numbers, but by your resilience in managing them.",
  "Diabetes taught you to be your own hero - and heroes never give up.",
  "Each day you choose to take care of yourself is a victory worth celebrating.",
  "You are more powerful than any diagnosis - diabetes doesn't define you, your spirit does.",
  "Managing diabetes isn't just about survival, it's about thriving and inspiring others.",
  "Your daily choices in diabetes care are investments in a healthier, happier future.",
  "Diabetes may be part of your story, but it will never be the end of your story.",
  "You've turned a medical condition into a masterclass in self-care and discipline.",
  "Every insulin dose is a declaration that you choose health, hope, and happiness.",
  "Diabetes warriors don't just count carbs - they make every moment count.",
  "Your blood glucose meter doesn't measure your worth - your determination does.",
  "Living well with diabetes isn't luck, it's the result of your daily commitment to yourself.",
]

interface UserSettings {
  darkMode: boolean
  glucoseUnit: GlucoseUnit
  selectedInsulin: string
  customInsulinDuration: number
  presets: {
    [key in TimePreset]: {
      startingUnits: string
      bloodSugarGoal: string
      ratio: string
      carbRatio: string
    }
  }
  insulinDurationHours: number
  maxDoseWarning: number
  showSplash: boolean
}

interface CalculationResult {
  timestamp: number
  startingUnits: number
  testingBloodSugar: number
  bloodSugarGoal: number
  ratio: number
  additionalUnits: number
  carbGrams?: number
  carbRatio?: number
  carbUnits?: number
  finalUnits: number
  calculation: string
  glucoseUnit: GlucoseUnit
  preset: TimePreset
  exerciseAdjustment?: number
  stressAdjustment?: number
  adjustmentFactors?: string[]
}

interface InsulinDose {
  timestamp: number
  units: number
  remainingPercentage: number
  insulinType: string
}

// Default settings
const defaultSettings: UserSettings = {
  darkMode: false,
  glucoseUnit: "mg/dL",
  selectedInsulin: "Humalog",
  customInsulinDuration: 4,
  presets: {
    breakfast: { startingUnits: "4", bloodSugarGoal: "120", ratio: "20", carbRatio: "15" },
    lunch: { startingUnits: "4", bloodSugarGoal: "120", ratio: "20", carbRatio: "15" },
    dinner: { startingUnits: "4", bloodSugarGoal: "120", ratio: "20", carbRatio: "15" },
    bedtime: { startingUnits: "3", bloodSugarGoal: "140", ratio: "30", carbRatio: "20" },
    custom: { startingUnits: "", bloodSugarGoal: "", ratio: "", carbRatio: "" },
  },
  insulinDurationHours: 4,
  maxDoseWarning: 15,
  showSplash: true,
}

// Utility functions
const convertMgdlToMmol = (mgdl: number): number => {
  return Number.parseFloat((mgdl / 18).toFixed(1))
}

const convertMmolToMgdl = (mmol: number): number => {
  return Math.round(mmol * 18)
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// Advanced IOB calculation with different curves
const calculateAdvancedIOB = (doses: InsulinDose[], durationHours: number, insulinType: string): number => {
  const now = Date.now()
  const durationMs = durationHours * 60 * 60 * 1000
  const medication = INSULIN_MEDICATIONS.find((med) => med.name === insulinType)

  return doses.reduce((total, dose) => {
    const elapsed = now - dose.timestamp
    if (elapsed < durationMs) {
      let remainingPercentage = 0
      const elapsedHours = elapsed / (60 * 60 * 1000)

      switch (medication?.curve || "linear") {
        case "exponential":
          // Exponential decay for ultra-rapid insulins
          remainingPercentage = Math.exp(-elapsedHours / (durationHours * 0.4))
          break
        case "biexponential":
          // Biexponential for most rapid-acting insulins
          const alpha = 0.8
          const beta = 0.2
          const k1 = 2 / durationHours
          const k2 = 0.5 / durationHours
          remainingPercentage = alpha * Math.exp(-k1 * elapsedHours) + beta * Math.exp(-k2 * elapsedHours)
          break
        default:
          // Linear decay (fallback)
          remainingPercentage = Math.max(0, 1 - elapsed / durationMs)
      }

      return total + dose.units * Math.max(0, remainingPercentage)
    }
    return total
  }, 0)
}

export default function InsulinCalculator() {
  // State
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("calculator")
  const [activePreset, setActivePreset] = useState<TimePreset>("custom")
  const [startingUnits, setStartingUnits] = useState("")
  const [testingBloodSugar, setTestingBloodSugar] = useState("")
  const [bloodSugarGoal, setBloodSugarGoal] = useState("")
  const [ratio, setRatio] = useState("")
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [history, setHistory] = useState<CalculationResult[]>([])
  const [insulinDoses, setInsulinDoses] = useState<InsulinDose[]>([])
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [carbGrams, setCarbGrams] = useState("")
  const [carbRatio, setCarbRatio] = useState("")
  const [showCarbCalculator, setShowCarbCalculator] = useState(false)
  const [selectedInsulin, setSelectedInsulin] = useState<string>("Humalog")
  const [selectedFoods, setSelectedFoods] = useState<Array<{ food: FoodItem; quantity: number }>>([])
  const [totalMealCarbs, setTotalMealCarbs] = useState<number>(0)

  // Add state for the current quote after the other state declarations (around line 800)
  const [currentQuote, setCurrentQuote] = useState(0)

  // Advanced Features State
  const [exerciseDuration, setExerciseDuration] = useState<number>(0)
  const [exerciseType, setExerciseType] = useState<string>("Walking")
  const [stressLevel, setStressLevel] = useState<string>("none")
  const [isIll, setIsIll] = useState<boolean>(false)
  const [menstrualCyclePhase, setMenstrualCyclePhase] = useState<string>("none")
  const [sleepQuality, setSleepQuality] = useState<string>("good")
  const [foodSearch, setFoodSearch] = useState<string>("")
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [foodQuantity, setFoodQuantity] = useState<number>(100)

  // Emergency Protocols State
  const [showEmergencyProtocols, setShowEmergencyProtocols] = useState(false)

  const handleInsulinChange = (insulinName: string) => {
    const selectedMed = INSULIN_MEDICATIONS.find((med) => med.name === insulinName)
    if (selectedMed) {
      setSettings({
        ...settings,
        selectedInsulin: insulinName,
        insulinDurationHours: selectedMed.duration,
      })
      setSelectedInsulin(insulinName)
    }
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("diabeticCalculatorSettings")
    const savedHistory = localStorage.getItem("diabeticCalculatorHistory")
    const savedDoses = localStorage.getItem("diabeticCalculatorDoses")

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      setShowSplash(parsed.showSplash !== false) // Show splash by default
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }

    if (savedDoses) {
      setInsulinDoses(JSON.parse(savedDoses))
    }

    // Apply dark mode if saved
    if (savedSettings && JSON.parse(savedSettings).darkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("diabeticCalculatorSettings", JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem("diabeticCalculatorHistory", JSON.stringify(history))
  }, [history])

  useEffect(() => {
    localStorage.setItem("diabeticCalculatorDoses", JSON.stringify(insulinDoses))
  }, [insulinDoses])

  // Add useEffect for rotating quotes after the existing useEffects (around line 900)
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)
    }, 8000) // Change quote every 8 seconds

    return () => clearInterval(quoteInterval)
  }, [])

  // Load preset values when preset changes
  useEffect(() => {
    if (activePreset !== "custom") {
      const preset = settings.presets[activePreset]
      setStartingUnits(preset.startingUnits)
      setBloodSugarGoal(preset.bloodSugarGoal)
      setRatio(preset.ratio)
      setCarbRatio(preset.carbRatio)
    }
  }, [activePreset, settings.presets])

  // Calculate current IOB with advanced curves
  const currentIOB = calculateAdvancedIOB(insulinDoses, settings.insulinDurationHours, settings.selectedInsulin)

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false)
    setSettings({ ...settings, showSplash: false })
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !settings.darkMode
    setSettings({ ...settings, darkMode: newDarkMode })

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Toggle glucose unit
  const toggleGlucoseUnit = (unit: GlucoseUnit) => {
    setSettings({ ...settings, glucoseUnit: unit })

    // Convert current values if needed
    if (testingBloodSugar && unit !== settings.glucoseUnit) {
      const currentValue = Number.parseFloat(testingBloodSugar)
      if (!isNaN(currentValue)) {
        if (unit === "mmol/L" && settings.glucoseUnit === "mg/dL") {
          setTestingBloodSugar(convertMgdlToMmol(currentValue).toString())
        } else if (unit === "mg/dL" && settings.glucoseUnit === "mmol/L") {
          setTestingBloodSugar(convertMmolToMgdl(currentValue).toString())
        }
      }
    }

    if (bloodSugarGoal && unit !== settings.glucoseUnit) {
      const currentValue = Number.parseFloat(bloodSugarGoal)
      if (!isNaN(currentValue)) {
        if (unit === "mmol/L" && settings.glucoseUnit === "mg/dL") {
          setBloodSugarGoal(convertMgdlToMmol(currentValue).toString())
        } else if (unit === "mg/dL" && settings.glucoseUnit === "mmol/L") {
          setBloodSugarGoal(convertMmolToMgdl(currentValue).toString())
        }
      }
    }
  }

  // Save current preset
  const savePreset = () => {
    if (activePreset !== "custom") {
      const updatedPresets = {
        ...settings.presets,
        [activePreset]: {
          startingUnits,
          bloodSugarGoal,
          ratio,
          carbRatio,
        },
      }
      setSettings({ ...settings, presets: updatedPresets })
    }
  }

  // Filter foods based on search
  const filteredFoods = FOOD_DATABASE.filter(
    (food) =>
      food.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
      food.category.toLowerCase().includes(foodSearch.toLowerCase()),
  )

  // Calculate exercise adjustment
  const calculateExerciseAdjustment = (): number => {
    if (exerciseDuration === 0) return 0

    const activity = EXERCISE_ACTIVITIES.find((act) => act.name === exerciseType)
    if (!activity) return 0

    const hours = exerciseDuration / 60
    return (activity.insulinReduction * hours) / 100
  }

  // Calculate total carbs from selected foods
  const calculateTotalMealCarbs = () => {
    const total = selectedFoods.reduce((sum, item) => {
      return sum + (item.food.carbsPer100g * item.quantity) / 100
    }, 0)
    setTotalMealCarbs(total)
    return total
  }

  // Add food to meal
  const addFoodToMeal = (food: FoodItem, quantity: number) => {
    const existingIndex = selectedFoods.findIndex((item) => item.food.name === food.name)
    if (existingIndex >= 0) {
      // Update existing food quantity
      const updatedFoods = [...selectedFoods]
      updatedFoods[existingIndex].quantity = quantity
      setSelectedFoods(updatedFoods)
    } else {
      // Add new food
      setSelectedFoods([...selectedFoods, { food, quantity }])
    }
  }

  // Remove food from meal
  const removeFoodFromMeal = (foodName: string) => {
    setSelectedFoods(selectedFoods.filter((item) => item.food.name !== foodName))
  }

  // Clear all foods from meal
  const clearMeal = () => {
    setSelectedFoods([])
    setTotalMealCarbs(0)
  }

  // Calculate insulin dose with advanced features
  const calculateInsulin = () => {
    const starting = Number.parseFloat(startingUnits)
    const testing = Number.parseFloat(testingBloodSugar)
    const goal = Number.parseFloat(bloodSugarGoal)
    const ratioValue = Number.parseFloat(ratio)
    const carbs = showCarbCalculator ? Number.parseFloat(carbGrams) : 0
    const carbRatioValue = showCarbCalculator ? Number.parseFloat(carbRatio) : 0

    if (isNaN(starting) || isNaN(testing) || isNaN(goal) || isNaN(ratioValue)) {
      alert("Please enter valid numbers for all required fields")
      return
    }

    if (showCarbCalculator && (isNaN(carbs) || isNaN(carbRatioValue))) {
      alert("Please enter valid numbers for carb calculation fields")
      return
    }

    if (ratioValue <= 0 || (showCarbCalculator && carbRatioValue <= 0)) {
      alert("Ratios must be greater than 0")
      return
    }

    const bloodSugarDifference = testing - goal
    const correctionUnits = bloodSugarDifference / ratioValue
    const carbUnits = showCarbCalculator ? carbs / carbRatioValue : 0
    const totalAdditionalUnits = correctionUnits + carbUnits
    let finalUnits = starting + totalAdditionalUnits

    // Apply advanced adjustments
    let adjustmentFactor = 1
    const adjustmentFactors: string[] = []

    // Exercise Adjustment
    const exerciseReduction = calculateExerciseAdjustment()
    if (exerciseReduction > 0) {
      adjustmentFactor -= exerciseReduction
      adjustmentFactors.push(`Exercise: -${(exerciseReduction * 100).toFixed(0)}%`)
    }

    // Stress/Illness Adjustment
    if (stressLevel !== "none" || isIll) {
      const stressIncrease = stressLevel === "high" ? 0.2 : stressLevel === "moderate" ? 0.15 : 0.1
      const illnessIncrease = isIll ? 0.15 : 0
      const totalIncrease = stressIncrease + illnessIncrease
      adjustmentFactor += totalIncrease
      if (stressLevel !== "none") adjustmentFactors.push(`Stress: +${(stressIncrease * 100).toFixed(0)}%`)
      if (isIll) adjustmentFactors.push(`Illness: +${(illnessIncrease * 100).toFixed(0)}%`)
    }

    // Menstrual Cycle Adjustment
    if (menstrualCyclePhase === "luteal") {
      adjustmentFactor += 0.1
      adjustmentFactors.push("Luteal phase: +10%")
    }

    // Sleep Quality Adjustment
    if (sleepQuality === "poor") {
      adjustmentFactor += 0.05
      adjustmentFactors.push("Poor sleep: +5%")
    }

    finalUnits *= adjustmentFactor

    // Maximum dose warning check
    if (finalUnits > settings.maxDoseWarning) {
      const proceed = confirm(
        `Warning: The calculated dose (${finalUnits.toFixed(1)} units) exceeds your maximum dose warning threshold (${settings.maxDoseWarning} units). This is significantly higher than usual. Please verify your inputs and consult your healthcare provider if needed. Do you want to proceed?`,
      )
      if (!proceed) {
        return
      }
    }

    let calculationText = `Correction: (${testing} - ${goal}) ÷ ${ratioValue} = ${correctionUnits.toFixed(1)} units`
    if (showCarbCalculator && carbs > 0) {
      calculationText += `\nCarbs: ${carbs}g ÷ ${carbRatioValue} = ${carbUnits.toFixed(1)} units`
      calculationText += `\nTotal additional: ${correctionUnits.toFixed(1)} + ${carbUnits.toFixed(1)} = ${totalAdditionalUnits.toFixed(1)} units`
    }

    if (adjustmentFactors.length > 0) {
      calculationText += `\nAdjustments: ${adjustmentFactors.join(", ")}`
      calculationText += `\nAdjustment factor: ${adjustmentFactor.toFixed(2)}`
    }

    const calculationResult: CalculationResult = {
      timestamp: Date.now(),
      startingUnits: starting,
      testingBloodSugar: testing,
      bloodSugarGoal: goal,
      ratio: ratioValue,
      additionalUnits: Math.round(totalAdditionalUnits * 10) / 10,
      carbGrams: showCarbCalculator ? carbs : undefined,
      carbRatio: showCarbCalculator ? carbRatioValue : undefined,
      carbUnits: showCarbCalculator ? Math.round(carbUnits * 10) / 10 : undefined,
      finalUnits: Math.round(finalUnits * 10) / 10,
      calculation: calculationText,
      glucoseUnit: settings.glucoseUnit,
      preset: activePreset,
      exerciseAdjustment: exerciseReduction > 0 ? exerciseReduction : undefined,
      stressAdjustment: adjustmentFactor > 1 ? adjustmentFactor - 1 : undefined,
      adjustmentFactors: adjustmentFactors.length > 0 ? adjustmentFactors : undefined,
    }

    setResult(calculationResult)
    setHistory([calculationResult, ...history])
  }

  // Record insulin dose
  const recordDose = () => {
    if (result) {
      const newDose: InsulinDose = {
        timestamp: Date.now(),
        units: result.finalUnits,
        remainingPercentage: 1.0,
        insulinType: settings.selectedInsulin,
      }

      setInsulinDoses([newDose, ...insulinDoses])
      alert("Dose recorded successfully!")
    }
  }

  // Clear expired insulin doses
  const clearExpiredDoses = () => {
    const now = Date.now()
    const durationMs = settings.insulinDurationHours * 60 * 60 * 1000

    const activeDoses = insulinDoses.filter((dose) => {
      return now - dose.timestamp < durationMs
    })

    setInsulinDoses(activeDoses)
  }

  // Reset calculator
  const reset = () => {
    if (activePreset === "custom") {
      setStartingUnits("")
      setTestingBloodSugar("")
      setBloodSugarGoal("")
      setRatio("")
      setCarbGrams("")
      setCarbRatio("")
    } else {
      // Just clear the testing blood sugar and carbs for presets
      setTestingBloodSugar("")
      setCarbGrams("")
    }
    setResult(null)

    // Reset advanced factors
    setExerciseDuration(0)
    setExerciseType("Walking")
    setStressLevel("none")
    setIsIll(false)
    setMenstrualCyclePhase("none")
    setSleepQuality("good")
  }

  // Clear history
  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all calculation history?")) {
      setHistory([])
    }
  }

  // Calculate total meal carbs whenever selectedFoods changes
  useEffect(() => {
    calculateTotalMealCarbs()
  }, [selectedFoods])

  // Show splash screen if needed
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div
      className={`min-h-screen p-4 ${settings.darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calculator className={`h-8 w-8 ${settings.darkMode ? "text-blue-400" : "text-blue-600"}`} />
            <h1 className={`text-2xl sm:text-3xl font-bold ${settings.darkMode ? "text-white" : "text-gray-900"}`}>
              Diabetic Coverage Calculator
            </h1>
          </div>
          <div className="flex gap-2 items-center self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/instructions", "_blank")}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Info className="h-4 w-4 mr-2" />
              Instructions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmergencyProtocols(!showEmergencyProtocols)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Zap className="h-4 w-4 mr-2" />
              Emergency
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {settings.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Emergency Protocols */}
        {showEmergencyProtocols && (
          <Alert className="border-red-200 bg-red-50">
            <Zap className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="space-y-2">
                <h3 className="font-semibold text-red-800">Emergency Protocols</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-red-700">Hypoglycemia (&lt;70 mg/dL)</h4>
                    <ul className="list-disc list-inside text-red-600">
                      <li>15g fast-acting carbs</li>
                      <li>Wait 15 minutes, recheck</li>
                      <li>Repeat if still low</li>
                      <li>Call 911 if unconscious</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700">Hyperglycemia (&gt;250 mg/dL)</h4>
                    <ul className="list-disc list-inside text-red-600">
                      <li>Check ketones</li>
                      <li>Drink water</li>
                      <li>Contact healthcare provider</li>
                      <li>Seek immediate care if ketones present</li>
                    </ul>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Alert
          className={`${settings.darkMode ? "border-amber-800 bg-amber-950 text-amber-200" : "border-amber-200 bg-amber-50"}`}
        >
          <AlertTriangle className={`h-4 w-4 ${settings.darkMode ? "text-amber-400" : "text-amber-600"}`} />
          <AlertDescription className={settings.darkMode ? "text-amber-200" : "text-amber-800"}>
            <strong>Medical Disclaimer:</strong> This calculator is for educational purposes only. Always consult with
            your healthcare provider before making insulin dosage decisions.
          </AlertDescription>
        </Alert>

        {/* Add the motivational quote section right after the medical disclaimer Alert and before the Tabs component (around line 1800) */}

        {/* Motivational Quote */}
        <Alert
          className={`${settings.darkMode ? "border-blue-800 bg-blue-950 text-blue-200" : "border-blue-200 bg-blue-50"} transition-all duration-500`}
        >
          <Heart className={`h-4 w-4 ${settings.darkMode ? "text-blue-400" : "text-blue-600"}`} />
          <AlertDescription
            className={`${settings.darkMode ? "text-blue-200" : "text-blue-800"} text-center font-medium italic`}
          >
            "{MOTIVATIONAL_QUOTES[currentQuote]}"
          </AlertDescription>
        </Alert>

        <div className="relative">
          <div className="overflow-x-auto pb-2">
            <Tabs defaultValue="calculator" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="inline-flex whitespace-nowrap">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="food-database">Food DB</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="calculator">
                <Card className={settings.darkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Insulin Calculator</CardTitle>
                        <CardDescription className={settings.darkMode ? "text-gray-400" : ""}>
                          Calculate your insulin dose based on blood sugar readings
                        </CardDescription>
                      </div>

                      <Select value={activePreset} onValueChange={(value) => setActivePreset(value as TimePreset)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select preset" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom">Custom</SelectItem>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="bedtime">Bedtime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {activePreset !== "custom" && (
                      <div className="flex justify-between items-center">
                        <p className={`text-sm ${settings.darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Using {activePreset} preset
                        </p>
                        <Button variant="outline" size="sm" onClick={savePreset}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes to Preset
                        </Button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="starting-units">Starting Coverage Units</Label>
                        <Input
                          id="starting-units"
                          type="number"
                          step="0.5"
                          placeholder="e.g., 4"
                          value={asString(startingUnits)}
                          onChange={(e) => setStartingUnits(e.target.value)}
                          className={settings.darkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="testing-blood-sugar">Testing Blood Sugar ({settings.glucoseUnit})</Label>
                        <Input
                          id="testing-blood-sugar"
                          type="number"
                          placeholder={settings.glucoseUnit === "mg/dL" ? "e.g., 180" : "e.g., 10.0"}
                          value={asString(testingBloodSugar)}
                          onChange={(e) => setTestingBloodSugar(e.target.value)}
                          className={settings.darkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="blood-sugar-goal">Blood Sugar Goal ({settings.glucoseUnit})</Label>
                        <Input
                          id="blood-sugar-goal"
                          type="number"
                          placeholder={settings.glucoseUnit === "mg/dL" ? "e.g., 120" : "e.g., 6.7"}
                          value={asString(bloodSugarGoal)}
                          onChange={(e) => setBloodSugarGoal(e.target.value)}
                          className={settings.darkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ratio">Doctor's Ratio (1 unit per X {settings.glucoseUnit})</Label>
                        <Input
                          id="ratio"
                          type="number"
                          placeholder="e.g., 20 (for 1:20 ratio)"
                          value={asString(ratio)}
                          onChange={(e) => setRatio(e.target.value)}
                          className={settings.darkMode ? "bg-gray-700 border-gray-600" : ""}
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <div className="flex items-center space-x-2 mb-4">
                        <Switch
                          id="carb-calculator"
                          checked={showCarbCalculator}
                          onCheckedChange={setShowCarbCalculator}
                        />
                        <Label htmlFor="carb-calculator">Include Carbohydrate Coverage</Label>
                      </div>

                      {showCarbCalculator && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg border bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
                          <div className="space-y-2">
                            <Label htmlFor="carb-grams">Carbohydrates (grams)</Label>
                            <Input
                              id="carb-grams"
                              type="number"
                              placeholder="e.g., 45"
                              value={asString(carbGrams)}
                              onChange={(e) => setCarbGrams(e.target.value)}
                              className={settings.darkMode ? "bg-gray-700 border-gray-600" : "bg-white"}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="carb-ratio">Carb Ratio (1 unit per X grams)</Label>
                            <Input
                              id="carb-ratio"
                              type="number"
                              placeholder="e.g., 15 (for 1:15 ratio)"
                              value={asString(carbRatio)}
                              onChange={(e) => setCarbRatio(e.target.value)}
                              className={settings.darkMode ? "bg-gray-700 border-gray-600" : "bg-white"}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* IOB Display */}
                    {currentIOB > 0 && (
                      <Alert
                        className={`mt-4 ${settings.darkMode ? "border-blue-800 bg-blue-950" : "border-blue-200 bg-blue-50"}`}
                      >
                        <Info className={`h-4 w-4 ${settings.darkMode ? "text-blue-400" : "text-blue-600"}`} />
                        <AlertDescription className={settings.darkMode ? "text-blue-200" : "text-blue-800"}>
                          <div className="flex justify-between items-center">
                            <span>
                              <strong>Insulin on Board ({settings.selectedInsulin}):</strong> {currentIOB.toFixed(1)}{" "}
                              units
                            </span>
                            <Button
                              variant="link"
                              size="sm"
                              className={settings.darkMode ? "text-blue-400" : "text-blue-600"}
                              onClick={() => setShowAdvanced(!showAdvanced)}
                            >
                              {showAdvanced ? (
                                <>
                                  Hide Details <ChevronUp className="h-3 w-3 ml-1" />
                                </>
                              ) : (
                                <>
                                  Show Details <ChevronDown className="h-3 w-3 ml-1" />
                                </>
                              )}
                            </Button>
                          </div>

                          {showAdvanced && (
                            <div className="mt-2 text-sm">
                              <p className="mb-1">
                                Active insulin doses from the last {settings.insulinDurationHours} hours:
                              </p>
                              <ul className="space-y-1">
                                {insulinDoses
                                  .filter((dose) => {
                                    const elapsed = Date.now() - dose.timestamp
                                    return elapsed < settings.insulinDurationHours * 60 * 60 * 1000
                                  })
                                  .map((dose, index) => {
                                    const elapsed = Date.now() - dose.timestamp
                                    const elapsedHours = elapsed / (60 * 60 * 1000)
                                    const medication = INSULIN_MEDICATIONS.find((med) => med.name === dose.insulinType)

                                    let remainingPercentage = 0
                                    switch (medication?.curve || "linear") {
                                      case "exponential":
                                        remainingPercentage = Math.exp(
                                          -elapsedHours / (settings.insulinDurationHours * 0.4),
                                        )
                                        break
                                      case "biexponential":
                                        const alpha = 0.8,
                                          beta = 0.2
                                        const k1 = 2 / settings.insulinDurationHours
                                        const k2 = 0.5 / settings.insulinDurationHours
                                        remainingPercentage =
                                          alpha * Math.exp(-k1 * elapsedHours) + beta * Math.exp(-k2 * elapsedHours)
                                        break
                                      default:
                                        remainingPercentage = Math.max(
                                          0,
                                          1 - elapsed / (settings.insulinDurationHours * 60 * 60 * 1000),
                                        )
                                    }

                                    const remainingUnits = dose.units * Math.max(0, remainingPercentage)

                                    return (
                                      <li key={index} className="flex justify-between">
                                        <span>
                                          {new Date(dose.timestamp).toLocaleTimeString()}: {dose.units} units (
                                          {dose.insulinType})
                                        </span>
                                        <span>
                                          {remainingUnits.toFixed(1)} units remaining (
                                          {Math.round(remainingPercentage * 100)}%)
                                        </span>
                                      </li>
                                    )
                                  })}
                              </ul>
                              <div className="mt-2 flex justify-end">
                                <Button variant="outline" size="sm" onClick={clearExpiredDoses}>
                                  <Trash2 className="h-3 w-3 mr-1" /> Clear Expired Doses
                                </Button>
                              </div>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Advanced Features */}
                    <Accordion type="single" collapsible>
                      <AccordionItem value="advanced-features">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Advanced Factors (Exercise, Stress, etc.)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                            {/* Exercise */}
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Exercise
                              </Label>
                              <Select value={exerciseType} onValueChange={setExerciseType}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select activity" />
                                </SelectTrigger>
                                <SelectContent>
                                  {EXERCISE_ACTIVITIES.map((activity) => (
                                    <SelectItem key={activity.name} value={activity.name}>
                                      {activity.name} ({activity.category})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                placeholder="Duration (minutes)"
                                value={exerciseDuration}
                                onChange={(e) => setExerciseDuration(Number(e.target.value))}
                              />
                              {exerciseDuration > 0 && (
                                <p className="text-xs text-green-600">
                                  Estimated insulin reduction: {(calculateExerciseAdjustment() * 100).toFixed(0)}%
                                </p>
                              )}
                            </div>

                            {/* Stress/Illness */}
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <Brain className="h-4 w-4" />
                                Stress & Health
                              </Label>
                              <Select value={stressLevel} onValueChange={setStressLevel}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select stress level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No stress</SelectItem>
                                  <SelectItem value="low">Low stress</SelectItem>
                                  <SelectItem value="moderate">Moderate stress</SelectItem>
                                  <SelectItem value="high">High stress</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex items-center space-x-2">
                                <Switch id="is-ill" checked={isIll} onCheckedChange={setIsIll} />
                                <Label htmlFor="is-ill">Currently ill</Label>
                              </div>
                            </div>

                            {/* Sleep Quality */}
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <Bed className="h-4 w-4" />
                                Sleep Quality
                              </Label>
                              <Select value={sleepQuality} onValueChange={setSleepQuality}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select quality" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="good">Good (7+ hours)</SelectItem>
                                  <SelectItem value="average">Average (5-7 hours)</SelectItem>
                                  <SelectItem value="poor">Poor (&lt;5 hours)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Menstrual Cycle */}
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                Menstrual Cycle
                              </Label>
                              <Select value={menstrualCyclePhase} onValueChange={setMenstrualCyclePhase}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select phase" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Not applicable</SelectItem>
                                  <SelectItem value="follicular">Follicular phase</SelectItem>
                                  <SelectItem value="luteal">Luteal phase</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="flex flex-col gap-3 pt-4">
                      <Button
                        onClick={calculateInsulin}
                        className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        size="lg"
                      >
                        <Calculator className="h-5 w-5 mr-2" />
                        Calculate Insulin Dose
                      </Button>
                      <Button
                        variant="outline"
                        onClick={reset}
                        className={`w-full ${settings.darkMode ? "border-gray-600 hover:bg-gray-700" : ""}`}
                      >
                        Reset Calculator
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {result && (
                  <Card
                    className={`mt-4 ${
                      settings.darkMode ? "bg-gray-800 border-green-800" : "border-green-200 bg-green-50"
                    }`}
                  >
                    <CardHeader>
                      <CardTitle
                        className={`flex items-center gap-2 ${settings.darkMode ? "text-green-400" : "text-green-800"}`}
                      >
                        <Info className="h-5 w-5" />
                        Calculation Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div
                        className={`p-4 rounded-lg border ${settings.darkMode ? "bg-gray-700 border-gray-600" : "bg-white"}`}
                      >
                        <h3 className={`font-semibold mb-2 ${settings.darkMode ? "text-gray-200" : "text-gray-700"}`}>
                          Step-by-Step Calculation:
                        </h3>
                        <div
                          className={`text-sm mb-2 ${settings.darkMode ? "text-gray-300" : "text-gray-600"} whitespace-pre-line`}
                        >
                          {result.calculation}
                        </div>

                        <div className={`grid gap-4 mt-4 grid-cols-2 sm:grid-cols-4`}>
                          <div
                            className={`text-center p-3 rounded-lg ${settings.darkMode ? "bg-blue-900" : "bg-blue-50"}`}
                          >
                            <p
                              className={`text-sm font-medium ${settings.darkMode ? "text-blue-300" : "text-blue-600"}`}
                            >
                              Starting Units
                            </p>
                            <p
                              className={`text-2xl font-bold ${settings.darkMode ? "text-blue-200" : "text-blue-800"}`}
                            >
                              {result.startingUnits}
                            </p>
                          </div>

                          {showCarbCalculator && result.carbUnits !== undefined && (
                            <div
                              className={`text-center p-3 rounded-lg ${settings.darkMode ? "bg-purple-900" : "bg-purple-50"}`}
                            >
                              <p
                                className={`text-sm font-medium ${settings.darkMode ? "text-purple-300" : "text-purple-600"}`}
                              >
                                Carb Units
                              </p>
                              <p
                                className={`text-2xl font-bold ${settings.darkMode ? "text-purple-200" : "text-purple-800"}`}
                              >
                                {result.carbUnits}
                              </p>
                            </div>
                          )}

                          <div
                            className={`text-center p-3 rounded-lg ${settings.darkMode ? "bg-orange-900" : "bg-orange-50"}`}
                          >
                            <p
                              className={`text-sm font-medium ${settings.darkMode ? "text-orange-300" : "text-orange-600"}`}
                            >
                              {showCarbCalculator && result.carbUnits ? "Total Additional" : "Additional Units"}
                            </p>
                            <p
                              className={`text-2xl font-bold ${settings.darkMode ? "text-orange-200" : "text-orange-800"}`}
                            >
                              {result.additionalUnits >= 0 ? "+" : ""}
                              {result.additionalUnits}
                            </p>
                          </div>

                          <div
                            className={`text-center p-3 rounded-lg border-2 ${settings.darkMode ? "bg-green-900 border-green-700" : "bg-green-100 border-green-300"}`}
                          >
                            <p
                              className={`text-sm font-medium ${settings.darkMode ? "text-green-300" : "text-green-600"}`}
                            >
                              Final Injection
                            </p>
                            <p
                              className={`text-3xl font-bold ${settings.darkMode ? "text-green-200" : "text-green-800"}`}
                            >
                              {result.finalUnits} units
                            </p>
                          </div>
                        </div>
                      </div>

                      {result.adjustmentFactors && result.adjustmentFactors.length > 0 && (
                        <Alert
                          className={`${settings.darkMode ? "border-purple-800 bg-purple-950" : "border-purple-200 bg-purple-50"}`}
                        >
                          <TrendingUp
                            className={`h-4 w-4 ${settings.darkMode ? "text-purple-400" : "text-purple-600"}`}
                          />
                          <AlertDescription className={settings.darkMode ? "text-purple-200" : "text-purple-800"}>
                            <strong>Applied Adjustments:</strong> {result.adjustmentFactors.join(", ")}
                          </AlertDescription>
                        </Alert>
                      )}

                      {result.additionalUnits < 0 && (
                        <Alert
                          className={`${
                            settings.darkMode ? "border-yellow-800 bg-yellow-950" : "border-yellow-200 bg-yellow-50"
                          }`}
                        >
                          <AlertTriangle
                            className={`h-4 w-4 ${settings.darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                          />
                          <AlertDescription className={settings.darkMode ? "text-yellow-200" : "text-yellow-800"}>
                            Your blood sugar is below target. The calculation shows negative additional units, which
                            means you may need less insulin than your starting dose. Please consult your healthcare
                            provider.
                          </AlertDescription>
                        </Alert>
                      )}

                      {currentIOB > 0 && (
                        <Alert
                          className={`${
                            settings.darkMode ? "border-purple-800 bg-purple-950" : "border-purple-200 bg-purple-50"
                          }`}
                        >
                          <Info className={`h-4 w-4 ${settings.darkMode ? "text-purple-400" : "text-purple-600"}`} />
                          <AlertDescription className={settings.darkMode ? "text-purple-200" : "text-purple-800"}>
                            <strong>Consider your IOB:</strong> You have {currentIOB.toFixed(1)} units of insulin still
                            active in your system. This may affect how much additional insulin you need.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={recordDose}
                        className="w-full"
                        variant={settings.darkMode ? "outline" : "secondary"}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Record This Dose for IOB Tracking
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="food-database">
                <Card className={settings.darkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Apple className="h-5 w-5" />
                      Food Database & Meal Builder
                    </CardTitle>
                    <CardDescription className={settings.darkMode ? "text-gray-400" : ""}>
                      Search foods and build complete meals with carb totals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Meal Builder Section */}
                    {selectedFoods.length > 0 && (
                      <div
                        className={`p-4 rounded-lg border ${settings.darkMode ? "bg-gray-700 border-gray-600" : "bg-green-50 border-green-200"}`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold">Current Meal</h3>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-lg font-bold">
                              {totalMealCarbs.toFixed(1)}g total carbs
                            </Badge>
                            <Button variant="outline" size="sm" onClick={clearMeal}>
                              Clear All
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {selectedFoods.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded"
                            >
                              <div className="flex-1">
                                <span className="font-medium">{item.food.name}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                  {item.quantity}g = {((item.food.carbsPer100g * item.quantity) / 100).toFixed(1)}g
                                  carbs
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFoodFromMeal(item.food.name)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            onClick={() => {
                              setCarbGrams(totalMealCarbs.toFixed(1))
                              setShowCarbCalculator(true)
                              setActiveTab("calculator")
                            }}
                            className="flex-1"
                          >
                            Use {totalMealCarbs.toFixed(1)}g in Calculator
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search foods, restaurants, drinks..."
                          value={foodSearch}
                          onChange={(e) => setFoodSearch(e.target.value)}
                          className={`pl-10 ${settings.darkMode ? "bg-gray-700 border-gray-600" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 max-h-60 overflow-y-auto">
                      {filteredFoods.map((food, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            selectedFood?.name === food.name
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                              : settings.darkMode
                                ? "border-gray-600"
                                : "border-gray-200"
                          }`}
                          onClick={() => setSelectedFood(food)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium">{food.name}</h4>
                              <p className="text-sm text-gray-500">{food.category}</p>
                              {food.commonServing && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  Common: {food.commonServing} = {food.servingCarbs}g carbs
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-2">
                              <p className="font-medium text-sm">{food.carbsPer100g}g</p>
                              <p className="text-xs text-gray-500">per 100g</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedFood && (
                      <div
                        className={`p-4 rounded-lg border ${settings.darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50"}`}
                      >
                        <h3 className="font-semibold mb-2">Add {selectedFood.name} to Meal</h3>

                        {/* Show common serving first if available */}
                        {selectedFood.commonServing && selectedFood.servingCarbs && (
                          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                              Quick Add - Common Serving
                            </h4>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{selectedFood.commonServing}</span>
                              <span className="font-bold">{selectedFood.servingCarbs}g carbs</span>
                            </div>
                            <Button
                              onClick={() => {
                                addFoodToMeal(
                                  selectedFood,
                                  selectedFood.servingCarbs
                                    ? (selectedFood.servingCarbs / selectedFood.carbsPer100g) * 100
                                    : 100,
                                )
                                setSelectedFood(null)
                              }}
                              className="w-full mt-2"
                              size="sm"
                            >
                              Add Common Serving
                            </Button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Custom Amount - Choose Your Preferred Method</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                              {/* Count/Amount Input */}
                              <div>
                                <Label className="text-xs text-gray-500">Count/Amount</Label>
                                <Input
                                  type="number"
                                  step="1"
                                  min="1"
                                  value={
                                    selectedFood.commonServing
                                      ? Math.round(
                                          foodQuantity /
                                            (((selectedFood.servingCarbs || selectedFood.carbsPer100g) /
                                              selectedFood.carbsPer100g) *
                                              100),
                                        )
                                      : Math.round(foodQuantity / 100)
                                  }
                                  onChange={(e) => {
                                    const count = Number(e.target.value) || 1
                                    if (selectedFood.servingCarbs) {
                                      // Use the serving size to calculate grams
                                      const gramsPerServing =
                                        (selectedFood.servingCarbs / selectedFood.carbsPer100g) * 100
                                      setFoodQuantity(count * gramsPerServing)
                                    } else {
                                      // Default to 100g per item if no serving info
                                      setFoodQuantity(count * 100)
                                    }
                                  }}
                                  className={settings.darkMode ? "bg-gray-600" : ""}
                                  placeholder="1"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                  {selectedFood.name.toLowerCase().includes("cookie") ||
                                  selectedFood.name.toLowerCase().includes("slice") ||
                                  selectedFood.name.toLowerCase().includes("piece")
                                    ? "pieces"
                                    : selectedFood.name.toLowerCase().includes("cup") ||
                                        selectedFood.name.toLowerCase().includes("serving")
                                      ? "servings"
                                      : "items"}
                                </p>
                              </div>

                              {/* Ounces Input */}
                              <div>
                                <Label className="text-xs text-gray-500">Weight (oz)</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={(foodQuantity * 0.035274).toFixed(1)}
                                  onChange={(e) => setFoodQuantity(Number(e.target.value) / 0.035274)}
                                  className={settings.darkMode ? "bg-gray-600" : ""}
                                  placeholder="3.5"
                                />
                                <p className="text-xs text-gray-400 mt-1">ounces</p>
                              </div>

                              {/* Grams Input */}
                              <div>
                                <Label className="text-xs text-gray-500">Weight (g)</Label>
                                <Input
                                  type="number"
                                  value={Math.round(foodQuantity)}
                                  onChange={(e) => setFoodQuantity(Number(e.target.value))}
                                  className={settings.darkMode ? "bg-gray-600" : ""}
                                  placeholder="100"
                                />
                                <p className="text-xs text-gray-400 mt-1">grams</p>
                              </div>
                            </div>

                            {/* Show what the count represents */}
                            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                              <strong>You're adding:</strong>{" "}
                              {selectedFood.commonServing
                                ? `${Math.round(foodQuantity / (((selectedFood.servingCarbs || selectedFood.carbsPer100g) / selectedFood.carbsPer100g) * 100))} × ${selectedFood.commonServing.split("(")[0].trim()}`
                                : `${Math.round(foodQuantity / 100)} × 100g portions of ${selectedFood.name}`}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Total Carbohydrates</Label>
                            <div
                              className={`p-3 rounded border text-center text-lg font-bold ${settings.darkMode ? "bg-gray-600" : "bg-white"}`}
                            >
                              {((selectedFood.carbsPer100g * foodQuantity) / 100).toFixed(1)}g carbs
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => {
                              addFoodToMeal(selectedFood, foodQuantity)
                              setSelectedFood(null)
                              setFoodQuantity(100)
                            }}
                            className="flex-1"
                          >
                            Add to Meal
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const totalCarbs = ((selectedFood.carbsPer100g * foodQuantity) / 100).toFixed(1)
                              setCarbGrams(totalCarbs)
                              setShowCarbCalculator(true)
                              setActiveTab("calculator")
                            }}
                          >
                            Use in Calculator
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends">
                <Card className={settings.darkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Trends & Analytics
                    </CardTitle>
                    <CardDescription className={settings.darkMode ? "text-gray-400" : ""}>
                      Analyze your insulin patterns and optimize ratios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {history.length === 0 ? (
                      <div className={`text-center py-8 ${settings.darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No data available yet</p>
                        <p className="text-sm">Start using the calculator to see trends</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Average Doses by Time */}
                        <div>
                          <h3 className="font-semibold mb-3">Average Doses by Time of Day</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {(["breakfast", "lunch", "dinner", "bedtime"] as TimePreset[]).map((preset) => {
                              const presetHistory = history.filter((h) => h.preset === preset)
                              const avgDose =
                                presetHistory.length > 0
                                  ? presetHistory.reduce((sum, h) => sum + h.finalUnits, 0) / presetHistory.length
                                  : 0

                              return (
                                <div
                                  key={preset}
                                  className={`p-3 rounded-lg ${settings.darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                                >
                                  <p className="text-sm font-medium capitalize">{preset}</p>
                                  <p className="text-2xl font-bold">{avgDose.toFixed(1)}</p>
                                  <p className="text-xs text-gray-500">{presetHistory.length} calculations</p>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Blood Sugar Patterns */}
                        <div>
                          <h3 className="font-semibold mb-3">Blood Sugar Patterns</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className={`p-3 rounded-lg ${settings.darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                              <p className="text-sm font-medium">Average BG</p>
                              <p className="text-2xl font-bold">
                                {(history.reduce((sum, h) => sum + h.testingBloodSugar, 0) / history.length).toFixed(0)}
                              </p>
                              <p className="text-xs text-gray-500">{settings.glucoseUnit}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${settings.darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                              <p className="text-sm font-medium">In Range</p>
                              <p className="text-2xl font-bold">
                                {Math.round(
                                  (history.filter((h) =>
                                    settings.glucoseUnit === "mg/dL"
                                      ? h.testingBloodSugar >= 70 && h.testingBloodSugar <= 180
                                      : h.testingBloodSugar >= 3.9 && h.testingBloodSugar <= 10,
                                  ).length /
                                    history.length) *
                                    100,
                                )}
                                %
                              </p>
                              <p className="text-xs text-gray-500">70-180 mg/dL</p>
                            </div>
                            <div className={`p-3 rounded-lg ${settings.darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                              <p className="text-sm font-medium">Avg Correction</p>
                              <p className="text-2xl font-bold">
                                {(history.reduce((sum, h) => sum + h.additionalUnits, 0) / history.length).toFixed(1)}
                              </p>
                              <p className="text-xs text-gray-500">units</p>
                            </div>
                          </div>
                        </div>

                        {/* Ratio Optimization Suggestions */}
                        <div>
                          <h3 className="font-semibold mb-3">Optimization Suggestions</h3>
                          <div className="space-y-2">
                            {(() => {
                              const suggestions = []
                              const avgCorrection =
                                history.reduce((sum, h) => sum + h.additionalUnits, 0) / history.length

                              if (avgCorrection > 2) {
                                suggestions.push({
                                  type: "warning",
                                  message:
                                    "Your average correction is high. Consider discussing a stronger insulin ratio with your healthcare provider.",
                                })
                              }

                              if (avgCorrection < -1) {
                                suggestions.push({
                                  type: "info",
                                  message:
                                    "Your average correction is negative. You might benefit from a weaker insulin ratio.",
                                })
                              }

                              const highBGCount = history.filter((h) =>
                                settings.glucoseUnit === "mg/dL" ? h.testingBloodSugar > 180 : h.testingBloodSugar > 10,
                              ).length

                              if (highBGCount / history.length > 0.3) {
                                suggestions.push({
                                  type: "warning",
                                  message:
                                    "You have frequent high blood sugars. Consider reviewing your carb ratios and basal insulin.",
                                })
                              }

                              return suggestions.length > 0 ? (
                                suggestions.map((suggestion, index) => (
                                  <Alert
                                    key={index}
                                    className={
                                      suggestion.type === "warning"
                                        ? `${settings.darkMode ? "border-yellow-800 bg-yellow-950" : "border-yellow-200 bg-yellow-50"}`
                                        : `${settings.darkMode ? "border-blue-800 bg-blue-950" : "border-blue-200 bg-blue-50"}`
                                    }
                                  >
                                    <Info
                                      className={`h-4 w-4 ${
                                        suggestion.type === "warning"
                                          ? settings.darkMode
                                            ? "text-yellow-400"
                                            : "text-yellow-600"
                                          : settings.darkMode
                                            ? "text-blue-400"
                                            : "text-blue-600"
                                      }`}
                                    />
                                    <AlertDescription
                                      className={
                                        suggestion.type === "warning"
                                          ? settings.darkMode
                                            ? "text-yellow-200"
                                            : "text-yellow-800"
                                          : settings.darkMode
                                            ? "text-blue-200"
                                            : "text-blue-800"
                                      }
                                    >
                                      {suggestion.message}
                                    </AlertDescription>
                                  </Alert>
                                ))
                              ) : (
                                <div className={`p-4 rounded-lg ${settings.darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                                  <p className="text-sm text-gray-500">
                                    Your insulin management looks good! Keep up the great work.
                                  </p>
                                </div>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className={settings.darkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Calculation History
                    </CardTitle>
                    <CardDescription className={settings.darkMode ? "text-gray-400" : ""}>
                      Review your past insulin calculations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {history.length === 0 ? (
                      <div className={`text-center py-8 ${settings.darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <History className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>No calculation history yet</p>
                        <p className="text-sm">Start using the calculator to see your history</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {history.map((item, index) => (
                          <Card key={index} className={settings.darkMode ? "bg-gray-700" : "bg-white"}>
                            <CardHeader>
                              <CardTitle className="text-sm">
                                {formatDate(item.timestamp)} - {item.finalUnits} units
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {item.preset !== "custom" ? `Preset: ${item.preset}` : "Custom Calculation"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="text-xs">
                              <p>
                                Blood Sugar: {item.testingBloodSugar} {item.glucoseUnit}
                              </p>
                              <p>
                                Goal: {item.bloodSugarGoal} {item.glucoseUnit}
                              </p>
                              <p>Ratio: 1:{item.ratio}</p>
                              {item.carbGrams && <p>Carbs: {item.carbGrams}g</p>}
                              {item.carbRatio && <p>Carb Ratio: 1:{item.carbRatio}</p>}
                              <p>Additional Units: {item.additionalUnits}</p>
                            </CardContent>
                          </Card>
                        ))}
                        <Button variant="destructive" onClick={clearHistory} className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear History
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className={settings.darkMode ? "bg-gray-800 border-gray-700" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="h-5 w-5" />
                      Settings & Preferences
                    </CardTitle>
                    <CardDescription className={settings.darkMode ? "text-gray-400" : ""}>
                      Customize your calculator settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <Switch id="dark-mode" checked={settings.darkMode} onCheckedChange={toggleDarkMode} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="glucose-unit">Glucose Unit</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={settings.glucoseUnit === "mg/dL" ? "default" : "outline"}
                          onClick={() => toggleGlucoseUnit("mg/dL")}
                        >
                          mg/dL
                        </Button>
                        <Button
                          variant={settings.glucoseUnit === "mmol/L" ? "default" : "outline"}
                          onClick={() => toggleGlucoseUnit("mmol/L")}
                        >
                          mmol/L
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="selected-insulin">Select Insulin Type</Label>
                      <Select value={selectedInsulin} onValueChange={handleInsulinChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select insulin" />
                        </SelectTrigger>
                        <SelectContent>
                          {INSULIN_MEDICATIONS.map((insulin) => (
                            <SelectItem key={insulin.name} value={insulin.name}>
                              {insulin.name} ({insulin.brand})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-dose-warning">Maximum Dose Warning</Label>
                      <Input
                        id="max-dose-warning"
                        type="number"
                        placeholder="e.g., 15"
                        value={settings.maxDoseWarning}
                        onChange={(e) => setSettings({ ...settings, maxDoseWarning: Number(e.target.value) })}
                        className={settings.darkMode ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>

                    {/* Show Splash Screen Setting */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-splash">Show Splash Screen on Startup</Label>
                      <Switch
                        id="show-splash"
                        checked={settings.showSplash}
                        onCheckedChange={(checked) => setSettings({ ...settings, showSplash: checked })}
                      />
                    </div>

                    {/* Contact Information in Settings */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Contact & Support
                      </h3>
                      <div className="space-y-3">
                        <p className={settings.darkMode ? "text-gray-300" : "text-gray-700"}>
                          If you have any questions, feedback, or encounter any issues, please feel free to reach out to
                          us.
                        </p>
                        <p className={settings.darkMode ? "text-gray-300" : "text-gray-700"}>
                          Email:{" "}
                          <a href="mailto:jsummers@youroea.biz" className="text-blue-600 hover:text-blue-800 underline">
                            jsummers@youroea.biz
                          </a>
                        </p>
                        <p className={settings.darkMode ? "text-gray-300" : "text-gray-700"}>
                          We appreciate your support and are committed to improving this calculator for everyone.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className={`text-center text-xs mt-8 space-y-1 ${settings.darkMode ? "text-gray-500" : "text-gray-400"}`}>
          <p>Diabetic Coverage Calculator - v1.0 - Made with ❤️</p>
          <p className="font-medium">Powered by Operational Excellence Advisors</p>
          <p className="italic">"Your Path to Victory - One Glucose Correction at a Time"</p>
        </div>
      </div>
    </div>
  )
}
