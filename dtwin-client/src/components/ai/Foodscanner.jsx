import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Settings, FlipHorizontal, ArrowLeft, RotateCcw, Plus } from 'lucide-react';
import './Foodscan.css'
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const FoodScanner = () => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [foodResults, setFoodResults] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(true);
    const [facingMode, setFacingMode] = useState('environment');
    const [quantity, setQuantity] = useState('');
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: { ideal: facingMode }
    };

    const capture = React.useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
            setIsCameraActive(false);
            const base64Image = imageSrc.split(',')[1];
            identifyFood(base64Image);
        }
    }, [webcamRef]);

    const identifyFood = async (base64Image) => {
        setIsProcessing(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4200/api/identify-food', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image })
            });
            if (!response.ok) throw new Error('Failed to analyze image');
            const data = await response.json();
            setFoodResults(data);
        } catch (err) {
            setError('Failed to analyze image. Please try again.');
            console.error('API Error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetScanner = () => {
        setCapturedImage(null);
        setFoodResults(null);
        setError(null);
        setIsCameraActive(true);
        setQuantity('');
    };

    const flipCamera = () => {
        setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
    };

    const handleAddToLog = async () => {
        if (!foodResults?.outputs?.[0]?.data?.concepts?.[0]?.name || !quantity) {
            console.error("Missing food name or quantity");
            return;
        }
    
        const foodLog = {
            food: foodResults.outputs[0].data.concepts[0].name,
            quantity: quantity,
        };
    
        try {
            const response = await axios.post('http://localhost:4200/api/foodlog/log', foodLog);
            console.log('Added to log:', response.data);
            toast.success('Food Logged successfully')
        } catch (error) {
            console.error('Error adding to log:', error);
            alert('Failed to log food.');
        }
    };
    
    const handleBack = () => {
        navigate("/dashboard");
    };

    const ScannerOverlay = () => (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64">
                {/* Simple white overlay */}
                <div className="absolute -inset-4 bg-white/5 rounded-lg"></div>
                
                {/* Clean corner brackets */}
                <div className="absolute -top-1 -left-1 w-8 h-8">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-white/80"></div>
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-white/80"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8">
                    <div className="absolute top-0 right-0 w-full h-0.5 bg-white/80"></div>
                    <div className="absolute top-0 right-0 w-0.5 h-full bg-white/80"></div>
                </div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8">
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/80"></div>
                    <div className="absolute bottom-0 left-0 w-0.5 h-full bg-white/80"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8">
                    <div className="absolute bottom-0 right-0 w-full h-0.5 bg-white/80"></div>
                    <div className="absolute bottom-0 right-0 w-0.5 h-full bg-white/80"></div>
                </div>

            
                {/* Minimal scanning animation */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full animate-scan-move">
                        <div className="h-0.5 bg-white/80"></div>
                        <div className="h-8 bg-gradient-to-b from-white/20 to-transparent -mt-4"></div>
                    </div>
                </div>
            </div>

            {isProcessing && (
                <div className="absolute bottom-32 flex flex-col items-center space-y-2">
                    <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full">
                        <p className="text-white text-sm font-medium">Analyzing...</p>
                    </div>
                    <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-white animate-loader"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            ></div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const ResultsView = () => {
        const topResult = foodResults?.outputs?.[0]?.data?.concepts?.[0];
        
        return (
            <div className="relative h-full bg-white">
                {/* Top Navigation */}
                <Toaster position="top-center" reverseOrder={false} />
                <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
                    <div className="flex items-center p-4">
                        <button
                            onClick={resetScanner}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                        >
                            <ArrowLeft size={24} />
                            <span>Back</span>
                        </button>
                    </div>
                </div>

                {/* Captured Image */}
                <div className="relative h-1/2">
                    <img 
                        src={capturedImage} 
                        alt="Captured food" 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Results Section */}
                <div className="absolute bottom-0 left-0 right-0 min-h-[50%] bg-white rounded-t-3xl p-6 shadow-lg">
                    <div className="max-h-[calc(100vh-50%)] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Results</h2>
                        
                        {error ? (
                            <div className="p-4 bg-red-50 rounded-lg text-red-600">{error}</div>
                        ) : topResult ? (
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xl font-medium text-gray-900">{topResult.name}</span>
                                        <span className="text-sm text-gray-500">
                                            {(topResult.value * 100).toFixed(1)}% confidence
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            placeholder="Enter quantity (g)"
                                            className="w-full p-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        
                                        <button
                                            onClick={handleAddToLog}
                                            className="w-full p-3 bg-blue-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Plus size={20} />
                                            Add to Log
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">Processing image...</div>
                        )}

                        {/* Retake Photo Button */}
                        <button
                            onClick={resetScanner}
                            className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <RotateCcw size={20} />
                            Retake Photo
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative h-screen w-full bg-black">
            {isCameraActive ? (
                <div className="relative h-full w-full">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        className="h-full w-full object-cover"
                    />
                    <ScannerOverlay />
                    
                    {/* Camera Controls */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-around items-center px-8">
                        <button
                            onClick={handleBack}
                            className="w-12 h-12 bg-black/30 backdrop-blur-lg rounded-full flex items-center justify-center transition-all hover:bg-black/40 border border-white/20"
                        >
                            <ArrowLeft className="text-white" size={24} />
                        </button>
                        
                        <button
                            onClick={capture}
                            className="w-16 h-16 bg-blue-500 hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center transition-all active:scale-95"
                        >
                            <Camera className="text-white" size={32} />
                        </button>
                        
                        <button
                            onClick={flipCamera}
                            className="w-12 h-12 bg-black/30 backdrop-blur-lg rounded-full flex items-center justify-center transition-all hover:bg-black/40 border border-white/20"
                        >
                            <FlipHorizontal className="text-white" size={24} />
                        </button>
                    </div>
                </div>
            ) : (
                <ResultsView />
            )}
        </div>
    );
};

export default FoodScanner;