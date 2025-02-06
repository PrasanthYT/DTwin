import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const RectangularCurvedGraph = ({ data, width, height }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const curveRadius = 15; // Radius for top corners
  
  // Calculate path for bar area with curved top corners
  const generatePath = () => {
    let path = '';
    
    // Start at bottom left
    path += `M 0,${height}`;
    
    // Draw up to first point
    const firstY = height - ((data[0].value - minValue) / range) * height;
    path += ` L 0,${firstY}`;

    data.forEach((point, index) => {
      if (index === 0) return; // Skip first point as we've already moved there

      const prevX = ((index - 1) / (data.length - 1)) * width;
      const currX = (index / (data.length - 1)) * width;
      const prevY = height - ((data[index - 1].value - minValue) / range) * height;
      const currY = height - ((point.value - minValue) / range) * height;

      // Add curved corner if going up, straight line if going down
      if (currY < prevY) { // Going up
        path += ` L ${currX - curveRadius},${prevY}`; // Horizontal to curve start
        path += ` Q ${currX},${prevY} ${currX},${currY}`; // Curved corner
      } else { // Going down
        path += ` L ${currX},${currY}`;
      }
    });

    // Complete the path by going down and back to start
    path += ` L ${width},${height} Z`;
    
    return path;
  };

  return (
    <div className="relative w-full h-full">
      <svg width={width} height={height} className="overflow-visible">
        {/* Define gradient */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={height * (i / 4)}
            x2={width}
            y2={height * (i / 4)}
            stroke="#E5E7EB"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        
        {/* Area with gradient */}
        <path
          d={generatePath()}
          fill="url(#areaGradient)"
          stroke="#3B82F6"
          strokeWidth="2"
          className="transition-all duration-300"
        />
        
        {/* Data points and labels */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - ((point.value - minValue) / range) * height;
          return (
            <g key={index}>
              {point.label && (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="white"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <g transform={`translate(${x},${y - 15})`}>
                    <rect
                      x="-12"
                      y="-20"
                      width="24"
                      height="20"
                      rx="6"
                      fill="#3B82F6"
                      className="shadow-lg"
                    />
                    <text
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      dy="-6"
                    >
                      {point.value}
                    </text>
                  </g>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const HeartRateMonitor = () => {
  const [timeFrame, setTimeFrame] = useState('1Week');
  
  const heartRateData = [
    { day: 'Mon', value: 85, label: false },
    { day: 'Tue', value: 75, label: false },
    { day: 'Wed', value: 80, label: true },
    { day: 'Thu', value: 95, label: false },
    { day: 'Fri', value: 90, label: true },
    { day: 'Sat', value: 88, label: false },
    { day: 'Sun', value: 82, label: false }
  ];

  const timeFrames = ['1 Day', '1 Week', '1 Month', '1 Year', 'All'];

  const anomalies = [
    { risk: 'High Risk', color: 'bg-red-100 text-red-500' },
    { risk: 'Low Risk', color: 'bg-gray-100 text-gray-500' },
    { risk: 'Low Risk', color: 'bg-gray-100 text-gray-500' }
  ];

  return (
    <div className="max-w-md mx-auto bg-white p-4 h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Heart Rate</h1>
        <span className="text-blue-500">Normal</span>
      </div>

      {/* Current BPM Display */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 bg-red-100 rounded-xl">
          <Heart className="w-6 h-6 text-red-500" />
        </div>
        <span className="text-5xl font-bold">95</span>
        <span className="text-2xl text-gray-600">BPM</span>
      </div>

      {/* Time Frame Selector */}
      <div className="flex justify-between mb-8">
        {timeFrames.map((frame) => (
          <button
            key={frame}
            className={`px-4 py-2 rounded-full ${
              timeFrame === frame.replace(' ', '') 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500'
            }`}
            onClick={() => setTimeFrame(frame.replace(' ', ''))}
          >
            {frame}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-8 h-48">
        <RectangularCurvedGraph
          data={heartRateData}
          width={350}
          height={200}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          {heartRateData.map((data, index) => (
            <span key={index}>{data.day}</span>
          ))}
        </div>
      </div>

      {/* Health Anomalies */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex justify-between">
          12 Health Anomalies
          <button className="text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {anomalies.map((anomaly, index) => (
            <div 
              key={index} 
              className={`${anomaly.color} p-4 rounded-xl flex flex-col gap-2`}
            >
              <div className="flex justify-between items-center">
                <span>{anomaly.risk}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div className="w-full h-8 bg-white/50 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeartRateMonitor;