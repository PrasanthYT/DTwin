import React, { useState } from 'react';
import { ArrowLeft, MoreHorizontal, Play, CheckCircle, Heart, MessageCircle, Eye, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const MindWellnessPage = () => {
  const [steps, setSteps] = useState([
    { 
      id: 1,
      step: 'Morning Meditation', 
      text: 'Start your day with 10 minutes of mindful breathing and positive affirmations', 
      completed: false,
      duration: '10 min'
    },
    { 
      id: 2,
      step: 'Journaling', 
      text: 'Write down your thoughts, feelings, and intentions for the day', 
      completed: false,
      duration: '15 min'
    },
    { 
      id: 3,
      step: 'Mindful Movement', 
      text: 'Gentle yoga or stretching to connect body and mind', 
      completed: false,
      duration: '20 min'
    },
    { 
      id: 4,
      step: 'Evening Reflection', 
      text: 'Practice gratitude and review your daily achievements', 
      completed: false,
      duration: '10 min'
    }
  ]);

  const wellnessMetrics = [
    { 
      title: 'Mindfulness', 
      amount: '30min',
      icon: '🧘‍♀️',
      color: 'bg-cyan-100',
      textColor: 'text-cyan-600'
    },
    { 
      title: 'Focus', 
      amount: '45min',
      icon: '🎯',
      color: 'bg-cyan-100',
      textColor: 'text-cyan-600'
    },
    { 
      title: 'Relaxation', 
      amount: '25min',
      icon: '🌿',
      color: 'bg-cyan-100',
      textColor: 'text-cyan-600'
    }
  ];

  const [videoData, setVideoData] = useState({
    id: 'mindfulness-vid',
    title: 'Guided Meditation for Inner Peace',
    description: 'A calming session to help you find balance and tranquility',
    stats: {
      views: 24680,
      likes: 892,
      comments: 156
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
    {/* Enhanced Header with Gradient and Improved Typography */}
    <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 p-4 pb-8 text-white rounded-b-3xl shadow-lg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      {/* Header Content */}
      <div className="relative z-10">
        {/* Top Navigation */}
        <div className="flex items-center mb-6">
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="ml-2">
            <p className="text-cyan-100 text-sm font-medium tracking-wider uppercase">Daily Practice</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Mind Wellness</h1>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-lg">🌟</span>
              <span className="text-sm sm:text-base font-medium">
                <span className="font-semibold">124</span> Practicing
              </span>
            </span>
            <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-lg">🍃</span>
              <span className="text-sm sm:text-base font-medium">
                <span className="font-semibold">Beginner</span> Journey
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" />
            <span className="text-sm sm:text-base font-medium">
              {Math.round(getProgress())}% Complete
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2.5 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-cyan-200 to-white rounded-full h-2.5 transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>

        {/* Motivational Text */}
        <p className="text-cyan-50 text-sm mt-4 font-medium tracking-wide">
          "Every moment is a fresh beginning." - T.S. Eliot
        </p>
      </div>
    </div>

    {/* Rest of the component remains the same ... */}
    {/* Metrics Section */}
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Daily Progress</h2>
        <button className="text-cyan-600 text-sm font-medium hover:text-cyan-700">View Details</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wellnessMetrics.map((metric) => (
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

    {/* Steps Section */}
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Daily Practice</h2>
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
                item.completed ? 'bg-cyan-600 scale-110' : 'bg-gray-200 group-hover:bg-cyan-200'
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
                  <span className="text-sm text-cyan-600 font-medium bg-cyan-50 px-3 py-1 rounded-full">
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

    {/* Featured Content Section */}
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold mb-4">Featured Session</h2>
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
            <button className="flex items-center space-x-2 text-cyan-600 font-medium hover:text-cyan-700">
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


export default MindWellnessPage;