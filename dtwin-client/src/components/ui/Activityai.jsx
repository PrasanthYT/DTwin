import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal, Play, CheckCircle, Heart, MessageCircle, Eye, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const WorkoutActivityPage = () => {
  const [steps, setSteps] = useState([
    { 
      id: 1,
      step: 'Warm Up', 
      text: 'Start with 10 minutes of dynamic stretching and light cardio', 
      completed: false,
      image: '/warmup.png',
      duration: '10 min'
    },
    { 
      id: 2,
      step: 'Strength Training', 
      text: 'Complete 3 sets of compound exercises focusing on major muscle groups', 
      completed: false,
      image: '/api/placeholder/80/80',
      duration: '25 min'
    },
    { 
      id: 3,
      step: 'HIIT Cardio', 
      text: '20 minutes of high-intensity interval training', 
      completed: false,
      image: '/api/placeholder/80/80',
      duration: '20 min'
    },
    { 
      id: 4,
      step: 'Cool Down', 
      text: 'End with static stretches and breathing exercises', 
      completed: false,
      image: '/api/placeholder/80/80',
      duration: '10 min'
    }
  ]);

  const workoutMetrics = [
    { 
      title: 'Cardio Fitness', 
      amount: '45min',
      icon: '🏃‍♂️',
      color: 'bg-rose-100',
      textColor: 'text-rose-600'
    },
    { 
      title: 'Strength', 
      amount: '30min',
      icon: '💪',
      color: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    { 
      title: 'Flexibility', 
      amount: '20min',
      icon: '🧘‍♂️',
      color: 'bg-amber-100',
      textColor: 'text-amber-600'
    }
  ];

  const [videoData, setVideoData] = useState({
    id: 'hSma-BRzoo', // Example YouTube video ID
    title: 'Full Body HIIT Workout',
    description: 'High-intensity interval training for maximum results',
    stats: {
      views: 15423,
      likes: 342,
      comments: 248
    }
  });

  const toggleStep = (stepId) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const getProgress = () => {
    const completed = steps.filter(step => step.completed).length;
    return (completed / steps.length) * 100;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 pb-8 text-white rounded-b-3xl shadow-lg">
        <div className="flex items-center mb-6">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold ml-2">Daily Workout</h1>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
              <span className="text-sm">👥</span>
              <span className="text-base font-medium">78 Active</span>
            </span>
            <span className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
              <span className="text-sm">⚡️</span>
              <span className="text-base font-medium">Advanced</span>
            </span>
          </div>
          <div className="text-sm bg-white/20 px-4 py-1.5 rounded-full font-medium">
            {Math.round(getProgress())}% Done
          </div>
        </div>
        {/* Gradient Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-white to-purple-200 rounded-full h-2.5 transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Metrics Section with Animation */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Activity Overview</h2>
          <button className="text-purple-600 text-sm font-medium hover:text-purple-700">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {workoutMetrics.map((metric) => (
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
                    <p className="text-gray-600 font-medium">{metric.amount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Steps Section with Timeline */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Workout Plan</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="text-gray-400" />
          </button>
        </div>
        <div className="space-y-8">
          {steps.map((item, index) => (
            <div 
              key={item.id} 
              className="flex items-start space-x-4 cursor-pointer group"
              onClick={() => toggleStep(item.id)}
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  item.completed ? 'bg-purple-600 scale-110' : 'bg-gray-200 group-hover:bg-purple-200'
                }`}>
                  {item.completed ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-gray-500 font-medium">{item.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-10 left-5 w-0.5 h-20 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{item.step}</h3>
                    <span className="text-sm text-gray-500">{item.duration}</span>
                  </div>
                  {item.completed && (
                    <span className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{item.text}</p>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Video Section */}
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4">Featured Workout</h2>
        <div className="rounded-xl overflow-hidden shadow-lg bg-white">
          <div className="relative aspect-video">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoData.id}`}
              title={videoData.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{videoData.title}</h3>
            <p className="text-gray-600 mt-1">{videoData.description}</p>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex space-x-6">
                <span className="flex items-center space-x-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>{videoData.stats.views.toLocaleString()}</span>
                </span>
                <span className="flex items-center space-x-2 text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span>{videoData.stats.likes.toLocaleString()}</span>
                </span>
                <span className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle className="w-4 h-4" />
                  <span>{videoData.stats.comments.toLocaleString()}</span>
                </span>
              </div>
              <button className="flex items-center space-x-2 text-purple-600 font-medium hover:text-purple-700">
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutActivityPage;