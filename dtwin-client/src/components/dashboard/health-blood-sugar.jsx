import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ReferenceLine,
  Area,
} from 'recharts';

const GlucoseMonitor = () => {
  const [glucoseData, setGlucoseData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [currentGlucose, setCurrentGlucose] = useState(0);
  const [timeInRange, setTimeInRange] = useState(0);
  const [fastingAverage, setFastingAverage] = useState(0);
  const [avgGlucose, setAvgGlucose] = useState(0);
  const [hba1c, setHba1c] = useState(0);
  const [lastMeasurementTime, setLastMeasurementTime] = useState('');
  const [selectedRange, setSelectedRange] = useState('Today');
  const [latestDate, setLatestDate] = useState(null);

  const TARGET_MIN = 3.9;
  const TARGET_MAX = 10.0;

  const mgdLToMmol = (mgdL) => {
    return (mgdL / 18).toFixed(1);
  };

  const isInRange = (glucoseValue) => {
    return glucoseValue >= TARGET_MIN && glucoseValue <= TARGET_MAX;
  };

  const calculateHbA1c = (avgGlucose) => {
    return ((parseFloat(avgGlucose) + 2.59) / 1.59).toFixed(1);
  };

  // Colors for HbA1c text (ensure visibility on light pastel backgrounds)
  const getStatusColor = (hba1c) => {
    if (hba1c < 5.7) return 'text-green-600';
    if (hba1c < 6.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = (hba1c) => {
    if (hba1c < 5.7) return 'Normal';
    if (hba1c < 6.5) return 'Pre-diabetic';
    return 'Diabetic';
  };

  const processGlucoseData = (data) => {
    const lines = data.split('\n').slice(1);
    const processedData = [];
    let maxDate = new Date(0);

    lines.forEach((line) => {
      if (!line.trim()) return;

      const [id, timeStr, recordType, glucoseStr] = line.split('\t');
      if (!timeStr || !glucoseStr) return;

      const glucose = parseInt(glucoseStr);
      if (isNaN(glucose)) return;

      const date = new Date(timeStr);
      if (date > maxDate) maxDate = date;

      const glucoseMmol = parseFloat(mgdLToMmol(glucose));

      processedData.push({
        time: `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
        fullDate: date,
        dateString: date.toISOString().split('T')[0],
        glucose: glucoseMmol,
        // For high range shading
        highArea: glucoseMmol > TARGET_MAX ? glucoseMmol : null,
        // For low range shading
        lowArea: glucoseMmol < TARGET_MIN ? glucoseMmol : null,
        // For normal range
        normalArea:
          glucoseMmol >= TARGET_MIN && glucoseMmol <= TARGET_MAX
            ? glucoseMmol
            : null,
      });
    });

    processedData.sort((a, b) => a.fullDate - b.fullDate);
    setLatestDate(maxDate);
    setGlucoseData(processedData);
    updateDisplayData(processedData, 'Today', maxDate);
  };

  const updateDisplayData = (data, range, lastDate) => {
    if (!lastDate || !data.length) return;

    const endDate = new Date(lastDate);
    let startDate = new Date(lastDate);
    let filteredData = [];

    switch (range) {
      case 'Today':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        filteredData = data.filter((reading) => {
          const readingDate = new Date(reading.fullDate);
          return readingDate.toDateString() === lastDate.toDateString();
        });
        break;
      case '7 days':
        startDate.setDate(lastDate.getDate() - 6);
        filteredData = data.filter((reading) => {
          const readingDate = new Date(reading.fullDate);
          return readingDate >= startDate && readingDate <= endDate;
        });
        break;
      case 'Month':
        startDate.setMonth(lastDate.getMonth() - 1);
        filteredData = data.filter((reading) => {
          const readingDate = new Date(reading.fullDate);
          return readingDate >= startDate && readingDate <= endDate;
        });
        break;
      case 'Quarter':
        startDate.setMonth(lastDate.getMonth() - 3);
        filteredData = data.filter((reading) => {
          const readingDate = new Date(reading.fullDate);
          return readingDate >= startDate && readingDate <= endDate;
        });
        break;
      default:
        filteredData = data;
    }

    setDisplayData(filteredData);

    if (filteredData.length > 0) {
      const lastReading = filteredData[filteredData.length - 1];
      setCurrentGlucose(lastReading.glucose);
      setLastMeasurementTime(lastReading.time);

      const inRange = filteredData.filter((r) => isInRange(r.glucose)).length;
      setTimeInRange(Math.round((inRange / filteredData.length) * 100));

      const fastingReadings = filteredData.filter(
        (reading) => new Date(reading.fullDate).getHours() === 6
      );
      const fastingAvg =
        fastingReadings.length > 0
          ? fastingReadings.reduce((acc, curr) => acc + curr.glucose, 0) /
            fastingReadings.length
          : 0;
      setFastingAverage(fastingAvg.toFixed(1));

      const avg =
        filteredData.reduce((acc, curr) => acc + curr.glucose, 0) /
        filteredData.length;
      setAvgGlucose(avg.toFixed(1));
      setHba1c(calculateHbA1c(avg));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        processGlucoseData(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    updateDisplayData(glucoseData, range, latestDate);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const reading = payload[0].payload;
      const inRange = isInRange(reading.glucose);
      return (
        <div className="bg-white text-gray-800 p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-xs">{`Time: ${reading.time}`}</p>
          <p className="text-xs">{`Date: ${new Date(
            reading.fullDate
          ).toLocaleDateString()}`}</p>
          <p className="text-xs">
            <span>{`Glucose: ${reading.glucose} mmol/L `}</span>
            <span className={inRange ? 'text-green-600' : 'text-red-600'}>
              ({inRange ? 'In Range' : 'Out of Range'})
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 py-6">
      {/* Increased max-w for a wider layout */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Glucose + Tabs + Chart container */}
        <div className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2 text-gray-800">
              {currentGlucose}
            </div>
            <div className="text-gray-500 font-medium">mmol/l</div>
            <div className="text-gray-400 text-sm mt-1">
              Last measurement, {lastMeasurementTime}
            </div>
          </div>

          {/* Tabs (centered, 95% width) */}
          <div className="w-[95%] mx-auto mb-6">
            <Tabs defaultValue="Today" onValueChange={handleRangeChange}>
              <TabsList className="flex justify-center gap-2">
                <TabsTrigger
                  value="Today"
                  className="px-4 py-2 text-sm rounded-md
                             data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             bg-gray-100 hover:bg-gray-200 transition"
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="7 days"
                  className="px-4 py-2 text-sm rounded-md
                             data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             bg-gray-100 hover:bg-gray-200 transition"
                >
                  7 days
                </TabsTrigger>
                <TabsTrigger
                  value="Month"
                  className="px-4 py-2 text-sm rounded-md
                             data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             bg-gray-100 hover:bg-gray-200 transition"
                >
                  Month
                </TabsTrigger>
                <TabsTrigger
                  value="Quarter"
                  className="px-4 py-2 text-sm rounded-md
                             data-[state=active]:bg-blue-500 data-[state=active]:text-white 
                             bg-gray-100 hover:bg-gray-200 transition"
                >
                  Quarter
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Chart (98% width, no Y-axis) */}
          <div className="w-[98%] mx-auto h-64 bg-white rounded-xl relative overflow-hidden border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={displayData}
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                  interval={Math.floor(displayData.length / 6)}
                />
                {/* No <YAxis /> here */}
                <Tooltip content={<CustomTooltip />} />

                {/* Reference Lines (still visible even without Y-axis) */}
                <ReferenceLine
                  y={TARGET_MAX}
                  stroke="#9CA3AF"
                  strokeDasharray="3 3"
                  label={{
                    value: 'High',
                    position: 'right',
                    fill: '#9CA3AF',
                    fontSize: 10,
                  }}
                />
                <ReferenceLine
                  y={TARGET_MIN}
                  stroke="#9CA3AF"
                  strokeDasharray="3 3"
                  label={{
                    value: 'Low',
                    position: 'right',
                    fill: '#9CA3AF',
                    fontSize: 10,
                  }}
                />

                {/* High Range Area */}
                <Area
                  dataKey="highArea"
                  stroke="none"
                  fill="#FEE2E2"
                  fillOpacity={0.5}
                  baseValue={TARGET_MAX}
                />

                {/* Low Range Area */}
                <Area
                  dataKey="lowArea"
                  stroke="none"
                  fill="#FEE2E2"
                  fillOpacity={0.5}
                  baseValue={TARGET_MIN}
                />

                {/* Normal Range Area */}
                <Area
                  dataKey="normalArea"
                  stroke="none"
                  fill="#E8F5E9"
                  fillOpacity={0.4}
                />

                {/* Main glucose line */}
                <Line
                  type="monotone"
                  dataKey="glucose"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Upload button */}
          <div className="absolute bottom-4 right-4">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".txt"
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-200 shadow-sm">
                <Upload size={24} />
              </div>
            </label>
          </div>
        </div>

        {/* Stats Cards (lighter, pastel gradients) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Time in Range */}
          <Card className="p-4 rounded-xl shadow-md bg-gradient-to-tr from-lime-100 to-lime-200 text-gray-800">
            <div className="text-gray-700 text-sm font-medium mb-1">Time in range</div>
            <div className="text-3xl font-bold">
              {timeInRange}
              <span className="text-xl">%</span>
            </div>
          </Card>

          {/* Fasting Average */}
          <Card className="p-4 rounded-xl shadow-md bg-gradient-to-tr from-sky-100 to-sky-200 text-gray-800">
            <div className="text-gray-700 text-sm font-medium mb-1">Fasting Average</div>
            <div className="text-3xl font-bold">
              {fastingAverage}
              <span className="text-xl"> mmol/l</span>
            </div>
          </Card>

          {/* Avg glucose level */}
          <Card className="p-4 rounded-xl shadow-md bg-gradient-to-tr from-rose-100 to-rose-200 text-gray-800">
            <div className="text-gray-700 text-sm font-medium mb-1">Avg glucose level</div>
            <div className="text-3xl font-bold">
              {avgGlucose}
              <span className="text-xl"> mmol/l</span>
            </div>
          </Card>

          {/* Est. HbA1c */}
          <Card className="p-4 rounded-xl shadow-md bg-gradient-to-tr from-pink-100 to-pink-200 text-gray-800">
            <div className="text-gray-700 text-sm font-medium mb-1">Est. HbA1c</div>
            <div className={`text-2xl font-bold ${getStatusColor(hba1c)}`}>
              {hba1c}% - {getStatusText(hba1c)}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlucoseMonitor;
