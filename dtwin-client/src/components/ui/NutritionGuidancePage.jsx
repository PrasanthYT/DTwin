import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, Apple, CheckCircle, Scale, Utensils, BookOpen, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const NutritionGuidancePage = () => {
  const [meals, setMeals] = useState([
    { 
      id: 1,
      meal: 'Breakfast', 
      text: 'High-protein breakfast with whole grains and fruits', 
      completed: false,
      time: '8:00 AM',
      calories: '450 kcal'
    },
    { 
      id: 2,
      meal: 'Morning Snack', 
      text: 'Greek yogurt with mixed berries and honey', 
      completed: false,
      time: '10:30 AM',
      calories: '200 kcal'
    },
    { 
      id: 3,
      meal: 'Lunch', 
      text: 'Grilled chicken salad with quinoa and avocado', 
      completed: false,
      time: '1:00 PM',
      calories: '550 kcal'
    },
    { 
      id: 4,
      meal: 'Afternoon Snack', 
      text: 'Mixed nuts and dried fruits', 
      completed: false,
      time: '4:00 PM',
      calories: '180 kcal'
    },
    { 
      id: 5,
      meal: 'Dinner', 
      text: 'Baked salmon with roasted vegetables', 
      completed: false,
      time: '7:00 PM',
      calories: '520 kcal'
    }
  ]);

  const nutritionMetrics = [
    { 
      title: 'Calories', 
      amount: '1,900',
      icon: '🔥',
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      unit: 'kcal'
    },
    { 
      title: 'Protein', 
      amount: '95',
      icon: '🥩',
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      unit: 'g'
    },
    { 
      title: 'Water', 
      amount: '2.5',
      icon: '💧',
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      unit: 'L'
    }
  ];

  const [recipeData, setRecipeData] = useState({
    id: 'healthy-recipe',
    title: 'Mediterranean Buddha Bowl',
    description: 'A nutrient-rich bowl packed with quinoa, chickpeas, fresh vegetables, and tahini dressing',
    stats: {
      calories: 450,
      prepTime: '20 min',
      difficulty: 'Easy'
    }
  });

  const toggleMeal = (mealId) => {
    setMeals(meals.map(meal => 
      meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
    ));
  };

  const getProgress = () => {
    const completed = meals.filter(meal => meal.completed).length;
    return (completed / meals.length) * 100;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 pb-8 text-white rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        {/* Header Content */}
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="ml-2">
              <p className="text-blue-100 text-sm font-medium tracking-wider uppercase">Daily Nutrition</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Meal Planning</h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-lg">🥗</span>
                <span className="text-sm sm:text-base font-medium">
                  <span className="font-semibold">1,900</span> kcal Goal
                </span>
              </span>
              <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-lg">📊</span>
                <span className="text-sm sm:text-base font-medium">
                  <span className="font-semibold">Balance</span> Diet
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
              <span className="text-sm sm:text-base font-medium">
                {Math.round(getProgress())}% Consumed
              </span>
            </div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-2.5 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-blue-200 to-white rounded-full h-2.5 transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <p className="text-blue-50 text-sm mt-4 font-medium tracking-wide">
            "Let food be thy medicine, and medicine be thy food."
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nutrition Metrics</h2>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View Details</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {nutritionMetrics.map((metric) => (
            <Card 
              key={metric.title} 
              className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`${metric.color} p-3 rounded-xl`}>
                    <span className="text-2xl">{metric.icon}</span>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${metric.textColor}`}>{metric.title}</h3>
                    <p className="text-gray-600 font-medium">{metric.amount} {metric.unit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Meals Section */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Daily Meal Plan</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="text-gray-400" />
          </button>
        </div>
        <div className="space-y-8">
          {meals.map((item, index) => (
            <div 
              key={item.id} 
              className="flex items-start space-x-4 cursor-pointer group"
              onClick={() => toggleMeal(item.id)}
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  item.completed ? 'bg-blue-600 scale-110' : 'bg-gray-200 group-hover:bg-blue-100'
                }`}>
                  {item.completed ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Utensils className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                {index < meals.length - 1 && (
                  <div className="absolute top-10 left-5 w-0.5 h-20 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{item.meal}</h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{item.time}</span>
                      <span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {item.calories}
                      </span>
                    </div>
                  </div>
                  {item.completed && (
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      Consumed
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Recipe Section */}
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4">Featured Recipe</h2>
        <div className="rounded-xl overflow-hidden shadow-lg bg-white">
          <div className="relative aspect-video bg-blue-100">
            <img 
              src="/api/placeholder/800/400" 
              alt="Mediterranean Buddha Bowl"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{recipeData.title}</h3>
            <p className="text-gray-600 mt-1">{recipeData.description}</p>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex space-x-6">
                <span className="flex items-center space-x-2 text-gray-600">
                  <Scale className="w-4 h-4" />
                  <span>{recipeData.stats.calories} kcal</span>
                </span>
                <span className="flex items-center space-x-2 text-gray-600">
                  <Timer className="w-4 h-4" />
                  <span>{recipeData.stats.prepTime}</span>
                </span>
                <span className="flex items-center space-x-2 text-gray-600">
                  <Apple className="w-4 h-4" />
                  <span>{recipeData.stats.difficulty}</span>
                </span>
              </div>
              <button className="flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-700">
                <BookOpen className="w-4 h-4" />
                <span>View Recipe</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionGuidancePage; 