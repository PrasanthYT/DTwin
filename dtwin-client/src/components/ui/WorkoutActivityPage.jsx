import React, { useState } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  Play,
  CheckCircle,
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const WorkoutActivityPage = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      activity: "Morning Run",
      text: "30-minute cardio session with dynamic stretching warmup",
      completed: false,
      duration: "30 min",
      target: "5km",
    },
    {
      id: 2,
      activity: "Strength Training",
      text: "Upper body workout focusing on chest, shoulders, and arms",
      completed: false,
      duration: "45 min",
      target: "4 sets",
    },
    {
      id: 3,
      activity: "HIIT Session",
      text: "High-intensity interval training with bodyweight exercises",
      completed: false,
      duration: "20 min",
      target: "10 rounds",
    },
    {
      id: 4,
      activity: "Evening Yoga",
      text: "Recovery session with focus on flexibility and mobility",
      completed: false,
      duration: "25 min",
      target: "Full routine",
    },
  ]);

  const fitnessMetrics = [
    {
      title: "Calories",
      amount: "685",
      icon: "🔥",
      color: "bg-purple-100",
      textColor: "text-purple-600",
      unit: "kcal",
    },
    {
      title: "Active Time",
      amount: "120",
      icon: "⚡️",
      color: "bg-purple-100",
      textColor: "text-purple-600",
      unit: "min",
    },
    {
      title: "Heart Rate",
      amount: "132",
      icon: "❤️",
      color: "bg-purple-100",
      textColor: "text-purple-600",
      unit: "bpm",
    },
  ];

  const [videoData, setVideoData] = useState({
    id: "fitness-vid",
    title: "Full Body HIIT Workout",
    description:
      "High-intensity training to boost metabolism and build strength",
    stats: {
      views: 32450,
      likes: 1240,
      comments: 186,
    },
  });

  const toggleActivity = (activityId) => {
    setActivities(
      activities.map((activity) =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const getProgress = () => {
    const completed = activities.filter(
      (activity) => activity.completed
    ).length;
    return (completed / activities.length) * 100;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-800 p-4 pb-8 text-white rounded-b-3xl shadow-lg relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Header Content */}
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <Link to="/healthsuggestion">
              <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <div className="ml-2">
              <p className="text-purple-100 text-sm font-medium tracking-wider uppercase">
                Daily Workout
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Physical Activity
              </h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-lg">💪</span>
                <span className="text-sm sm:text-base font-medium">
                  <span className="font-semibold">245</span> Active
                </span>
              </span>
              <span className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-lg">🎯</span>
                <span className="text-sm sm:text-base font-medium">
                  <span className="font-semibold">Advanced</span> Level
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
              <span className="text-sm sm:text-base font-medium">
                {Math.round(getProgress())}% Completed
              </span>
            </div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-2.5 backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-purple-200 to-white rounded-full h-2.5 transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <p className="text-purple-50 text-sm mt-4 font-medium tracking-wide">
            "The only bad workout is the one that didn't happen."
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Activity Metrics</h2>
          <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
            View History
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {fitnessMetrics.map((metric) => (
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
                    <h3 className={`font-semibold text-lg ${metric.textColor}`}>
                      {metric.title}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {metric.amount} {metric.unit}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Activities Section */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Workout Plan</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="text-gray-400" />
          </button>
        </div>
        <div className="space-y-8">
          {activities.map((item, index) => (
            <div
              key={item.id}
              className="flex items-start space-x-4 cursor-pointer group"
              onClick={() => toggleActivity(item.id)}
            >
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    item.completed
                      ? "bg-purple-600 scale-110"
                      : "bg-gray-200 group-hover:bg-purple-200"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Activity className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute top-10 left-5 w-0.5 h-20 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.activity}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        {item.duration}
                      </span>
                      <span className="text-sm text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        Target: {item.target}
                      </span>
                    </div>
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

      {/* Featured Content Section */}
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
            <h3 className="text-lg font-semibold text-gray-900">
              {videoData.title}
            </h3>
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
