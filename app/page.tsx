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
  { name: "Pear", carbsPer100g: 15, category: "Fruits", commonServing: "1 medium (178g)", servingCarbs: 27 },
  { name: "Cherries", carbsPer100g: 16, category: "Fruits", commonServing: "1 cup (154g)", servingCarbs: 25 },
  { name: "Raspberries", carbsPer100g: 12, category: "Fruits", commonServing: "1 cup (123g)", servingCarbs: 15 },
  { name: "Blackberries", carbsPer100g: 10, category: "Fruits", commonServing: "1 cup (144g)", servingCarbs: 14 },
  { name: "Cantaloupe", carbsPer100g: 8, category: "Fruits", commonServing: "1 cup cubed (177g)", servingCarbs: 14 },
  { name: "Honeydew Melon", carbsPer100g: 9, category: "Fruits", commonServing: "1 cup cubed (177g)", servingCarbs: 16 },
  { name: "Kiwi", carbsPer100g: 15, category: "Fruits", commonServing: "1 medium (69g)", servingCarbs: 10 },
  { name: "Papaya", carbsPer100g: 11, category: "Fruits", commonServing: "1 cup cubed (145g)", servingCarbs: 16 },
  { name: "Grapefruit", carbsPer100g: 11, category: "Fruits", commonServing: "1/2 medium (123g)", servingCarbs: 13 },
  { name: "Plum", carbsPer100g: 11, category: "Fruits", commonServing: "1 medium (66g)", servingCarbs: 7 },
  { name: "Apricot", carbsPer100g: 11, category: "Fruits", commonServing: "1 medium (35g)", servingCarbs: 4 },
  { name: "Nectarine", carbsPer100g: 11, category: "Fruits", commonServing: "1 medium (142g)", servingCarbs: 15 },
  { name: "Pomegranate", carbsPer100g: 19, category: "Fruits", commonServing: "1/2 cup seeds (87g)", servingCarbs: 16 },
  { name: "Tangerine/Clementine", carbsPer100g: 13, category: "Fruits", commonServing: "1 medium (74g)", servingCarbs: 10 },
  { name: "Lemon", carbsPer100g: 9, category: "Fruits", commonServing: "1 medium (84g)", servingCarbs: 8 },
  { name: "Lime", carbsPer100g: 11, category: "Fruits", commonServing: "1 medium (67g)", servingCarbs: 7 },
  { name: "Coconut (Fresh)", carbsPer100g: 15, category: "Fruits", commonServing: "1 cup shredded (80g)", servingCarbs: 12 },
  { name: "Dried Apricots", carbsPer100g: 63, category: "Fruits", commonServing: "1/4 cup (32g)", servingCarbs: 20 },
  { name: "Dried Cranberries", carbsPer100g: 82, category: "Fruits", commonServing: "1/4 cup (40g)", servingCarbs: 33 },
  { name: "Raisins", carbsPer100g: 79, category: "Fruits", commonServing: "1/4 cup (41g)", servingCarbs: 32 },
  { name: "Dates", carbsPer100g: 75, category: "Fruits", commonServing: "1 date (24g)", servingCarbs: 18 },
  { name: "Prunes", carbsPer100g: 64, category: "Fruits", commonServing: "5 prunes (42g)", servingCarbs: 27 },
  { name: "Figs (Fresh)", carbsPer100g: 19, category: "Fruits", commonServing: "1 medium (50g)", servingCarbs: 10 },
  { name: "Figs (Dried)", carbsPer100g: 64, category: "Fruits", commonServing: "3 figs (40g)", servingCarbs: 26 },

  // === GRAINS & STARCHES ===
  { name: "White Rice", carbsPer100g: 28, category: "Grains", commonServing: "1 cup cooked (158g)", servingCarbs: 44 },
  { name: "Brown Rice", carbsPer100g: 23, category: "Grains", commonServing: "1 cup cooked (195g)", servingCarbs: 45 },
  { name: "Jasmine Rice", carbsPer100g: 28, category: "Grains", commonServing: "1 cup cooked (158g)", servingCarbs: 44 },
  { name: "Wild Rice", carbsPer100g: 21, category: "Grains", commonServing: "1 cup cooked (164g)", servingCarbs: 35 },
  { name: "Pasta (Spaghetti)", carbsPer100g: 25, category: "Grains", commonServing: "1 cup cooked (140g)", servingCarbs: 35 },
  { name: "Pasta (Penne)", carbsPer100g: 25, category: "Grains", commonServing: "1 cup cooked (140g)", servingCarbs: 35 },
  { name: "Pasta (Macaroni)", carbsPer100g: 25, category: "Grains", commonServing: "1 cup cooked (140g)", servingCarbs: 35 },
  { name: "Egg Noodles", carbsPer100g: 25, category: "Grains", commonServing: "1 cup cooked (160g)", servingCarbs: 40 },
  { name: "White Bread", carbsPer100g: 49, category: "Grains", commonServing: "1 slice (28g)", servingCarbs: 14 },
  { name: "Whole Wheat Bread", carbsPer100g: 41, category: "Grains", commonServing: "1 slice (28g)", servingCarbs: 12 },
  { name: "Sourdough Bread", carbsPer100g: 50, category: "Grains", commonServing: "1 slice (36g)", servingCarbs: 18 },
  { name: "Rye Bread", carbsPer100g: 48, category: "Grains", commonServing: "1 slice (32g)", servingCarbs: 15 },
  { name: "Pumpernickel Bread", carbsPer100g: 45, category: "Grains", commonServing: "1 slice (32g)", servingCarbs: 14 },
  { name: "Pita Bread", carbsPer100g: 55, category: "Grains", commonServing: "1 pita (60g)", servingCarbs: 33 },
  { name: "Tortilla (Flour)", carbsPer100g: 50, category: "Grains", commonServing: "1 large (64g)", servingCarbs: 32 },
  { name: "Tortilla (Corn)", carbsPer100g: 44, category: "Grains", commonServing: "1 medium (26g)", servingCarbs: 11 },
  { name: "Bagel (Plain)", carbsPer100g: 49, category: "Grains", commonServing: "1 medium (95g)", servingCarbs: 47 },
  { name: "Bagel (Everything)", carbsPer100g: 48, category: "Grains", commonServing: "1 medium (95g)", servingCarbs: 46 },
  { name: "English Muffin", carbsPer100g: 46, category: "Grains", commonServing: "1 muffin (57g)", servingCarbs: 26 },
  { name: "Croissant", carbsPer100g: 45, category: "Grains", commonServing: "1 medium (57g)", servingCarbs: 26 },
  { name: "Biscuit", carbsPer100g: 45, category: "Grains", commonServing: "1 biscuit (60g)", servingCarbs: 27 },
  { name: "Cornbread", carbsPer100g: 35, category: "Grains", commonServing: "1 piece (65g)", servingCarbs: 23 },
  { name: "Oatmeal", carbsPer100g: 12, category: "Grains", commonServing: "1 cup cooked (234g)", servingCarbs: 28 },
  { name: "Instant Oatmeal (Flavored)", carbsPer100g: 16, category: "Grains", commonServing: "1 packet (43g)", servingCarbs: 31 },
  { name: "Quinoa", carbsPer100g: 22, category: "Grains", commonServing: "1 cup cooked (185g)", servingCarbs: 41 },
  { name: "Couscous", carbsPer100g: 23, category: "Grains", commonServing: "1 cup cooked (157g)", servingCarbs: 36 },
  { name: "Barley", carbsPer100g: 28, category: "Grains", commonServing: "1 cup cooked (157g)", servingCarbs: 44 },
  { name: "Bulgur", carbsPer100g: 19, category: "Grains", commonServing: "1 cup cooked (182g)", servingCarbs: 34 },
  { name: "Polenta", carbsPer100g: 13, category: "Grains", commonServing: "1 cup cooked (240g)", servingCarbs: 31 },
  { name: "Grits", carbsPer100g: 13, category: "Grains", commonServing: "1 cup cooked (242g)", servingCarbs: 31 },
  { name: "Cheerios", carbsPer100g: 68, category: "Grains", commonServing: "1 cup (28g)", servingCarbs: 19 },
  { name: "Corn Flakes", carbsPer100g: 84, category: "Grains", commonServing: "1 cup (28g)", servingCarbs: 24 },
  { name: "Frosted Flakes", carbsPer100g: 87, category: "Grains", commonServing: "1 cup (31g)", servingCarbs: 27 },
  { name: "Fruit Loops", carbsPer100g: 83, category: "Grains", commonServing: "1 cup (29g)", servingCarbs: 24 },
  { name: "Honey Nut Cheerios", carbsPer100g: 73, category: "Grains", commonServing: "1 cup (28g)", servingCarbs: 20 },
  { name: "Lucky Charms", carbsPer100g: 80, category: "Grains", commonServing: "1 cup (27g)", servingCarbs: 22 },
  { name: "Raisin Bran", carbsPer100g: 71, category: "Grains", commonServing: "1 cup (59g)", servingCarbs: 42 },
  { name: "Special K", carbsPer100g: 75, category: "Grains", commonServing: "1 cup (31g)", servingCarbs: 23 },
  { name: "Granola", carbsPer100g: 64, category: "Grains", commonServing: "1/2 cup (61g)", servingCarbs: 39 },
  { name: "Cream of Wheat", carbsPer100g: 11, category: "Grains", commonServing: "1 cup cooked (241g)", servingCarbs: 27 },

  // === VEGETABLES ===
  { name: "Potato (Baked)", carbsPer100g: 21, category: "Vegetables", commonServing: "1 medium (173g)", servingCarbs: 36 },
  { name: "Potato (Boiled)", carbsPer100g: 17, category: "Vegetables", commonServing: "1 medium (167g)", servingCarbs: 28 },
  { name: "Potato (Mashed)", carbsPer100g: 16, category: "Vegetables", commonServing: "1 cup (210g)", servingCarbs: 34 },
  { name: "French Fries (Homemade)", carbsPer100g: 41, category: "Vegetables", commonServing: "1 cup (117g)", servingCarbs: 48 },
  { name: "Tater Tots", carbsPer100g: 35, category: "Vegetables", commonServing: "10 pieces (84g)", servingCarbs: 29 },
  { name: "Sweet Potato", carbsPer100g: 20, category: "Vegetables", commonServing: "1 medium (128g)", servingCarbs: 26 },
  { name: "Yam", carbsPer100g: 28, category: "Vegetables", commonServing: "1 cup cubed (136g)", servingCarbs: 38 },
  { name: "Corn on the Cob", carbsPer100g: 19, category: "Vegetables", commonServing: "1 ear (90g)", servingCarbs: 17 },
  { name: "Corn (Canned)", carbsPer100g: 14, category: "Vegetables", commonServing: "1/2 cup (82g)", servingCarbs: 11 },
  { name: "Peas (Green)", carbsPer100g: 14, category: "Vegetables", commonServing: "1 cup (145g)", servingCarbs: 20 },
  { name: "Carrots", carbsPer100g: 10, category: "Vegetables", commonServing: "1 cup chopped (128g)", servingCarbs: 13 },
  { name: "Broccoli", carbsPer100g: 7, category: "Vegetables", commonServing: "1 cup chopped (91g)", servingCarbs: 6 },
  { name: "Cauliflower", carbsPer100g: 5, category: "Vegetables", commonServing: "1 cup chopped (107g)", servingCarbs: 5 },
  { name: "Green Beans", carbsPer100g: 7, category: "Vegetables", commonServing: "1 cup (100g)", servingCarbs: 7 },
  { name: "Asparagus", carbsPer100g: 4, category: "Vegetables", commonServing: "6 spears (90g)", servingCarbs: 4 },
  { name: "Spinach (Cooked)", carbsPer100g: 4, category: "Vegetables", commonServing: "1 cup (180g)", servingCarbs: 7 },
  { name: "Kale (Cooked)", carbsPer100g: 4, category: "Vegetables", commonServing: "1 cup (130g)", servingCarbs: 5 },
  { name: "Lettuce (Iceberg)", carbsPer100g: 3, category: "Vegetables", commonServing: "1 cup shredded (72g)", servingCarbs: 2 },
  { name: "Lettuce (Romaine)", carbsPer100g: 3, category: "Vegetables", commonServing: "1 cup shredded (47g)", servingCarbs: 1 },
  { name: "Tomato", carbsPer100g: 4, category: "Vegetables", commonServing: "1 medium (123g)", servingCarbs: 5 },
  { name: "Cucumber", carbsPer100g: 4, category: "Vegetables", commonServing: "1 cup sliced (104g)", servingCarbs: 4 },
  { name: "Bell Pepper (Red)", carbsPer100g: 6, category: "Vegetables", commonServing: "1 medium (119g)", servingCarbs: 7 },
  { name: "Bell Pepper (Green)", carbsPer100g: 5, category: "Vegetables", commonServing: "1 medium (119g)", servingCarbs: 6 },
  { name: "Onion", carbsPer100g: 9, category: "Vegetables", commonServing: "1 medium (110g)", servingCarbs: 10 },
  { name: "Mushrooms", carbsPer100g: 3, category: "Vegetables", commonServing: "1 cup sliced (70g)", servingCarbs: 2 },
  { name: "Zucchini", carbsPer100g: 3, category: "Vegetables", commonServing: "1 cup sliced (113g)", servingCarbs: 3 },
  { name: "Squash (Butternut)", carbsPer100g: 12, category: "Vegetables", commonServing: "1 cup cubed (205g)", servingCarbs: 25 },
  { name: "Squash (Acorn)", carbsPer100g: 15, category: "Vegetables", commonServing: "1 cup cubed (205g)", servingCarbs: 31 },
  { name: "Eggplant", carbsPer100g: 6, category: "Vegetables", commonServing: "1 cup cubed (82g)", servingCarbs: 5 },
  { name: "Cabbage", carbsPer100g: 6, category: "Vegetables", commonServing: "1 cup shredded (89g)", servingCarbs: 5 },
  { name: "Brussels Sprouts", carbsPer100g: 9, category: "Vegetables", commonServing: "1 cup (88g)", servingCarbs: 8 },
  { name: "Celery", carbsPer100g: 3, category: "Vegetables", commonServing: "1 cup chopped (101g)", servingCarbs: 3 },
  { name: "Beets", carbsPer100g: 10, category: "Vegetables", commonServing: "1 cup sliced (136g)", servingCarbs: 14 },
  { name: "Artichoke", carbsPer100g: 11, category: "Vegetables", commonServing: "1 medium (120g)", servingCarbs: 13 },
  { name: "Avocado", carbsPer100g: 9, category: "Vegetables", commonServing: "1/2 medium (100g)", servingCarbs: 9 },

  // === DAIRY ===
  { name: "Milk (Whole)", carbsPer100g: 5, category: "Dairy", commonServing: "1 cup (244g)", servingCarbs: 12 },
  { name: "Milk (2%)", carbsPer100g: 5, category: "Dairy", commonServing: "1 cup (244g)", servingCarbs: 12 },
  { name: "Milk (1%)", carbsPer100g: 5, category: "Dairy", commonServing: "1 cup (244g)", servingCarbs: 12 },
  { name: "Milk (Skim)", carbsPer100g: 5, category: "Dairy", commonServing: "1 cup (245g)", servingCarbs: 12 },
  { name: "Chocolate Milk", carbsPer100g: 10, category: "Dairy", commonServing: "1 cup (250g)", servingCarbs: 25 },
  { name: "Almond Milk (Unsweetened)", carbsPer100g: 0.5, category: "Dairy", commonServing: "1 cup (240g)", servingCarbs: 1 },
  { name: "Almond Milk (Sweetened)", carbsPer100g: 3, category: "Dairy", commonServing: "1 cup (240g)", servingCarbs: 7 },
  { name: "Oat Milk", carbsPer100g: 7, category: "Dairy", commonServing: "1 cup (240g)", servingCarbs: 17 },
  { name: "Soy Milk", carbsPer100g: 3, category: "Dairy", commonServing: "1 cup (243g)", servingCarbs: 7 },
  { name: "Coconut Milk (Beverage)", carbsPer100g: 2, category: "Dairy", commonServing: "1 cup (240g)", servingCarbs: 5 },
  { name: "Yogurt (Plain)", carbsPer100g: 4, category: "Dairy", commonServing: "1 cup (245g)", servingCarbs: 10 },
  { name: "Yogurt (Flavored)", carbsPer100g: 15, category: "Dairy", commonServing: "1 cup (245g)", servingCarbs: 37 },
  { name: "Greek Yogurt (Plain)", carbsPer100g: 4, category: "Dairy", commonServing: "1 cup (245g)", servingCarbs: 10 },
  { name: "Greek Yogurt (Flavored)", carbsPer100g: 12, category: "Dairy", commonServing: "1 cup (245g)", servingCarbs: 29 },
  { name: "Ice Cream (Vanilla)", carbsPer100g: 22, category: "Dairy", commonServing: "1/2 cup (66g)", servingCarbs: 15 },
  { name: "Ice Cream (Chocolate)", carbsPer100g: 25, category: "Dairy", commonServing: "1/2 cup (66g)", servingCarbs: 17 },
  { name: "Ice Cream (Strawberry)", carbsPer100g: 22, category: "Dairy", commonServing: "1/2 cup (66g)", servingCarbs: 15 },
  { name: "Frozen Yogurt", carbsPer100g: 22, category: "Dairy", commonServing: "1/2 cup (72g)", servingCarbs: 16 },
  { name: "Cottage Cheese", carbsPer100g: 3, category: "Dairy", commonServing: "1 cup (226g)", servingCarbs: 7 },
  { name: "Cream Cheese", carbsPer100g: 4, category: "Dairy", commonServing: "2 tbsp (29g)", servingCarbs: 1 },
  { name: "Sour Cream", carbsPer100g: 3, category: "Dairy", commonServing: "2 tbsp (30g)", servingCarbs: 1 },
  { name: "Whipped Cream", carbsPer100g: 3, category: "Dairy", commonServing: "2 tbsp (8g)", servingCarbs: 0.5 },
  { name: "Half and Half", carbsPer100g: 4, category: "Dairy", commonServing: "2 tbsp (30g)", servingCarbs: 1 },
  { name: "Heavy Cream", carbsPer100g: 3, category: "Dairy", commonServing: "2 tbsp (30g)", servingCarbs: 1 },

  // === FAST FOOD - MCDONALD'S ===
  { name: "Big Mac", carbsPer100g: 19, category: "McDonald's", commonServing: "1 burger (230g)", servingCarbs: 44 },
  { name: "Quarter Pounder with Cheese", carbsPer100g: 16, category: "McDonald's", commonServing: "1 burger (220g)", servingCarbs: 35 },
  { name: "McDouble", carbsPer100g: 17, category: "McDonald's", commonServing: "1 burger (147g)", servingCarbs: 25 },
  { name: "Cheeseburger (McDonald's)", carbsPer100g: 22, category: "McDonald's", commonServing: "1 burger (114g)", servingCarbs: 25 },
  { name: "McChicken", carbsPer100g: 21, category: "McDonald's", commonServing: "1 sandwich (143g)", servingCarbs: 30 },
  { name: "Crispy Chicken Sandwich", carbsPer100g: 22, category: "McDonald's", commonServing: "1 sandwich (185g)", servingCarbs: 41 },
  { name: "Filet-O-Fish", carbsPer100g: 24, category: "McDonald's", commonServing: "1 sandwich (136g)", servingCarbs: 33 },
  { name: "Chicken McNuggets (4 pc)", carbsPer100g: 13, category: "McDonald's", commonServing: "4 pieces (64g)", servingCarbs: 8 },
  { name: "Chicken McNuggets (6 pc)", carbsPer100g: 13, category: "McDonald's", commonServing: "6 pieces (96g)", servingCarbs: 12 },
  { name: "Chicken McNuggets (10 pc)", carbsPer100g: 13, category: "McDonald's", commonServing: "10 pieces (164g)", servingCarbs: 21 },
  { name: "Chicken McNuggets (20 pc)", carbsPer100g: 13, category: "McDonald's", commonServing: "20 pieces (328g)", servingCarbs: 43 },
  { name: "French Fries - Small (McDonald's)", carbsPer100g: 43, category: "McDonald's", commonServing: "Small (71g)", servingCarbs: 31 },
  { name: "French Fries - Medium (McDonald's)", carbsPer100g: 43, category: "McDonald's", commonServing: "Medium (115g)", servingCarbs: 49 },
  { name: "French Fries - Large (McDonald's)", carbsPer100g: 43, category: "McDonald's", commonServing: "Large (150g)", servingCarbs: 65 },
  { name: "Hash Browns (McDonald's)", carbsPer100g: 31, category: "McDonald's", commonServing: "1 piece (56g)", servingCarbs: 17 },
  { name: "Egg McMuffin", carbsPer100g: 19, category: "McDonald's", commonServing: "1 sandwich (135g)", servingCarbs: 26 },
  { name: "Sausage McMuffin with Egg", carbsPer100g: 18, category: "McDonald's", commonServing: "1 sandwich (162g)", servingCarbs: 29 },
  { name: "Hotcakes (McDonald's)", carbsPer100g: 33, category: "McDonald's", commonServing: "3 hotcakes (151g)", servingCarbs: 50 },
  { name: "McFlurry (Oreo)", carbsPer100g: 31, category: "McDonald's", commonServing: "Regular (348g)", servingCarbs: 108 },
  { name: "McFlurry (M&M's)", carbsPer100g: 33, category: "McDonald's", commonServing: "Regular (348g)", servingCarbs: 115 },
  { name: "Apple Pie (McDonald's)", carbsPer100g: 38, category: "McDonald's", commonServing: "1 pie (77g)", servingCarbs: 29 },
  { name: "Vanilla Cone (McDonald's)", carbsPer100g: 24, category: "McDonald's", commonServing: "1 cone (100g)", servingCarbs: 24 },

  // === FAST FOOD - BURGER KING ===
  { name: "Whopper", carbsPer100g: 18, category: "Burger King", commonServing: "1 burger (290g)", servingCarbs: 52 },
  { name: "Whopper Jr", carbsPer100g: 18, category: "Burger King", commonServing: "1 burger (155g)", servingCarbs: 28 },
  { name: "Double Whopper", carbsPer100g: 14, category: "Burger King", commonServing: "1 burger (377g)", servingCarbs: 53 },
  { name: "Bacon King", carbsPer100g: 12, category: "Burger King", commonServing: "1 burger (365g)", servingCarbs: 44 },
  { name: "Chicken Royale/Original Chicken", carbsPer100g: 20, category: "Burger King", commonServing: "1 sandwich (219g)", servingCarbs: 44 },
  { name: "Chicken Fries (9 pc)", carbsPer100g: 24, category: "Burger King", commonServing: "9 pieces (91g)", servingCarbs: 22 },
  { name: "Onion Rings (Medium)", carbsPer100g: 46, category: "Burger King", commonServing: "Medium (91g)", servingCarbs: 42 },
  { name: "French Fries - Small (BK)", carbsPer100g: 41, category: "Burger King", commonServing: "Small (74g)", servingCarbs: 30 },
  { name: "French Fries - Medium (BK)", carbsPer100g: 41, category: "Burger King", commonServing: "Medium (116g)", servingCarbs: 48 },
  { name: "French Fries - Large (BK)", carbsPer100g: 41, category: "Burger King", commonServing: "Large (152g)", servingCarbs: 62 },
  { name: "Croissan'wich (Sausage, Egg & Cheese)", carbsPer100g: 17, category: "Burger King", commonServing: "1 sandwich (142g)", servingCarbs: 24 },
  { name: "Hershey's Sundae Pie", carbsPer100g: 45, category: "Burger King", commonServing: "1 pie (79g)", servingCarbs: 36 },

  // === FAST FOOD - WENDY'S ===
  { name: "Dave's Single", carbsPer100g: 15, category: "Wendy's", commonServing: "1 burger (244g)", servingCarbs: 37 },
  { name: "Dave's Double", carbsPer100g: 12, category: "Wendy's", commonServing: "1 burger (327g)", servingCarbs: 39 },
  { name: "Baconator", carbsPer100g: 10, category: "Wendy's", commonServing: "1 burger (299g)", servingCarbs: 30 },
  { name: "Jr. Bacon Cheeseburger", carbsPer100g: 19, category: "Wendy's", commonServing: "1 burger (131g)", servingCarbs: 25 },
  { name: "Spicy Chicken Sandwich", carbsPer100g: 20, category: "Wendy's", commonServing: "1 sandwich (218g)", servingCarbs: 44 },
  { name: "Homestyle Chicken Sandwich", carbsPer100g: 21, category: "Wendy's", commonServing: "1 sandwich (218g)", servingCarbs: 46 },
  { name: "Chicken Nuggets (4 pc Wendy's)", carbsPer100g: 17, category: "Wendy's", commonServing: "4 pieces (57g)", servingCarbs: 10 },
  { name: "Chicken Nuggets (10 pc Wendy's)", carbsPer100g: 17, category: "Wendy's", commonServing: "10 pieces (142g)", servingCarbs: 24 },
  { name: "Fries - Small (Wendy's)", carbsPer100g: 41, category: "Wendy's", commonServing: "Small (99g)", servingCarbs: 41 },
  { name: "Fries - Medium (Wendy's)", carbsPer100g: 41, category: "Wendy's", commonServing: "Medium (142g)", servingCarbs: 58 },
  { name: "Fries - Large (Wendy's)", carbsPer100g: 41, category: "Wendy's", commonServing: "Large (184g)", servingCarbs: 75 },
  { name: "Baked Potato (Plain)", carbsPer100g: 21, category: "Wendy's", commonServing: "1 potato (284g)", servingCarbs: 60 },
  { name: "Baked Potato (Loaded)", carbsPer100g: 18, category: "Wendy's", commonServing: "1 potato (396g)", servingCarbs: 71 },
  { name: "Chili (Small)", carbsPer100g: 7, category: "Wendy's", commonServing: "Small (227g)", servingCarbs: 16 },
  { name: "Frosty (Small)", carbsPer100g: 22, category: "Wendy's", commonServing: "Small (227g)", servingCarbs: 50 },
  { name: "Frosty (Medium)", carbsPer100g: 22, category: "Wendy's", commonServing: "Medium (340g)", servingCarbs: 75 },

  // === FAST FOOD - KFC ===
  { name: "Original Recipe Chicken Breast", carbsPer100g: 5, category: "KFC", commonServing: "1 piece (161g)", servingCarbs: 8 },
  { name: "Original Recipe Chicken Thigh", carbsPer100g: 6, category: "KFC", commonServing: "1 piece (126g)", servingCarbs: 8 },
  { name: "Original Recipe Chicken Drumstick", carbsPer100g: 5, category: "KFC", commonServing: "1 piece (59g)", servingCarbs: 3 },
  { name: "Original Recipe Chicken Wing", carbsPer100g: 7, category: "KFC", commonServing: "1 piece (47g)", servingCarbs: 3 },
  { name: "Extra Crispy Chicken Breast", carbsPer100g: 8, category: "KFC", commonServing: "1 piece (168g)", servingCarbs: 13 },
  { name: "Chicken Tenders (3 pc)", carbsPer100g: 13, category: "KFC", commonServing: "3 pieces (128g)", servingCarbs: 17 },
  { name: "Popcorn Chicken (Large)", carbsPer100g: 18, category: "KFC", commonServing: "Large (170g)", servingCarbs: 31 },
  { name: "KFC Famous Bowl", carbsPer100g: 13, category: "KFC", commonServing: "1 bowl (397g)", servingCarbs: 52 },
  { name: "KFC Chicken Pot Pie", carbsPer100g: 18, category: "KFC", commonServing: "1 pie (354g)", servingCarbs: 64 },
  { name: "Coleslaw (KFC)", carbsPer100g: 14, category: "KFC", commonServing: "Individual (130g)", servingCarbs: 18 },
  { name: "Mashed Potatoes with Gravy", carbsPer100g: 12, category: "KFC", commonServing: "Individual (136g)", servingCarbs: 16 },
  { name: "Mac and Cheese (KFC)", carbsPer100g: 14, category: "KFC", commonServing: "Individual (136g)", servingCarbs: 19 },
  { name: "Corn on the Cob (KFC)", carbsPer100g: 19, category: "KFC", commonServing: "1 ear (162g)", servingCarbs: 31 },
  { name: "Biscuit (KFC)", carbsPer100g: 45, category: "KFC", commonServing: "1 biscuit (56g)", servingCarbs: 25 },

  // === FAST FOOD - CHICK-FIL-A ===
  { name: "Chick-fil-A Chicken Sandwich", carbsPer100g: 22, category: "Chick-fil-A", commonServing: "1 sandwich (159g)", servingCarbs: 35 },
  { name: "Chick-fil-A Deluxe Sandwich", carbsPer100g: 21, category: "Chick-fil-A", commonServing: "1 sandwich (196g)", servingCarbs: 41 },
  { name: "Spicy Chicken Sandwich (CFA)", carbsPer100g: 21, category: "Chick-fil-A", commonServing: "1 sandwich (163g)", servingCarbs: 34 },
  { name: "Grilled Chicken Sandwich", carbsPer100g: 15, category: "Chick-fil-A", commonServing: "1 sandwich (178g)", servingCarbs: 27 },
  { name: "Chick-fil-A Nuggets (8 pc)", carbsPer100g: 10, category: "Chick-fil-A", commonServing: "8 pieces (113g)", servingCarbs: 11 },
  { name: "Chick-fil-A Nuggets (12 pc)", carbsPer100g: 10, category: "Chick-fil-A", commonServing: "12 pieces (170g)", servingCarbs: 17 },
  { name: "Chick-n-Strips (3 ct)", carbsPer100g: 11, category: "Chick-fil-A", commonServing: "3 strips (105g)", servingCarbs: 12 },
  { name: "Waffle Fries - Small", carbsPer100g: 39, category: "Chick-fil-A", commonServing: "Small (88g)", servingCarbs: 34 },
  { name: "Waffle Fries - Medium", carbsPer100g: 39, category: "Chick-fil-A", commonServing: "Medium (125g)", servingCarbs: 49 },
  { name: "Waffle Fries - Large", carbsPer100g: 39, category: "Chick-fil-A", commonServing: "Large (163g)", servingCarbs: 64 },
  { name: "Chicken Biscuit", carbsPer100g: 25, category: "Chick-fil-A", commonServing: "1 biscuit (160g)", servingCarbs: 40 },
  { name: "Hash Brown Scramble Bowl", carbsPer100g: 10, category: "Chick-fil-A", commonServing: "1 bowl (264g)", servingCarbs: 26 },
  { name: "Frosted Lemonade", carbsPer100g: 14, category: "Chick-fil-A", commonServing: "Small (248g)", servingCarbs: 35 },
  { name: "Chocolate Milkshake (CFA)", carbsPer100g: 18, category: "Chick-fil-A", commonServing: "Small (454g)", servingCarbs: 82 },
  { name: "Chocolate Chunk Cookie (CFA)", carbsPer100g: 56, category: "Chick-fil-A", commonServing: "1 cookie (45g)", servingCarbs: 25 },

  // === FAST FOOD - SUBWAY ===
  { name: 'Subway 6" Turkey Breast', carbsPer100g: 19, category: "Subway", commonServing: "1 sandwich (238g)", servingCarbs: 45 },
  { name: 'Subway 6" Italian BMT', carbsPer100g: 20, category: "Subway", commonServing: "1 sandwich (236g)", servingCarbs: 47 },
  { name: 'Subway 6" Meatball Marinara', carbsPer100g: 21, category: "Subway", commonServing: "1 sandwich (269g)", servingCarbs: 56 },
  { name: 'Subway 6" Tuna', carbsPer100g: 18, category: "Subway", commonServing: "1 sandwich (238g)", servingCarbs: 43 },
  { name: 'Subway 6" Cold Cut Combo', carbsPer100g: 19, category: "Subway", commonServing: "1 sandwich (238g)", servingCarbs: 45 },
  { name: 'Subway 6" Chicken Teriyaki', carbsPer100g: 22, category: "Subway", commonServing: "1 sandwich (269g)", servingCarbs: 59 },
  { name: 'Subway 6" Veggie Delite', carbsPer100g: 20, category: "Subway", commonServing: "1 sandwich (167g)", servingCarbs: 33 },
  { name: 'Subway 6" Steak & Cheese', carbsPer100g: 19, category: "Subway", commonServing: "1 sandwich (250g)", servingCarbs: 48 },
  { name: 'Subway Footlong Turkey', carbsPer100g: 19, category: "Subway", commonServing: "1 sandwich (476g)", servingCarbs: 90 },
  { name: 'Subway Footlong Italian BMT', carbsPer100g: 20, category: "Subway", commonServing: "1 sandwich (472g)", servingCarbs: 94 },
  { name: "Subway Chocolate Chip Cookie", carbsPer100g: 67, category: "Subway", commonServing: "1 cookie (45g)", servingCarbs: 30 },
  { name: "Subway White Chip Macadamia Cookie", carbsPer100g: 64, category: "Subway", commonServing: "1 cookie (45g)", servingCarbs: 29 },
  { name: "Subway Hash Browns", carbsPer100g: 30, category: "Subway", commonServing: "1 portion (57g)", servingCarbs: 17 },

  // === FAST FOOD - TACO BELL ===
  { name: "Crunchy Taco", carbsPer100g: 25, category: "Taco Bell", commonServing: "1 taco (78g)", servingCarbs: 20 },
  { name: "Soft Taco", carbsPer100g: 21, category: "Taco Bell", commonServing: "1 taco (92g)", servingCarbs: 19 },
  { name: "Doritos Locos Taco", carbsPer100g: 26, category: "Taco Bell", commonServing: "1 taco (78g)", servingCarbs: 20 },
  { name: "Chalupa Supreme", carbsPer100g: 19, category: "Taco Bell", commonServing: "1 chalupa (153g)", servingCarbs: 29 },
  { name: "Gordita Crunch", carbsPer100g: 18, category: "Taco Bell", commonServing: "1 gordita (153g)", servingCarbs: 28 },
  { name: "Burrito Supreme", carbsPer100g: 18, category: "Taco Bell", commonServing: "1 burrito (248g)", servingCarbs: 45 },
  { name: "Bean Burrito", carbsPer100g: 19, category: "Taco Bell", commonServing: "1 burrito (198g)", servingCarbs: 38 },
  { name: "Cheesy Gordita Crunch", carbsPer100g: 17, category: "Taco Bell", commonServing: "1 item (153g)", servingCarbs: 26 },
  { name: "Crunchwrap Supreme", carbsPer100g: 17, category: "Taco Bell", commonServing: "1 wrap (254g)", servingCarbs: 43 },
  { name: "Mexican Pizza", carbsPer100g: 18, category: "Taco Bell", commonServing: "1 pizza (213g)", servingCarbs: 38 },
  { name: "Quesadilla (Taco Bell)", carbsPer100g: 22, category: "Taco Bell", commonServing: "1 quesadilla (184g)", servingCarbs: 40 },
  { name: "Nachos BellGrande", carbsPer100g: 17, category: "Taco Bell", commonServing: "1 order (308g)", servingCarbs: 52 },
  { name: "Chips and Nacho Cheese", carbsPer100g: 35, category: "Taco Bell", commonServing: "1 order (102g)", servingCarbs: 36 },
  { name: "Cinnamon Twists", carbsPer100g: 75, category: "Taco Bell", commonServing: "1 order (35g)", servingCarbs: 26 },

  // === FAST FOOD - CHIPOTLE ===
  { name: "Chipotle Chicken Burrito", carbsPer100g: 15, category: "Chipotle", commonServing: "1 burrito (510g)", servingCarbs: 77 },
  { name: "Chipotle Steak Burrito", carbsPer100g: 15, category: "Chipotle", commonServing: "1 burrito (524g)", servingCarbs: 79 },
  { name: "Chipotle Chicken Bowl", carbsPer100g: 9, category: "Chipotle", commonServing: "1 bowl (510g)", servingCarbs: 46 },
  { name: "Chipotle Chicken Tacos (3)", carbsPer100g: 14, category: "Chipotle", commonServing: "3 tacos (396g)", servingCarbs: 55 },
  { name: "Chipotle Chips", carbsPer100g: 50, category: "Chipotle", commonServing: "1 serving (117g)", servingCarbs: 59 },
  { name: "Chipotle Chips and Guacamole", carbsPer100g: 35, category: "Chipotle", commonServing: "1 serving (227g)", servingCarbs: 79 },
  { name: "Chipotle Queso Blanco", carbsPer100g: 5, category: "Chipotle", commonServing: "1 side (57g)", servingCarbs: 3 },

  // === FAST FOOD - POPEYES ===
  { name: "Popeyes Chicken Sandwich", carbsPer100g: 21, category: "Popeyes", commonServing: "1 sandwich (200g)", servingCarbs: 42 },
  { name: "Popeyes Spicy Chicken Sandwich", carbsPer100g: 21, category: "Popeyes", commonServing: "1 sandwich (200g)", servingCarbs: 42 },
  { name: "Popeyes Chicken (Breast)", carbsPer100g: 5, category: "Popeyes", commonServing: "1 piece (166g)", servingCarbs: 8 },
  { name: "Popeyes Chicken (Thigh)", carbsPer100g: 6, category: "Popeyes", commonServing: "1 piece (114g)", servingCarbs: 7 },
  { name: "Popeyes Chicken Tenders (3 pc)", carbsPer100g: 16, category: "Popeyes", commonServing: "3 pieces (99g)", servingCarbs: 16 },
  { name: "Cajun Fries (Regular)", carbsPer100g: 40, category: "Popeyes", commonServing: "Regular (85g)", servingCarbs: 34 },
  { name: "Red Beans and Rice", carbsPer100g: 17, category: "Popeyes", commonServing: "Regular (170g)", servingCarbs: 29 },
  { name: "Mashed Potatoes (Popeyes)", carbsPer100g: 11, category: "Popeyes", commonServing: "Regular (142g)", servingCarbs: 16 },
  { name: "Popeyes Biscuit", carbsPer100g: 43, category: "Popeyes", commonServing: "1 biscuit (60g)", servingCarbs: 26 },

  // === PIZZA ===
  { name: "Pizza (Cheese)", carbsPer100g: 33, category: "Pizza", commonServing: "1 slice (107g)", servingCarbs: 35 },
  { name: "Pizza (Pepperoni)", carbsPer100g: 32, category: "Pizza", commonServing: "1 slice (108g)", servingCarbs: 35 },
  { name: "Pizza (Supreme/Combo)", carbsPer100g: 30, category: "Pizza", commonServing: "1 slice (123g)", servingCarbs: 37 },
  { name: "Pizza (Meat Lovers)", carbsPer100g: 26, category: "Pizza", commonServing: "1 slice (130g)", servingCarbs: 34 },
  { name: "Pizza (Hawaiian)", carbsPer100g: 28, category: "Pizza", commonServing: "1 slice (115g)", servingCarbs: 32 },
  { name: "Pizza (Veggie)", carbsPer100g: 30, category: "Pizza", commonServing: "1 slice (120g)", servingCarbs: 36 },
  { name: "Pizza (BBQ Chicken)", carbsPer100g: 32, category: "Pizza", commonServing: "1 slice (125g)", servingCarbs: 40 },
  { name: "Pizza (Buffalo Chicken)", carbsPer100g: 28, category: "Pizza", commonServing: "1 slice (120g)", servingCarbs: 34 },
  { name: "Domino's Hand Tossed (Cheese)", carbsPer100g: 31, category: "Pizza", commonServing: "1 slice med (78g)", servingCarbs: 24 },
  { name: "Domino's Brooklyn Style (Cheese)", carbsPer100g: 29, category: "Pizza", commonServing: "1 slice lg (99g)", servingCarbs: 29 },
  { name: "Domino's Thin Crust (Cheese)", carbsPer100g: 26, category: "Pizza", commonServing: "1/4 med (99g)", servingCarbs: 26 },
  { name: "Domino's Pan Pizza (Cheese)", carbsPer100g: 32, category: "Pizza", commonServing: "1 slice med (92g)", servingCarbs: 29 },
  { name: "Domino's Breadsticks", carbsPer100g: 50, category: "Pizza", commonServing: "2 pieces (60g)", servingCarbs: 30 },
  { name: "Domino's Cheesy Bread", carbsPer100g: 38, category: "Pizza", commonServing: "2 pieces (67g)", servingCarbs: 25 },
  { name: "Domino's Cinnamon Twist", carbsPer100g: 58, category: "Pizza", commonServing: "2 pieces (60g)", servingCarbs: 35 },
  { name: "Pizza Hut Hand Tossed (Cheese)", carbsPer100g: 32, category: "Pizza", commonServing: "1 slice med (84g)", servingCarbs: 27 },
  { name: "Pizza Hut Pan Pizza (Cheese)", carbsPer100g: 33, category: "Pizza", commonServing: "1 slice med (99g)", servingCarbs: 33 },
  { name: "Pizza Hut Thin & Crispy (Cheese)", carbsPer100g: 30, category: "Pizza", commonServing: "1 slice med (71g)", servingCarbs: 21 },
  { name: "Pizza Hut Personal Pan", carbsPer100g: 35, category: "Pizza", commonServing: "1 pizza (255g)", servingCarbs: 89 },
  { name: "Pizza Hut Breadsticks", carbsPer100g: 52, category: "Pizza", commonServing: "2 pieces (56g)", servingCarbs: 29 },
  { name: "Papa John's Original Crust (Cheese)", carbsPer100g: 31, category: "Pizza", commonServing: "1 slice lg (117g)", servingCarbs: 36 },
  { name: "Papa John's Thin Crust (Cheese)", carbsPer100g: 26, category: "Pizza", commonServing: "1 slice lg (92g)", servingCarbs: 24 },
  { name: "Papa John's Breadsticks", carbsPer100g: 48, category: "Pizza", commonServing: "2 sticks (67g)", servingCarbs: 32 },
  { name: "Little Caesars (Cheese)", carbsPer100g: 31, category: "Pizza", commonServing: "1 slice (91g)", servingCarbs: 28 },
  { name: "Little Caesars Crazy Bread", carbsPer100g: 52, category: "Pizza", commonServing: "1 stick (37g)", servingCarbs: 19 },

  // === CHINESE FOOD ===
  { name: "Fried Rice", carbsPer100g: 25, category: "Chinese", commonServing: "1 cup (166g)", servingCarbs: 42 },
  { name: "White Rice (Steamed)", carbsPer100g: 28, category: "Chinese", commonServing: "1 cup (158g)", servingCarbs: 44 },
  { name: "Lo Mein", carbsPer100g: 20, category: "Chinese", commonServing: "1 cup (200g)", servingCarbs: 40 },
  { name: "Chow Mein", carbsPer100g: 22, category: "Chinese", commonServing: "1 cup (200g)", servingCarbs: 44 },
  { name: "Sweet and Sour Chicken", carbsPer100g: 28, category: "Chinese", commonServing: "1 cup (217g)", servingCarbs: 61 },
  { name: "General Tso's Chicken", carbsPer100g: 25, category: "Chinese", commonServing: "1 cup (146g)", servingCarbs: 37 },
  { name: "Orange Chicken", carbsPer100g: 26, category: "Chinese", commonServing: "1 cup (162g)", servingCarbs: 42 },
  { name: "Kung Pao Chicken", carbsPer100g: 12, category: "Chinese", commonServing: "1 cup (162g)", servingCarbs: 19 },
  { name: "Beef and Broccoli", carbsPer100g: 8, category: "Chinese", commonServing: "1 cup (217g)", servingCarbs: 17 },
  { name: "Mongolian Beef", carbsPer100g: 15, category: "Chinese", commonServing: "1 cup (162g)", servingCarbs: 24 },
  { name: "Sesame Chicken", carbsPer100g: 24, category: "Chinese", commonServing: "1 cup (162g)", servingCarbs: 39 },
  { name: "Cashew Chicken", carbsPer100g: 14, category: "Chinese", commonServing: "1 cup (162g)", servingCarbs: 23 },
  { name: "Moo Shu Pork", carbsPer100g: 10, category: "Chinese", commonServing: "1 cup (151g)", servingCarbs: 15 },
  { name: "Egg Drop Soup", carbsPer100g: 3, category: "Chinese", commonServing: "1 cup (241g)", servingCarbs: 7 },
  { name: "Hot and Sour Soup", carbsPer100g: 4, category: "Chinese", commonServing: "1 cup (241g)", servingCarbs: 10 },
  { name: "Wonton Soup", carbsPer100g: 5, category: "Chinese", commonServing: "1 cup (241g)", servingCarbs: 12 },
  { name: "Egg Roll", carbsPer100g: 24, category: "Chinese", commonServing: "1 roll (64g)", servingCarbs: 15 },
  { name: "Spring Roll", carbsPer100g: 28, category: "Chinese", commonServing: "1 roll (64g)", servingCarbs: 18 },
  { name: "Crab Rangoon", carbsPer100g: 30, category: "Chinese", commonServing: "4 pieces (96g)", servingCarbs: 29 },
  { name: "Pot Stickers/Dumplings", carbsPer100g: 25, category: "Chinese", commonServing: "6 pieces (144g)", servingCarbs: 36 },
  { name: "Fortune Cookie", carbsPer100g: 82, category: "Chinese", commonServing: "1 cookie (8g)", servingCarbs: 7 },
  { name: "Panda Express Orange Chicken", carbsPer100g: 23, category: "Chinese", commonServing: "1 entree (162g)", servingCarbs: 37 },
  { name: "Panda Express Beijing Beef", carbsPer100g: 20, category: "Chinese", commonServing: "1 entree (162g)", servingCarbs: 32 },
  { name: "Panda Express Chow Mein", carbsPer100g: 20, category: "Chinese", commonServing: "1 side (255g)", servingCarbs: 51 },
  { name: "Panda Express Fried Rice", carbsPer100g: 23, category: "Chinese", commonServing: "1 side (255g)", servingCarbs: 59 },

  // === MEXICAN FOOD ===
  { name: "Burrito (Bean & Rice)", carbsPer100g: 20, category: "Mexican", commonServing: "1 burrito (217g)", servingCarbs: 43 },
  { name: "Burrito (Chicken)", carbsPer100g: 18, category: "Mexican", commonServing: "1 burrito (255g)", servingCarbs: 46 },
  { name: "Burrito (Beef)", carbsPer100g: 17, category: "Mexican", commonServing: "1 burrito (255g)", servingCarbs: 43 },
  { name: "Burrito (Carnitas)", carbsPer100g: 16, category: "Mexican", commonServing: "1 burrito (255g)", servingCarbs: 41 },
  { name: "Quesadilla (Cheese)", carbsPer100g: 22, category: "Mexican", commonServing: "1 quesadilla (142g)", servingCarbs: 31 },
  { name: "Quesadilla (Chicken)", carbsPer100g: 19, category: "Mexican", commonServing: "1 quesadilla (184g)", servingCarbs: 35 },
  { name: "Tacos (Hard Shell Beef)", carbsPer100g: 20, category: "Mexican", commonServing: "2 tacos (156g)", servingCarbs: 31 },
  { name: "Tacos (Soft Shell Chicken)", carbsPer100g: 18, category: "Mexican", commonServing: "2 tacos (186g)", servingCarbs: 33 },
  { name: "Tacos (Fish)", carbsPer100g: 19, category: "Mexican", commonServing: "2 tacos (180g)", servingCarbs: 34 },
  { name: "Tacos (Street Style)", carbsPer100g: 16, category: "Mexican", commonServing: "3 tacos (150g)", servingCarbs: 24 },
  { name: "Enchiladas (Cheese)", carbsPer100g: 14, category: "Mexican", commonServing: "2 enchiladas (280g)", servingCarbs: 39 },
  { name: "Enchiladas (Chicken)", carbsPer100g: 12, category: "Mexican", commonServing: "2 enchiladas (280g)", servingCarbs: 34 },
  { name: "Tamales (Pork)", carbsPer100g: 18, category: "Mexican", commonServing: "2 tamales (200g)", servingCarbs: 36 },
  { name: "Nachos with Cheese", carbsPer100g: 36, category: "Mexican", commonServing: "1 serving (113g)", servingCarbs: 41 },
  { name: "Nachos Supreme", carbsPer100g: 22, category: "Mexican", commonServing: "1 plate (255g)", servingCarbs: 56 },
  { name: "Spanish Rice", carbsPer100g: 23, category: "Mexican", commonServing: "1 cup (158g)", servingCarbs: 36 },
  { name: "Cilantro Lime Rice", carbsPer100g: 25, category: "Mexican", commonServing: "1 cup (158g)", servingCarbs: 40 },
  { name: "Refried Beans", carbsPer100g: 15, category: "Mexican", commonServing: "1/2 cup (120g)", servingCarbs: 18 },
  { name: "Black Beans", carbsPer100g: 16, category: "Mexican", commonServing: "1/2 cup (86g)", servingCarbs: 14 },
  { name: "Guacamole", carbsPer100g: 9, category: "Mexican", commonServing: "1/4 cup (57g)", servingCarbs: 5 },
  { name: "Salsa", carbsPer100g: 5, category: "Mexican", commonServing: "1/4 cup (65g)", servingCarbs: 3 },
  { name: "Tortilla Chips", carbsPer100g: 64, category: "Mexican", commonServing: "1 oz (28g)", servingCarbs: 18 },
  { name: "Churros", carbsPer100g: 54, category: "Mexican", commonServing: "1 churro (26g)", servingCarbs: 14 },
  { name: "Sopapilla", carbsPer100g: 45, category: "Mexican", commonServing: "1 piece (42g)", servingCarbs: 19 },
  { name: "Flan", carbsPer100g: 28, category: "Mexican", commonServing: "1 slice (100g)", servingCarbs: 28 },

  // === ITALIAN FOOD ===
  { name: "Spaghetti with Marinara", carbsPer100g: 25, category: "Italian", commonServing: "1 cup (140g)", servingCarbs: 35 },
  { name: "Spaghetti with Meat Sauce", carbsPer100g: 20, category: "Italian", commonServing: "1 cup (248g)", servingCarbs: 50 },
  { name: "Spaghetti and Meatballs", carbsPer100g: 18, category: "Italian", commonServing: "1 plate (310g)", servingCarbs: 56 },
  { name: "Fettuccine Alfredo", carbsPer100g: 19, category: "Italian", commonServing: "1 cup (162g)", servingCarbs: 31 },
  { name: "Penne Vodka", carbsPer100g: 21, category: "Italian", commonServing: "1 cup (162g)", servingCarbs: 34 },
  { name: "Baked Ziti", carbsPer100g: 18, category: "Italian", commonServing: "1 cup (248g)", servingCarbs: 45 },
  { name: "Lasagna", carbsPer100g: 13, category: "Italian", commonServing: "1 piece (215g)", servingCarbs: 28 },
  { name: "Chicken Parmesan", carbsPer100g: 12, category: "Italian", commonServing: "1 piece with pasta (340g)", servingCarbs: 41 },
  { name: "Eggplant Parmesan", carbsPer100g: 14, category: "Italian", commonServing: "1 piece (200g)", servingCarbs: 28 },
  { name: "Ravioli (Cheese)", carbsPer100g: 28, category: "Italian", commonServing: "1 cup (125g)", servingCarbs: 35 },
  { name: "Ravioli (Meat)", carbsPer100g: 25, category: "Italian", commonServing: "1 cup (125g)", servingCarbs: 31 },
  { name: "Tortellini", carbsPer100g: 30, category: "Italian", commonServing: "1 cup (113g)", servingCarbs: 34 },
  { name: "Gnocchi", carbsPer100g: 32, category: "Italian", commonServing: "1 cup (145g)", servingCarbs: 46 },
  { name: "Risotto", carbsPer100g: 18, category: "Italian", commonServing: "1 cup (186g)", servingCarbs: 33 },
  { name: "Minestrone Soup", carbsPer100g: 5, category: "Italian", commonServing: "1 cup (241g)", servingCarbs: 12 },
  { name: "Italian Wedding Soup", carbsPer100g: 4, category: "Italian", commonServing: "1 cup (241g)", servingCarbs: 10 },
  { name: "Garlic Bread", carbsPer100g: 48, category: "Italian", commonServing: "1 slice (28g)", servingCarbs: 13 },
  { name: "Breadsticks (Restaurant)", carbsPer100g: 52, category: "Italian", commonServing: "1 stick (43g)", servingCarbs: 22 },
  { name: "Caesar Salad", carbsPer100g: 5, category: "Italian", commonServing: "1 cup (94g)", servingCarbs: 5 },
  { name: "Caprese Salad", carbsPer100g: 4, category: "Italian", commonServing: "1 serving (180g)", servingCarbs: 7 },
  { name: "Bruschetta", carbsPer100g: 30, category: "Italian", commonServing: "2 pieces (60g)", servingCarbs: 18 },
  { name: "Tiramisu", carbsPer100g: 32, category: "Italian", commonServing: "1 slice (113g)", servingCarbs: 36 },
  { name: "Cannoli", carbsPer100g: 38, category: "Italian", commonServing: "1 cannoli (85g)", servingCarbs: 32 },
  { name: "Panna Cotta", carbsPer100g: 22, category: "Italian", commonServing: "1 serving (120g)", servingCarbs: 26 },
  { name: "Olive Garden Breadstick", carbsPer100g: 52, category: "Italian", commonServing: "1 stick (50g)", servingCarbs: 26 },
  { name: "Olive Garden Fettuccine Alfredo", carbsPer100g: 15, category: "Italian", commonServing: "Lunch portion (283g)", servingCarbs: 42 },

  // === INDIAN FOOD ===
  { name: "Basmati Rice", carbsPer100g: 25, category: "Indian", commonServing: "1 cup cooked (163g)", servingCarbs: 41 },
  { name: "Biryani (Chicken)", carbsPer100g: 18, category: "Indian", commonServing: "1 cup (200g)", servingCarbs: 36 },
  { name: "Naan Bread", carbsPer100g: 45, category: "Indian", commonServing: "1 piece (90g)", servingCarbs: 41 },
  { name: "Garlic Naan", carbsPer100g: 47, category: "Indian", commonServing: "1 piece (90g)", servingCarbs: 42 },
  { name: "Roti/Chapati", carbsPer100g: 52, category: "Indian", commonServing: "1 piece (40g)", servingCarbs: 21 },
  { name: "Paratha", carbsPer100g: 35, category: "Indian", commonServing: "1 piece (70g)", servingCarbs: 25 },
  { name: "Chicken Curry", carbsPer100g: 6, category: "Indian", commonServing: "1 cup (236g)", servingCarbs: 14 },
  { name: "Chicken Tikka Masala", carbsPer100g: 8, category: "Indian", commonServing: "1 cup (236g)", servingCarbs: 19 },
  { name: "Butter Chicken", carbsPer100g: 7, category: "Indian", commonServing: "1 cup (236g)", servingCarbs: 17 },
  { name: "Lamb Vindaloo", carbsPer100g: 5, category: "Indian", commonServing: "1 cup (236g)", servingCarbs: 12 },
  { name: "Palak Paneer", carbsPer100g: 6, category: "Indian", commonServing: "1 cup (236g)", servingCarbs: 14 },
  { name: "Chana Masala", carbsPer100g: 18, category: "Indian", commonServing: "1 cup (240g)", servingCarbs: 43 },
  { name: "Dal (Lentil Curry)", carbsPer100g: 20, category: "Indian", commonServing: "1 cup (198g)", servingCarbs: 40 },
  { name: "Aloo Gobi", carbsPer100g: 12, category: "Indian", commonServing: "1 cup (200g)", servingCarbs: 24 },
  { name: "Samosa", carbsPer100g: 28, category: "Indian", commonServing: "1 piece (85g)", servingCarbs: 24 },
  { name: "Pakora", carbsPer100g: 32, category: "Indian", commonServing: "4 pieces (80g)", servingCarbs: 26 },
  { name: "Mango Lassi", carbsPer100g: 14, category: "Indian", commonServing: "1 glass (250g)", servingCarbs: 35 },
  { name: "Gulab Jamun", carbsPer100g: 55, category: "Indian", commonServing: "2 pieces (60g)", servingCarbs: 33 },
  { name: "Kheer (Rice Pudding)", carbsPer100g: 22, category: "Indian", commonServing: "1/2 cup (130g)", servingCarbs: 29 },

  // === JAPANESE FOOD ===
  { name: "Sushi Roll (California)", carbsPer100g: 24, category: "Japanese", commonServing: "6 pieces (156g)", servingCarbs: 37 },
  { name: "Sushi Roll (Spicy Tuna)", carbsPer100g: 23, category: "Japanese", commonServing: "6 pieces (156g)", servingCarbs: 36 },
  { name: "Sushi Roll (Dragon Roll)", carbsPer100g: 25, category: "Japanese", commonServing: "8 pieces (220g)", servingCarbs: 55 },
  { name: "Sushi Roll (Philadelphia)", carbsPer100g: 22, category: "Japanese", commonServing: "6 pieces (156g)", servingCarbs: 34 },
  { name: "Sushi Roll (Rainbow)", carbsPer100g: 21, category: "Japanese", commonServing: "8 pieces (220g)", servingCarbs: 46 },
  { name: "Sashimi (Salmon)", carbsPer100g: 0, category: "Japanese", commonServing: "5 pieces (100g)", servingCarbs: 0 },
  { name: "Nigiri (Salmon)", carbsPer100g: 20, category: "Japanese", commonServing: "2 pieces (60g)", servingCarbs: 12 },
  { name: "Nigiri (Tuna)", carbsPer100g: 20, category: "Japanese", commonServing: "2 pieces (60g)", servingCarbs: 12 },
  { name: "Teriyaki Chicken", carbsPer100g: 12, category: "Japanese", commonServing: "1 cup (132g)", servingCarbs: 16 },
  { name: "Teriyaki Beef", carbsPer100g: 11, category: "Japanese", commonServing: "1 cup (140g)", servingCarbs: 15 },
  { name: "Chicken Katsu", carbsPer100g: 15, category: "Japanese", commonServing: "1 piece (150g)", servingCarbs: 23 },
  { name: "Tonkatsu (Pork Cutlet)", carbsPer100g: 14, category: "Japanese", commonServing: "1 piece (150g)", servingCarbs: 21 },
  { name: "Tempura (Shrimp)", carbsPer100g: 18, category: "Japanese", commonServing: "4 pieces (100g)", servingCarbs: 18 },
  { name: "Tempura (Vegetable)", carbsPer100g: 20, category: "Japanese", commonServing: "6 pieces (100g)", servingCarbs: 20 },
  { name: "Ramen (Pork)", carbsPer100g: 8, category: "Japanese", commonServing: "1 bowl (550g)", servingCarbs: 44 },
  { name: "Ramen (Chicken)", carbsPer100g: 7, category: "Japanese", commonServing: "1 bowl (550g)", servingCarbs: 39 },
  { name: "Udon Noodles", carbsPer100g: 22, category: "Japanese", commonServing: "1 cup (176g)", servingCarbs: 39 },
  { name: "Yakisoba", carbsPer100g: 19, category: "Japanese", commonServing: "1 cup (200g)", servingCarbs: 38 },
  { name: "Gyoza (Dumplings)", carbsPer100g: 24, category: "Japanese", commonServing: "6 pieces (144g)", servingCarbs: 35 },
  { name: "Miso Soup", carbsPer100g: 4, category: "Japanese", commonServing: "1 cup (240g)", servingCarbs: 10 },
  { name: "Edamame", carbsPer100g: 10, category: "Japanese", commonServing: "1 cup (155g)", servingCarbs: 15 },
  { name: "Mochi (Rice Cake)", carbsPer100g: 54, category: "Japanese", commonServing: "1 piece (44g)", servingCarbs: 24 },
  { name: "Mochi Ice Cream", carbsPer100g: 38, category: "Japanese", commonServing: "1 piece (45g)", servingCarbs: 17 },

  // === BREAKFAST ITEMS ===
  { name: "Pancakes (Plain)", carbsPer100g: 34, category: "Breakfast", commonServing: "2 pancakes (152g)", servingCarbs: 52 },
  { name: "Pancakes with Syrup", carbsPer100g: 42, category: "Breakfast", commonServing: "2 pancakes (200g)", servingCarbs: 84 },
  { name: "Waffles (Plain)", carbsPer100g: 33, category: "Breakfast", commonServing: "1 waffle (75g)", servingCarbs: 25 },
  { name: "Waffles with Syrup", carbsPer100g: 45, category: "Breakfast", commonServing: "1 waffle (115g)", servingCarbs: 52 },
  { name: "French Toast", carbsPer100g: 24, category: "Breakfast", commonServing: "2 slices (130g)", servingCarbs: 31 },
  { name: "French Toast with Syrup", carbsPer100g: 38, category: "Breakfast", commonServing: "2 slices (175g)", servingCarbs: 67 },
  { name: "Breakfast Burrito", carbsPer100g: 18, category: "Breakfast", commonServing: "1 burrito (220g)", servingCarbs: 40 },
  { name: "Breakfast Sandwich (Egg & Cheese)", carbsPer100g: 20, category: "Breakfast", commonServing: "1 sandwich (127g)", servingCarbs: 25 },
  { name: "Breakfast Sandwich (Bacon, Egg & Cheese)", carbsPer100g: 18, category: "Breakfast", commonServing: "1 sandwich (146g)", servingCarbs: 26 },
  { name: "Breakfast Sandwich (Sausage, Egg & Cheese)", carbsPer100g: 17, category: "Breakfast", commonServing: "1 sandwich (163g)", servingCarbs: 28 },
  { name: "Hash Browns (Homemade)", carbsPer100g: 35, category: "Breakfast", commonServing: "1 cup (156g)", servingCarbs: 55 },
  { name: "Home Fries", carbsPer100g: 28, category: "Breakfast", commonServing: "1 cup (200g)", servingCarbs: 56 },
  { name: "Eggs Benedict", carbsPer100g: 12, category: "Breakfast", commonServing: "1 serving (252g)", servingCarbs: 30 },
  { name: "Omelette (Plain)", carbsPer100g: 1, category: "Breakfast", commonServing: "3 egg omelette (180g)", servingCarbs: 2 },
  { name: "Omelette (Western/Denver)", carbsPer100g: 4, category: "Breakfast", commonServing: "1 omelette (200g)", servingCarbs: 8 },
  { name: "Scrambled Eggs", carbsPer100g: 1, category: "Breakfast", commonServing: "2 eggs (100g)", servingCarbs: 1 },
  { name: "Fried Eggs", carbsPer100g: 1, category: "Breakfast", commonServing: "2 eggs (100g)", servingCarbs: 1 },
  { name: "Muffin (Blueberry)", carbsPer100g: 51, category: "Breakfast", commonServing: "1 muffin (113g)", servingCarbs: 58 },
  { name: "Muffin (Chocolate Chip)", carbsPer100g: 54, category: "Breakfast", commonServing: "1 muffin (113g)", servingCarbs: 61 },
  { name: "Muffin (Banana Nut)", carbsPer100g: 50, category: "Breakfast", commonServing: "1 muffin (113g)", servingCarbs: 57 },
  { name: "Muffin (Bran)", carbsPer100g: 45, category: "Breakfast", commonServing: "1 muffin (113g)", servingCarbs: 51 },
  { name: "Croissant (Plain)", carbsPer100g: 45, category: "Breakfast", commonServing: "1 croissant (57g)", servingCarbs: 26 },
  { name: "Croissant (Chocolate)", carbsPer100g: 48, category: "Breakfast", commonServing: "1 croissant (74g)", servingCarbs: 36 },
  { name: "Danish (Cheese)", carbsPer100g: 45, category: "Breakfast", commonServing: "1 danish (71g)", servingCarbs: 32 },
  { name: "Danish (Fruit)", carbsPer100g: 50, category: "Breakfast", commonServing: "1 danish (71g)", servingCarbs: 36 },
  { name: "Cinnamon Roll", carbsPer100g: 48, category: "Breakfast", commonServing: "1 roll (85g)", servingCarbs: 41 },
  { name: "Donut (Glazed)", carbsPer100g: 51, category: "Breakfast", commonServing: "1 donut (64g)", servingCarbs: 33 },
  { name: "Donut (Chocolate Frosted)", carbsPer100g: 52, category: "Breakfast", commonServing: "1 donut (64g)", servingCarbs: 33 },
  { name: "Donut (Jelly Filled)", carbsPer100g: 48, category: "Breakfast", commonServing: "1 donut (85g)", servingCarbs: 41 },
  { name: "Donut (Boston Cream)", carbsPer100g: 45, category: "Breakfast", commonServing: "1 donut (100g)", servingCarbs: 45 },
  { name: "Donut Hole", carbsPer100g: 52, category: "Breakfast", commonServing: "4 holes (50g)", servingCarbs: 26 },
  { name: "Scone", carbsPer100g: 45, category: "Breakfast", commonServing: "1 scone (70g)", servingCarbs: 32 },
  { name: "Biscuits and Gravy", carbsPer100g: 18, category: "Breakfast", commonServing: "1 serving (300g)", servingCarbs: 54 },
  { name: "Grits (Cooked)", carbsPer100g: 13, category: "Breakfast", commonServing: "1 cup (242g)", servingCarbs: 31 },
  { name: "Cream of Wheat", carbsPer100g: 11, category: "Breakfast", commonServing: "1 cup (241g)", servingCarbs: 27 },
  { name: "Breakfast Potatoes", carbsPer100g: 24, category: "Breakfast", commonServing: "1 cup (150g)", servingCarbs: 36 },
  { name: "Corned Beef Hash", carbsPer100g: 10, category: "Breakfast", commonServing: "1 cup (236g)", servingCarbs: 24 },
  { name: "Toast with Butter", carbsPer100g: 45, category: "Breakfast", commonServing: "1 slice (33g)", servingCarbs: 15 },
  { name: "Toast with Jam", carbsPer100g: 52, category: "Breakfast", commonServing: "1 slice (40g)", servingCarbs: 21 },
  { name: "Granola Bar", carbsPer100g: 66, category: "Breakfast", commonServing: "1 bar (35g)", servingCarbs: 23 },
  { name: "Pop-Tart", carbsPer100g: 69, category: "Breakfast", commonServing: "1 pastry (50g)", servingCarbs: 35 },
  { name: "Toaster Strudel", carbsPer100g: 52, category: "Breakfast", commonServing: "1 pastry (54g)", servingCarbs: 28 },

  // === BEVERAGES - SODAS ===
  { name: "Coca-Cola", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 39 },
  { name: "Coca-Cola (20 oz bottle)", carbsPer100g: 11, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 65 },
  { name: "Pepsi", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 41 },
  { name: "Pepsi (20 oz bottle)", carbsPer100g: 11, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 69 },
  { name: "Sprite", carbsPer100g: 10, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 38 },
  { name: "7-Up", carbsPer100g: 10, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 38 },
  { name: "Mountain Dew", carbsPer100g: 12, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 46 },
  { name: "Mountain Dew (20 oz)", carbsPer100g: 12, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 77 },
  { name: "Dr Pepper", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 40 },
  { name: "Root Beer (A&W)", carbsPer100g: 12, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 45 },
  { name: "Root Beer (Barq's)", carbsPer100g: 12, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 44 },
  { name: "Root Beer (Mug)", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 41 },
  { name: "Orange Soda (Fanta)", carbsPer100g: 12, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 44 },
  { name: "Orange Soda (Crush)", carbsPer100g: 13, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 47 },
  { name: "Orange Soda (Sunkist)", carbsPer100g: 13, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 52 },
  { name: "Grape Soda (Fanta)", carbsPer100g: 13, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 48 },
  { name: "Cream Soda", carbsPer100g: 13, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 49 },
  { name: "Ginger Ale (Canada Dry)", carbsPer100g: 9, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 32 },
  { name: "Ginger Ale (Schweppes)", carbsPer100g: 9, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 34 },
  { name: "Sierra Mist/Starry", carbsPer100g: 10, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 39 },
  { name: "Squirt", carbsPer100g: 10, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 39 },
  { name: "Cherry Coke", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 42 },
  { name: "Vanilla Coke", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 42 },

  // === BEVERAGES - DIET/ZERO SODAS ===
  { name: "Diet Coke", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Coke Zero", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Diet Pepsi", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Pepsi Zero Sugar", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Sprite Zero", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Diet Dr Pepper", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Diet Mountain Dew", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Mountain Dew Zero", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Diet A&W Root Beer", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Fanta Zero", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },

  // === BEVERAGES - JUICES ===
  { name: "Orange Juice", carbsPer100g: 10, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 25 },
  { name: "Orange Juice (Tropicana)", carbsPer100g: 10, category: "Beverages", commonServing: "1 cup (240ml)", servingCarbs: 24 },
  { name: "Orange Juice (Minute Maid)", carbsPer100g: 11, category: "Beverages", commonServing: "1 cup (240ml)", servingCarbs: 26 },
  { name: "Apple Juice", carbsPer100g: 11, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 27 },
  { name: "Apple Juice (Mott's)", carbsPer100g: 11, category: "Beverages", commonServing: "8 oz box (236ml)", servingCarbs: 26 },
  { name: "Grape Juice", carbsPer100g: 14, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 35 },
  { name: "Grape Juice (Welch's)", carbsPer100g: 15, category: "Beverages", commonServing: "1 cup (240ml)", servingCarbs: 36 },
  { name: "Cranberry Juice", carbsPer100g: 12, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 30 },
  { name: "Cranberry Juice Cocktail", carbsPer100g: 13, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 32 },
  { name: "Grapefruit Juice", carbsPer100g: 9, category: "Beverages", commonServing: "1 cup (247g)", servingCarbs: 22 },
  { name: "Pineapple Juice", carbsPer100g: 13, category: "Beverages", commonServing: "1 cup (250g)", servingCarbs: 33 },
  { name: "Tomato Juice", carbsPer100g: 4, category: "Beverages", commonServing: "1 cup (243g)", servingCarbs: 10 },
  { name: "V8 Vegetable Juice", carbsPer100g: 4, category: "Beverages", commonServing: "8 oz (240ml)", servingCarbs: 10 },
  { name: "V8 Splash", carbsPer100g: 9, category: "Beverages", commonServing: "8 oz (240ml)", servingCarbs: 22 },
  { name: "Lemonade", carbsPer100g: 11, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 27 },
  { name: "Lemonade (Minute Maid)", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 40 },
  { name: "Pink Lemonade", carbsPer100g: 11, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 27 },
  { name: "Fruit Punch", carbsPer100g: 12, category: "Beverages", commonServing: "1 cup (248g)", servingCarbs: 30 },
  { name: "Hawaiian Punch", carbsPer100g: 12, category: "Beverages", commonServing: "8 oz (240ml)", servingCarbs: 29 },
  { name: "Capri Sun", carbsPer100g: 7, category: "Beverages", commonServing: "1 pouch (177ml)", servingCarbs: 13 },
  { name: "Kool-Aid", carbsPer100g: 10, category: "Beverages", commonServing: "1 cup (240ml)", servingCarbs: 24 },
  { name: "Sunny D", carbsPer100g: 11, category: "Beverages", commonServing: "8 oz (240ml)", servingCarbs: 26 },

  // === BEVERAGES - SPORTS & ENERGY DRINKS ===
  { name: "Gatorade (Original)", carbsPer100g: 6, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 35 },
  { name: "Gatorade (32 oz)", carbsPer100g: 6, category: "Beverages", commonServing: "32 oz bottle (946ml)", servingCarbs: 57 },
  { name: "Gatorade Zero", carbsPer100g: 0, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 0 },
  { name: "Powerade", carbsPer100g: 6, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 34 },
  { name: "Powerade Zero", carbsPer100g: 0, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 0 },
  { name: "Body Armor", carbsPer100g: 8, category: "Beverages", commonServing: "16 oz bottle (473ml)", servingCarbs: 38 },
  { name: "Body Armor Lyte", carbsPer100g: 2, category: "Beverages", commonServing: "16 oz bottle (473ml)", servingCarbs: 9 },
  { name: "Prime Hydration", carbsPer100g: 2, category: "Beverages", commonServing: "16.9 oz bottle (500ml)", servingCarbs: 10 },
  { name: "Red Bull", carbsPer100g: 11, category: "Beverages", commonServing: "8.4 oz can (250ml)", servingCarbs: 27 },
  { name: "Red Bull (12 oz)", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 39 },
  { name: "Red Bull Sugar Free", carbsPer100g: 0, category: "Beverages", commonServing: "8.4 oz can (250ml)", servingCarbs: 3 },
  { name: "Monster Energy", carbsPer100g: 11, category: "Beverages", commonServing: "16 oz can (473ml)", servingCarbs: 54 },
  { name: "Monster Energy (24 oz)", carbsPer100g: 11, category: "Beverages", commonServing: "24 oz can (710ml)", servingCarbs: 81 },
  { name: "Monster Zero Ultra", carbsPer100g: 0, category: "Beverages", commonServing: "16 oz can (473ml)", servingCarbs: 0 },
  { name: "Rockstar Energy", carbsPer100g: 12, category: "Beverages", commonServing: "16 oz can (473ml)", servingCarbs: 60 },
  { name: "Rockstar Sugar Free", carbsPer100g: 0, category: "Beverages", commonServing: "16 oz can (473ml)", servingCarbs: 0 },
  { name: "NOS Energy", carbsPer100g: 12, category: "Beverages", commonServing: "16 oz can (473ml)", servingCarbs: 54 },
  { name: "Bang Energy", carbsPer100g: 0, category: "Beverages", commonServing: "16 oz can (473ml)", servingCarbs: 0 },
  { name: "Celsius", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 2 },
  { name: "5-Hour Energy", carbsPer100g: 0, category: "Beverages", commonServing: "1 shot (57ml)", servingCarbs: 0 },
  { name: "Vitamin Water", carbsPer100g: 6, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 33 },
  { name: "Vitamin Water Zero", carbsPer100g: 0, category: "Beverages", commonServing: "20 oz bottle (591ml)", servingCarbs: 0 },

  // === BEVERAGES - COFFEE DRINKS ===
  { name: "Coffee (Black)", carbsPer100g: 0, category: "Beverages", commonServing: "1 cup (240ml)", servingCarbs: 0 },
  { name: "Coffee with Sugar", carbsPer100g: 2, category: "Beverages", commonServing: "1 cup (240ml)", servingCarbs: 5 },
  { name: "Latte", carbsPer100g: 5, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 18 },
  { name: "Latte (16 oz)", carbsPer100g: 5, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 24 },
  { name: "Cappuccino", carbsPer100g: 4, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 14 },
  { name: "Mocha", carbsPer100g: 8, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 28 },
  { name: "Mocha (16 oz)", carbsPer100g: 8, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 38 },
  { name: "Caramel Macchiato", carbsPer100g: 8, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 28 },
  { name: "Vanilla Latte", carbsPer100g: 9, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 32 },
  { name: "Frappuccino (Caramel)", carbsPer100g: 12, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 43 },
  { name: "Frappuccino (Mocha)", carbsPer100g: 11, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 39 },
  { name: "Iced Coffee", carbsPer100g: 0, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 0 },
  { name: "Iced Coffee (Sweetened)", carbsPer100g: 6, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 28 },
  { name: "Cold Brew Coffee", carbsPer100g: 0, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 0 },
  { name: "Starbucks Bottled Frappuccino", carbsPer100g: 12, category: "Beverages", commonServing: "13.7 oz bottle (405ml)", servingCarbs: 49 },
  { name: "Dunkin' Iced Coffee (Medium)", carbsPer100g: 6, category: "Beverages", commonServing: "24 oz (710ml)", servingCarbs: 43 },
  { name: "McDonald's Iced Coffee (Medium)", carbsPer100g: 6, category: "Beverages", commonServing: "21 oz (621ml)", servingCarbs: 37 },

  // === BEVERAGES - TEA ===
  { name: "Tea (Unsweetened)", carbsPer100g: 0, category: "Beverages", commonServing: "1 cup (240ml)", servingCarbs: 0 },
  { name: "Sweet Tea", carbsPer100g: 9, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 43 },
  { name: "Sweet Tea (32 oz)", carbsPer100g: 9, category: "Beverages", commonServing: "32 oz (946ml)", servingCarbs: 85 },
  { name: "Arnold Palmer (Half & Half)", carbsPer100g: 9, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 43 },
  { name: "Arizona Iced Tea", carbsPer100g: 9, category: "Beverages", commonServing: "23 oz can (680ml)", servingCarbs: 61 },
  { name: "Arizona Green Tea", carbsPer100g: 7, category: "Beverages", commonServing: "23 oz can (680ml)", servingCarbs: 48 },
  { name: "Brisk Iced Tea", carbsPer100g: 7, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 25 },
  { name: "Snapple (Peach Tea)", carbsPer100g: 10, category: "Beverages", commonServing: "16 oz bottle (473ml)", servingCarbs: 47 },
  { name: "Snapple (Lemon Tea)", carbsPer100g: 10, category: "Beverages", commonServing: "16 oz bottle (473ml)", servingCarbs: 47 },
  { name: "Pure Leaf Sweet Tea", carbsPer100g: 9, category: "Beverages", commonServing: "18.5 oz bottle (547ml)", servingCarbs: 49 },
  { name: "Pure Leaf Unsweetened", carbsPer100g: 0, category: "Beverages", commonServing: "18.5 oz bottle (547ml)", servingCarbs: 0 },
  { name: "Gold Peak Sweet Tea", carbsPer100g: 9, category: "Beverages", commonServing: "18.5 oz bottle (547ml)", servingCarbs: 49 },
  { name: "Chai Tea Latte", carbsPer100g: 10, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 36 },
  { name: "Boba/Bubble Tea", carbsPer100g: 15, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 71 },
  { name: "Thai Iced Tea", carbsPer100g: 12, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 57 },

  // === BEVERAGES - ALCOHOLIC (BEER) ===
  { name: "Beer (Regular)", carbsPer100g: 3, category: "Alcohol", commonServing: "12 oz can/bottle (355ml)", servingCarbs: 13 },
  { name: "Beer (Light)", carbsPer100g: 2, category: "Alcohol", commonServing: "12 oz can/bottle (355ml)", servingCarbs: 6 },
  { name: "Budweiser", carbsPer100g: 3, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 11 },
  { name: "Bud Light", carbsPer100g: 2, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 7 },
  { name: "Miller Lite", carbsPer100g: 1, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 3 },
  { name: "Miller High Life", carbsPer100g: 4, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 13 },
  { name: "Coors Light", carbsPer100g: 1, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 5 },
  { name: "Coors Banquet", carbsPer100g: 3, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 12 },
  { name: "Corona Extra", carbsPer100g: 4, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 14 },
  { name: "Corona Light", carbsPer100g: 1, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 5 },
  { name: "Heineken", carbsPer100g: 3, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 11 },
  { name: "Heineken Light", carbsPer100g: 2, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 7 },
  { name: "Stella Artois", carbsPer100g: 3, category: "Alcohol", commonServing: "11.2 oz (330ml)", servingCarbs: 10 },
  { name: "Modelo Especial", carbsPer100g: 4, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 14 },
  { name: "Dos Equis", carbsPer100g: 3, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 11 },
  { name: "Guinness Draught", carbsPer100g: 3, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 10 },
  { name: "Blue Moon", carbsPer100g: 4, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 14 },
  { name: "Sam Adams Boston Lager", carbsPer100g: 5, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 18 },
  { name: "IPA (Craft Beer)", carbsPer100g: 4, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 14 },
  { name: "Michelob Ultra", carbsPer100g: 1, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 3 },
  { name: "Busch Light", carbsPer100g: 1, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 3 },
  { name: "Natural Light", carbsPer100g: 1, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 3 },
  { name: "PBR (Pabst Blue Ribbon)", carbsPer100g: 3, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 12 },

  // === BEVERAGES - ALCOHOLIC (WINE) ===
  { name: "Red Wine", carbsPer100g: 2.5, category: "Alcohol", commonServing: "5 oz glass (148ml)", servingCarbs: 4 },
  { name: "White Wine", carbsPer100g: 2.5, category: "Alcohol", commonServing: "5 oz glass (148ml)", servingCarbs: 4 },
  { name: "Rosé Wine", carbsPer100g: 3, category: "Alcohol", commonServing: "5 oz glass (148ml)", servingCarbs: 4 },
  { name: "Champagne/Sparkling Wine", carbsPer100g: 1.5, category: "Alcohol", commonServing: "5 oz glass (148ml)", servingCarbs: 2 },
  { name: "Sweet Wine (Moscato)", carbsPer100g: 8, category: "Alcohol", commonServing: "5 oz glass (148ml)", servingCarbs: 12 },
  { name: "Port Wine", carbsPer100g: 12, category: "Alcohol", commonServing: "3 oz glass (89ml)", servingCarbs: 11 },
  { name: "Sangria", carbsPer100g: 9, category: "Alcohol", commonServing: "6 oz glass (177ml)", servingCarbs: 16 },

  // === BEVERAGES - ALCOHOLIC (LIQUOR & MIXED DRINKS) ===
  { name: "Vodka", carbsPer100g: 0, category: "Alcohol", commonServing: "1.5 oz shot (44ml)", servingCarbs: 0 },
  { name: "Whiskey/Bourbon", carbsPer100g: 0, category: "Alcohol", commonServing: "1.5 oz shot (44ml)", servingCarbs: 0 },
  { name: "Rum", carbsPer100g: 0, category: "Alcohol", commonServing: "1.5 oz shot (44ml)", servingCarbs: 0 },
  { name: "Gin", carbsPer100g: 0, category: "Alcohol", commonServing: "1.5 oz shot (44ml)", servingCarbs: 0 },
  { name: "Tequila", carbsPer100g: 0, category: "Alcohol", commonServing: "1.5 oz shot (44ml)", servingCarbs: 0 },
  { name: "Margarita", carbsPer100g: 13, category: "Alcohol", commonServing: "8 oz glass (240ml)", servingCarbs: 31 },
  { name: "Margarita (Frozen)", carbsPer100g: 18, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 64 },
  { name: "Pina Colada", carbsPer100g: 22, category: "Alcohol", commonServing: "8 oz glass (240ml)", servingCarbs: 53 },
  { name: "Daiquiri", carbsPer100g: 15, category: "Alcohol", commonServing: "6 oz glass (177ml)", servingCarbs: 27 },
  { name: "Mojito", carbsPer100g: 10, category: "Alcohol", commonServing: "8 oz glass (240ml)", servingCarbs: 24 },
  { name: "Long Island Iced Tea", carbsPer100g: 10, category: "Alcohol", commonServing: "8 oz glass (240ml)", servingCarbs: 24 },
  { name: "Cosmopolitan", carbsPer100g: 10, category: "Alcohol", commonServing: "4 oz (118ml)", servingCarbs: 12 },
  { name: "Martini", carbsPer100g: 0.5, category: "Alcohol", commonServing: "4 oz (118ml)", servingCarbs: 1 },
  { name: "Gin and Tonic", carbsPer100g: 8, category: "Alcohol", commonServing: "8 oz glass (240ml)", servingCarbs: 19 },
  { name: "Vodka Soda", carbsPer100g: 0, category: "Alcohol", commonServing: "8 oz glass (240ml)", servingCarbs: 0 },
  { name: "Rum and Coke", carbsPer100g: 10, category: "Alcohol", commonServing: "8 oz glass (240ml)", servingCarbs: 24 },
  { name: "Whiskey Sour", carbsPer100g: 12, category: "Alcohol", commonServing: "6 oz glass (177ml)", servingCarbs: 21 },
  { name: "Moscow Mule", carbsPer100g: 8, category: "Alcohol", commonServing: "8 oz (240ml)", servingCarbs: 19 },
  { name: "Bloody Mary", carbsPer100g: 4, category: "Alcohol", commonServing: "12 oz (355ml)", servingCarbs: 14 },
  { name: "Mimosa", carbsPer100g: 5, category: "Alcohol", commonServing: "6 oz glass (177ml)", servingCarbs: 9 },
  { name: "White Russian", carbsPer100g: 12, category: "Alcohol", commonServing: "6 oz glass (177ml)", servingCarbs: 21 },
  { name: "Irish Coffee", carbsPer100g: 8, category: "Alcohol", commonServing: "8 oz (240ml)", servingCarbs: 19 },

  // === BEVERAGES - ALCOHOLIC (HARD SELTZERS & COOLERS) ===
  { name: "White Claw", carbsPer100g: 1, category: "Alcohol", commonServing: "12 oz can (355ml)", servingCarbs: 2 },
  { name: "Truly Hard Seltzer", carbsPer100g: 0.5, category: "Alcohol", commonServing: "12 oz can (355ml)", servingCarbs: 2 },
  { name: "High Noon", carbsPer100g: 1, category: "Alcohol", commonServing: "12 oz can (355ml)", servingCarbs: 3 },
  { name: "Smirnoff Ice", carbsPer100g: 10, category: "Alcohol", commonServing: "11.2 oz bottle (330ml)", servingCarbs: 33 },
  { name: "Mike's Hard Lemonade", carbsPer100g: 13, category: "Alcohol", commonServing: "11.2 oz bottle (330ml)", servingCarbs: 43 },
  { name: "Twisted Tea", carbsPer100g: 8, category: "Alcohol", commonServing: "12 oz can (355ml)", servingCarbs: 28 },
  { name: "Seagram's Escapes", carbsPer100g: 11, category: "Alcohol", commonServing: "11.2 oz bottle (330ml)", servingCarbs: 36 },

  // === BEVERAGES - OTHER ===
  { name: "Hot Chocolate", carbsPer100g: 10, category: "Beverages", commonServing: "8 oz cup (240ml)", servingCarbs: 24 },
  { name: "Hot Chocolate with Whipped Cream", carbsPer100g: 12, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 43 },
  { name: "Milkshake (Vanilla)", carbsPer100g: 16, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 57 },
  { name: "Milkshake (Chocolate)", carbsPer100g: 18, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 64 },
  { name: "Milkshake (Strawberry)", carbsPer100g: 17, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 60 },
  { name: "Smoothie (Fruit)", carbsPer100g: 12, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 57 },
  { name: "Smoothie (Green)", carbsPer100g: 8, category: "Beverages", commonServing: "16 oz (473ml)", servingCarbs: 38 },
  { name: "Protein Shake", carbsPer100g: 8, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 28 },
  { name: "Ensure (Original)", carbsPer100g: 15, category: "Beverages", commonServing: "8 oz bottle (237ml)", servingCarbs: 36 },
  { name: "Pedialyte", carbsPer100g: 2, category: "Beverages", commonServing: "12 oz bottle (355ml)", servingCarbs: 7 },
  { name: "Coconut Water", carbsPer100g: 4, category: "Beverages", commonServing: "11 oz container (325ml)", servingCarbs: 13 },
  { name: "Sparkling Water", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },
  { name: "Tonic Water", carbsPer100g: 9, category: "Beverages", commonServing: "12 oz (355ml)", servingCarbs: 32 },
  { name: "Club Soda", carbsPer100g: 0, category: "Beverages", commonServing: "12 oz can (355ml)", servingCarbs: 0 },

  // === DESSERTS ===
  { name: "Chocolate Cake", carbsPer100g: 50, category: "Desserts", commonServing: "1 slice (64g)", servingCarbs: 32 },
  { name: "Chocolate Cake with Frosting", carbsPer100g: 55, category: "Desserts", commonServing: "1 slice (95g)", servingCarbs: 52 },
  { name: "Yellow Cake with Frosting", carbsPer100g: 52, category: "Desserts", commonServing: "1 slice (95g)", servingCarbs: 49 },
  { name: "Red Velvet Cake", carbsPer100g: 48, category: "Desserts", commonServing: "1 slice (95g)", servingCarbs: 46 },
  { name: "Carrot Cake", carbsPer100g: 45, category: "Desserts", commonServing: "1 slice (95g)", servingCarbs: 43 },
  { name: "Pound Cake", carbsPer100g: 50, category: "Desserts", commonServing: "1 slice (55g)", servingCarbs: 28 },
  { name: "Angel Food Cake", carbsPer100g: 54, category: "Desserts", commonServing: "1 slice (50g)", servingCarbs: 27 },
  { name: "Cheesecake (Plain)", carbsPer100g: 32, category: "Desserts", commonServing: "1 slice (80g)", servingCarbs: 26 },
  { name: "Cheesecake (Strawberry)", carbsPer100g: 35, category: "Desserts", commonServing: "1 slice (100g)", servingCarbs: 35 },
  { name: "Cheesecake (Chocolate)", carbsPer100g: 38, category: "Desserts", commonServing: "1 slice (100g)", servingCarbs: 38 },
  { name: "Cheesecake Factory Original", carbsPer100g: 35, category: "Desserts", commonServing: "1 slice (180g)", servingCarbs: 63 },
  { name: "Apple Pie", carbsPer100g: 34, category: "Desserts", commonServing: "1 slice (125g)", servingCarbs: 43 },
  { name: "Apple Pie a la Mode", carbsPer100g: 32, category: "Desserts", commonServing: "1 slice with ice cream (175g)", servingCarbs: 56 },
  { name: "Pumpkin Pie", carbsPer100g: 26, category: "Desserts", commonServing: "1 slice (133g)", servingCarbs: 35 },
  { name: "Pecan Pie", carbsPer100g: 52, category: "Desserts", commonServing: "1 slice (115g)", servingCarbs: 60 },
  { name: "Cherry Pie", carbsPer100g: 36, category: "Desserts", commonServing: "1 slice (125g)", servingCarbs: 45 },
  { name: "Blueberry Pie", carbsPer100g: 35, category: "Desserts", commonServing: "1 slice (125g)", servingCarbs: 44 },
  { name: "Key Lime Pie", carbsPer100g: 38, category: "Desserts", commonServing: "1 slice (113g)", servingCarbs: 43 },
  { name: "Lemon Meringue Pie", carbsPer100g: 42, category: "Desserts", commonServing: "1 slice (113g)", servingCarbs: 47 },
  { name: "Banana Cream Pie", carbsPer100g: 28, category: "Desserts", commonServing: "1 slice (130g)", servingCarbs: 36 },
  { name: "Coconut Cream Pie", carbsPer100g: 32, category: "Desserts", commonServing: "1 slice (130g)", servingCarbs: 42 },
  { name: "Chocolate Chip Cookies", carbsPer100g: 68, category: "Desserts", commonServing: "1 cookie (16g)", servingCarbs: 11 },
  { name: "Chocolate Chip Cookies (Large/Bakery)", carbsPer100g: 68, category: "Desserts", commonServing: "1 cookie (55g)", servingCarbs: 37 },
  { name: "Oreo Cookies", carbsPer100g: 70, category: "Desserts", commonServing: "3 cookies (34g)", servingCarbs: 24 },
  { name: "Sugar Cookies", carbsPer100g: 65, category: "Desserts", commonServing: "1 cookie (15g)", servingCarbs: 10 },
  { name: "Oatmeal Raisin Cookies", carbsPer100g: 64, category: "Desserts", commonServing: "1 cookie (18g)", servingCarbs: 12 },
  { name: "Peanut Butter Cookies", carbsPer100g: 58, category: "Desserts", commonServing: "1 cookie (18g)", servingCarbs: 10 },
  { name: "Snickerdoodle Cookies", carbsPer100g: 62, category: "Desserts", commonServing: "1 cookie (18g)", servingCarbs: 11 },
  { name: "Girl Scout Thin Mints", carbsPer100g: 68, category: "Desserts", commonServing: "4 cookies (32g)", servingCarbs: 22 },
  { name: "Girl Scout Samoas", carbsPer100g: 55, category: "Desserts", commonServing: "2 cookies (30g)", servingCarbs: 17 },
  { name: "Chips Ahoy", carbsPer100g: 68, category: "Desserts", commonServing: "3 cookies (33g)", servingCarbs: 22 },
  { name: "Nutter Butter", carbsPer100g: 64, category: "Desserts", commonServing: "4 cookies (29g)", servingCarbs: 19 },
  { name: "Brownies", carbsPer100g: 63, category: "Desserts", commonServing: "1 brownie (56g)", servingCarbs: 35 },
  { name: "Brownies with Frosting", carbsPer100g: 68, category: "Desserts", commonServing: "1 brownie (70g)", servingCarbs: 48 },
  { name: "Blondie", carbsPer100g: 60, category: "Desserts", commonServing: "1 blondie (56g)", servingCarbs: 34 },
  { name: "Cupcake (Vanilla)", carbsPer100g: 55, category: "Desserts", commonServing: "1 cupcake (55g)", servingCarbs: 30 },
  { name: "Cupcake (Chocolate)", carbsPer100g: 58, category: "Desserts", commonServing: "1 cupcake (55g)", servingCarbs: 32 },
  { name: "Cupcake (Red Velvet)", carbsPer100g: 52, category: "Desserts", commonServing: "1 cupcake (55g)", servingCarbs: 29 },
  { name: "Rice Krispies Treat", carbsPer100g: 78, category: "Desserts", commonServing: "1 treat (22g)", servingCarbs: 17 },
  { name: "Banana Split", carbsPer100g: 25, category: "Desserts", commonServing: "1 serving (340g)", servingCarbs: 85 },
  { name: "Sundae (Hot Fudge)", carbsPer100g: 28, category: "Desserts", commonServing: "1 sundae (200g)", servingCarbs: 56 },
  { name: "Ice Cream Sandwich", carbsPer100g: 35, category: "Desserts", commonServing: "1 sandwich (70g)", servingCarbs: 25 },
  { name: "Drumstick (Ice Cream Cone)", carbsPer100g: 32, category: "Desserts", commonServing: "1 cone (93g)", servingCarbs: 30 },
  { name: "Klondike Bar", carbsPer100g: 32, category: "Desserts", commonServing: "1 bar (75g)", servingCarbs: 24 },
  { name: "Fudgesicle", carbsPer100g: 22, category: "Desserts", commonServing: "1 bar (53g)", servingCarbs: 12 },
  { name: "Popsicle", carbsPer100g: 25, category: "Desserts", commonServing: "1 popsicle (52g)", servingCarbs: 13 },
  { name: "Pudding (Chocolate)", carbsPer100g: 18, category: "Desserts", commonServing: "1 cup (113g)", servingCarbs: 20 },
  { name: "Pudding (Vanilla)", carbsPer100g: 17, category: "Desserts", commonServing: "1 cup (113g)", servingCarbs: 19 },
  { name: "Jell-O (Regular)", carbsPer100g: 17, category: "Desserts", commonServing: "1 cup (140g)", servingCarbs: 24 },
  { name: "Jell-O (Sugar Free)", carbsPer100g: 0, category: "Desserts", commonServing: "1 cup (117g)", servingCarbs: 0 },
  { name: "Creme Brulee", carbsPer100g: 25, category: "Desserts", commonServing: "1 serving (120g)", servingCarbs: 30 },
  { name: "Chocolate Mousse", carbsPer100g: 20, category: "Desserts", commonServing: "1/2 cup (115g)", servingCarbs: 23 },

  // === CANDY & CHOCOLATE ===
  { name: "Snickers Bar", carbsPer100g: 60, category: "Candy", commonServing: "1 bar (52g)", servingCarbs: 31 },
  { name: "Snickers (Fun Size)", carbsPer100g: 60, category: "Candy", commonServing: "1 bar (17g)", servingCarbs: 10 },
  { name: "Milky Way Bar", carbsPer100g: 66, category: "Candy", commonServing: "1 bar (52g)", servingCarbs: 34 },
  { name: "3 Musketeers Bar", carbsPer100g: 72, category: "Candy", commonServing: "1 bar (54g)", servingCarbs: 39 },
  { name: "Twix Bar", carbsPer100g: 63, category: "Candy", commonServing: "1 package (50g)", servingCarbs: 32 },
  { name: "Kit Kat Bar", carbsPer100g: 62, category: "Candy", commonServing: "1 bar (42g)", servingCarbs: 26 },
  { name: "Reese's Peanut Butter Cups", carbsPer100g: 55, category: "Candy", commonServing: "2 cups (42g)", servingCarbs: 23 },
  { name: "Reese's Pieces", carbsPer100g: 65, category: "Candy", commonServing: "1 package (43g)", servingCarbs: 28 },
  { name: "M&M's (Plain)", carbsPer100g: 71, category: "Candy", commonServing: "1 package (48g)", servingCarbs: 34 },
  { name: "M&M's (Peanut)", carbsPer100g: 63, category: "Candy", commonServing: "1 package (49g)", servingCarbs: 31 },
  { name: "Hershey's Milk Chocolate Bar", carbsPer100g: 60, category: "Candy", commonServing: "1 bar (43g)", servingCarbs: 26 },
  { name: "Hershey's Kisses", carbsPer100g: 60, category: "Candy", commonServing: "9 kisses (41g)", servingCarbs: 25 },
  { name: "Butterfinger Bar", carbsPer100g: 65, category: "Candy", commonServing: "1 bar (53g)", servingCarbs: 34 },
  { name: "Baby Ruth Bar", carbsPer100g: 62, category: "Candy", commonServing: "1 bar (53g)", servingCarbs: 33 },
  { name: "PayDay Bar", carbsPer100g: 50, category: "Candy", commonServing: "1 bar (52g)", servingCarbs: 26 },
  { name: "Heath Bar", carbsPer100g: 62, category: "Candy", commonServing: "1 bar (39g)", servingCarbs: 24 },
  { name: "Almond Joy", carbsPer100g: 55, category: "Candy", commonServing: "1 bar (45g)", servingCarbs: 25 },
  { name: "Mounds Bar", carbsPer100g: 58, category: "Candy", commonServing: "1 bar (49g)", servingCarbs: 28 },
  { name: "100 Grand Bar", carbsPer100g: 65, category: "Candy", commonServing: "1 bar (43g)", servingCarbs: 28 },
  { name: "York Peppermint Pattie", carbsPer100g: 75, category: "Candy", commonServing: "1 patty (39g)", servingCarbs: 29 },
  { name: "Skittles", carbsPer100g: 91, category: "Candy", commonServing: "1 package (61g)", servingCarbs: 55 },
  { name: "Starburst", carbsPer100g: 83, category: "Candy", commonServing: "1 package (59g)", servingCarbs: 49 },
  { name: "Sour Patch Kids", carbsPer100g: 88, category: "Candy", commonServing: "1 package (56g)", servingCarbs: 49 },
  { name: "Swedish Fish", carbsPer100g: 87, category: "Candy", commonServing: "7 pieces (40g)", servingCarbs: 35 },
  { name: "Gummy Bears", carbsPer100g: 77, category: "Candy", commonServing: "17 bears (40g)", servingCarbs: 31 },
  { name: "Twizzlers", carbsPer100g: 75, category: "Candy", commonServing: "4 pieces (45g)", servingCarbs: 34 },
  { name: "Jolly Ranchers", carbsPer100g: 93, category: "Candy", commonServing: "3 pieces (17g)", servingCarbs: 16 },
  { name: "Life Savers", carbsPer100g: 100, category: "Candy", commonServing: "4 pieces (15g)", servingCarbs: 15 },
  { name: "Nerds", carbsPer100g: 93, category: "Candy", commonServing: "1 box (46g)", servingCarbs: 43 },
  { name: "Smarties", carbsPer100g: 100, category: "Candy", commonServing: "1 roll (7g)", servingCarbs: 7 },
  { name: "Tootsie Roll", carbsPer100g: 80, category: "Candy", commonServing: "6 pieces (40g)", servingCarbs: 32 },
  { name: "Tootsie Pop", carbsPer100g: 95, category: "Candy", commonServing: "1 pop (17g)", servingCarbs: 16 },
  { name: "Blow Pop", carbsPer100g: 95, category: "Candy", commonServing: "1 pop (18g)", servingCarbs: 17 },
  { name: "Dum Dum Pop", carbsPer100g: 100, category: "Candy", commonServing: "1 pop (6g)", servingCarbs: 6 },
  { name: "Cotton Candy", carbsPer100g: 100, category: "Candy", commonServing: "1 serving (28g)", servingCarbs: 28 },
  { name: "Caramel Candy", carbsPer100g: 77, category: "Candy", commonServing: "5 pieces (41g)", servingCarbs: 32 },
  { name: "Milk Duds", carbsPer100g: 75, category: "Candy", commonServing: "1 box (49g)", servingCarbs: 37 },
  { name: "Raisinets", carbsPer100g: 68, category: "Candy", commonServing: "1 box (49g)", servingCarbs: 33 },
  { name: "Junior Mints", carbsPer100g: 78, category: "Candy", commonServing: "1 box (52g)", servingCarbs: 41 },
  { name: "Whoppers", carbsPer100g: 72, category: "Candy", commonServing: "18 pieces (41g)", servingCarbs: 30 },

  // === SNACKS ===
  { name: "Lay's Classic Potato Chips", carbsPer100g: 50, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 14 },
  { name: "Lay's Potato Chips (Big Grab)", carbsPer100g: 50, category: "Snacks", commonServing: "3 oz bag (85g)", servingCarbs: 43 },
  { name: "Ruffles Potato Chips", carbsPer100g: 50, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 14 },
  { name: "Pringles", carbsPer100g: 54, category: "Snacks", commonServing: "16 chips (28g)", servingCarbs: 15 },
  { name: "Kettle Chips", carbsPer100g: 52, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 15 },
  { name: "Cape Cod Chips", carbsPer100g: 50, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 14 },
  { name: "BBQ Chips", carbsPer100g: 52, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 15 },
  { name: "Sour Cream & Onion Chips", carbsPer100g: 52, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 15 },
  { name: "Doritos (Nacho Cheese)", carbsPer100g: 64, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 18 },
  { name: "Doritos (Cool Ranch)", carbsPer100g: 64, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 18 },
  { name: "Cheetos (Crunchy)", carbsPer100g: 56, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 16 },
  { name: "Cheetos (Puffs)", carbsPer100g: 57, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 16 },
  { name: "Cheetos (Flamin' Hot)", carbsPer100g: 57, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 16 },
  { name: "Takis", carbsPer100g: 64, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 18 },
  { name: "Funyuns", carbsPer100g: 68, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 19 },
  { name: "Fritos", carbsPer100g: 57, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 16 },
  { name: "Sun Chips", carbsPer100g: 64, category: "Snacks", commonServing: "1 oz bag (28g)", servingCarbs: 18 },
  { name: "Tostitos Scoops", carbsPer100g: 68, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 19 },
  { name: "Pretzels (Traditional)", carbsPer100g: 72, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 20 },
  { name: "Pretzels (Soft)", carbsPer100g: 52, category: "Snacks", commonServing: "1 pretzel (115g)", servingCarbs: 60 },
  { name: "Pretzels (Auntie Anne's)", carbsPer100g: 48, category: "Snacks", commonServing: "1 pretzel (120g)", servingCarbs: 58 },
  { name: "Pretzel Bites", carbsPer100g: 50, category: "Snacks", commonServing: "6 bites (85g)", servingCarbs: 43 },
  { name: "Rold Gold Pretzels", carbsPer100g: 80, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 22 },
  { name: "Snyder's Pretzels", carbsPer100g: 78, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 22 },
  { name: "Goldfish Crackers", carbsPer100g: 64, category: "Snacks", commonServing: "55 pieces (30g)", servingCarbs: 19 },
  { name: "Cheez-Its", carbsPer100g: 60, category: "Snacks", commonServing: "27 crackers (30g)", servingCarbs: 18 },
  { name: "Wheat Thins", carbsPer100g: 67, category: "Snacks", commonServing: "16 crackers (31g)", servingCarbs: 21 },
  { name: "Triscuits", carbsPer100g: 67, category: "Snacks", commonServing: "6 crackers (28g)", servingCarbs: 19 },
  { name: "Ritz Crackers", carbsPer100g: 62, category: "Snacks", commonServing: "5 crackers (16g)", servingCarbs: 10 },
  { name: "Saltine Crackers", carbsPer100g: 74, category: "Snacks", commonServing: "5 crackers (15g)", servingCarbs: 11 },
  { name: "Graham Crackers", carbsPer100g: 76, category: "Snacks", commonServing: "2 sheets (28g)", servingCarbs: 21 },
  { name: "Animal Crackers", carbsPer100g: 72, category: "Snacks", commonServing: "16 crackers (30g)", servingCarbs: 22 },
  { name: "Popcorn (Butter)", carbsPer100g: 58, category: "Snacks", commonServing: "3 cups (33g)", servingCarbs: 19 },
  { name: "Popcorn (Movie Theater - Small)", carbsPer100g: 55, category: "Snacks", commonServing: "Small (43g)", servingCarbs: 24 },
  { name: "Popcorn (Movie Theater - Medium)", carbsPer100g: 55, category: "Snacks", commonServing: "Medium (85g)", servingCarbs: 47 },
  { name: "Popcorn (Movie Theater - Large)", carbsPer100g: 55, category: "Snacks", commonServing: "Large (170g)", servingCarbs: 94 },
  { name: "Popcorn (Caramel)", carbsPer100g: 75, category: "Snacks", commonServing: "1 cup (35g)", servingCarbs: 26 },
  { name: "Popcorn (Kettle Corn)", carbsPer100g: 68, category: "Snacks", commonServing: "2 cups (28g)", servingCarbs: 19 },
  { name: "Skinny Pop", carbsPer100g: 54, category: "Snacks", commonServing: "3.75 cups (28g)", servingCarbs: 15 },
  { name: "SmartFood White Cheddar Popcorn", carbsPer100g: 54, category: "Snacks", commonServing: "2 cups (28g)", servingCarbs: 15 },
  { name: "Trail Mix (Basic)", carbsPer100g: 44, category: "Snacks", commonServing: "1/4 cup (38g)", servingCarbs: 17 },
  { name: "Trail Mix (Tropical)", carbsPer100g: 52, category: "Snacks", commonServing: "1/4 cup (40g)", servingCarbs: 21 },
  { name: "Mixed Nuts", carbsPer100g: 21, category: "Snacks", commonServing: "1/4 cup (35g)", servingCarbs: 7 },
  { name: "Peanuts (Salted)", carbsPer100g: 16, category: "Snacks", commonServing: "1/4 cup (36g)", servingCarbs: 6 },
  { name: "Almonds", carbsPer100g: 22, category: "Snacks", commonServing: "1/4 cup (35g)", servingCarbs: 8 },
  { name: "Cashews", carbsPer100g: 30, category: "Snacks", commonServing: "1/4 cup (40g)", servingCarbs: 12 },
  { name: "Pistachios", carbsPer100g: 28, category: "Snacks", commonServing: "1/4 cup (31g)", servingCarbs: 9 },
  { name: "Sunflower Seeds", carbsPer100g: 20, category: "Snacks", commonServing: "1/4 cup (33g)", servingCarbs: 7 },
  { name: "Nature Valley Granola Bar", carbsPer100g: 64, category: "Snacks", commonServing: "1 bar (21g)", servingCarbs: 13 },
  { name: "KIND Bar", carbsPer100g: 43, category: "Snacks", commonServing: "1 bar (40g)", servingCarbs: 17 },
  { name: "Clif Bar", carbsPer100g: 66, category: "Snacks", commonServing: "1 bar (68g)", servingCarbs: 45 },
  { name: "RXBar", carbsPer100g: 42, category: "Snacks", commonServing: "1 bar (52g)", servingCarbs: 22 },
  { name: "Quest Bar", carbsPer100g: 33, category: "Snacks", commonServing: "1 bar (60g)", servingCarbs: 20 },
  { name: "Fruit Snacks (Welch's)", carbsPer100g: 78, category: "Snacks", commonServing: "1 pouch (25g)", servingCarbs: 20 },
  { name: "Fruit Roll-Up", carbsPer100g: 87, category: "Snacks", commonServing: "1 roll (14g)", servingCarbs: 12 },
  { name: "Gushers", carbsPer100g: 82, category: "Snacks", commonServing: "1 pouch (25g)", servingCarbs: 21 },
  { name: "Beef Jerky", carbsPer100g: 11, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 3 },
  { name: "Slim Jim", carbsPer100g: 10, category: "Snacks", commonServing: "1 stick (28g)", servingCarbs: 3 },
  { name: "String Cheese", carbsPer100g: 1, category: "Snacks", commonServing: "1 stick (28g)", servingCarbs: 0 },
  { name: "Babybel Cheese", carbsPer100g: 0, category: "Snacks", commonServing: "1 round (21g)", servingCarbs: 0 },
  { name: "Hummus with Pita Chips", carbsPer100g: 22, category: "Snacks", commonServing: "1 serving (85g)", servingCarbs: 19 },
  { name: "Veggie Straws", carbsPer100g: 67, category: "Snacks", commonServing: "38 straws (28g)", servingCarbs: 19 },
  { name: "Rice Cakes (Plain)", carbsPer100g: 80, category: "Snacks", commonServing: "2 cakes (18g)", servingCarbs: 14 },
  { name: "Rice Cakes (Caramel)", carbsPer100g: 82, category: "Snacks", commonServing: "1 cake (13g)", servingCarbs: 11 },
  { name: "Cheese Puffs (Generic)", carbsPer100g: 57, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 16 },
  { name: "Combos", carbsPer100g: 60, category: "Snacks", commonServing: "1 bag (50g)", servingCarbs: 30 },
  { name: "Chex Mix", carbsPer100g: 64, category: "Snacks", commonServing: "2/3 cup (30g)", servingCarbs: 19 },
  { name: "Gardetto's", carbsPer100g: 60, category: "Snacks", commonServing: "1/2 cup (30g)", servingCarbs: 18 },
  { name: "Bugles", carbsPer100g: 60, category: "Snacks", commonServing: "1 1/3 cups (30g)", servingCarbs: 18 },
  { name: "Munchies Snack Mix", carbsPer100g: 54, category: "Snacks", commonServing: "1 oz (28g)", servingCarbs: 15 },
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
