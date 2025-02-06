import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

const FoodTrackerCard = () => {
  const nutritionData = [
    { name: 'Carbohydrate', value: 56.4, color: '#9333ea' },
    { name: 'Protein', value: 12.3, color: '#ef4444' },
    { name: 'Fat', value: 18, color: '#eab308' }
  ];

  return (
    <div className="max-w-md mx-auto bg-white">
      {/* Header */}
      <div className="relative h-48">
        <img
          src="/api/placeholder/400/320"
          alt="Dry chole"
          className="w-full h-full object-cover rounded-t-lg"
        />
        <button className="absolute top-4 left-4 text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="absolute top-4 right-4 text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <Card className="border-0 shadow-none">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Title and calories */}
            <div>
              <h2 className="text-2xl font-semibold">Dry chole</h2>
              <p className="text-gray-500">100.00gm | 144 cal</p>
            </div>

            {/* Quantity input and button */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value="100"
                  className="w-full p-2 border rounded-lg"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">g</span>
              </div>
              <Button className="bg-red-400 hover:bg-red-500 text-white px-6">
                Add food
              </Button>
            </div>

            {/* Nutrition chart */}
            <div>
              <h3 className="text-lg font-medium mb-4">What it contains</h3>
              <div className="relative">
                <div className="flex justify-center">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={nutritionData}
                      cx={100}
                      cy={100}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {nutritionData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-xl font-bold">441</div>
                  <div className="text-sm text-gray-500">CALORIES</div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 mt-4">
                {nutritionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span>{item.value}g</span>
                  </div>
                ))}
              </div>

              {/* Additional nutrition info */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span>Carbohydrate (g)</span>
                  <span>56.4</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Dietary fiber (g)</span>
                  <span>10.6</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Sugars (g)</span>
                  <span>10.6</span>
                </div>
                <div className="flex justify-between">
                  <span>Protein (g)</span>
                  <span>12.3</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodTrackerCard;