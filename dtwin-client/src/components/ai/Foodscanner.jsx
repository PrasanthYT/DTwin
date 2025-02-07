import React, { useState } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';

const FoodScanner = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [foodName, setFoodName] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
                identifyFood(reader.result.split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const identifyFood = async (base64Image) => {
        setIsProcessing(true);
        try {
            if (!base64Image || base64Image.trim() === '') {
                throw new Error('Invalid image data');
            }

            const response = await fetch('http://localhost:4200/api/identify-food', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Server error');
            }

            const result = await response.json();
            
            if (!result.outputs || !result.outputs[0]) {
                throw new Error('Invalid API response');
            }

            const predictions = result.outputs[0].data.concepts;
            if (predictions && predictions.length > 0) {
                const groupedPredictions = groupSimilarFoods(predictions);
                setFoodName(groupedPredictions);
                setError(null);
            } else {
                setError('No food items detected in the image');
            }
        } catch (err) {
            console.error('API Error:', err);
            setError(err.message || 'Error identifying food. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const groupSimilarFoods = (predictions) => {
        const formattedPredictions = predictions.map(pred => ({
            name: pred.name.toLowerCase(),
            confidence: pred.value,
            displayText: `${pred.name} (${(pred.value * 100).toFixed(1)}%)`
        }));

        const groups = {};
        formattedPredictions.forEach(pred => {
            let found = false;
            for (const key in groups) {
                if (pred.name.includes(key) || key.includes(pred.name)) {
                    groups[key].push(pred.displayText);
                    found = true;
                    break;
                }
            }
            if (!found) {
                groups[pred.name] = [pred.displayText];
            }
        });

        return Object.entries(groups).map(([category, items]) => ({
            category,
            items
        }));
    };

    const resetScanner = () => {
        setUploadedImage(null);
        setFoodName(null);
        setError(null);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto p-4">
            <div className="w-full relative rounded-lg overflow-hidden bg-gray-100 aspect-square flex items-center justify-center">
                {uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded food" className="w-full h-full object-cover" />
                ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <Upload size={48} className="text-gray-400" />
                        <span className="text-gray-600">Upload an Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                )}
            </div>

            <div className="mt-4 w-full space-y-4">
                {error && (
                    <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 rounded-lg">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {isProcessing ? (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Loader2 className="animate-spin" />
                        Analyzing image...
                    </div>
                ) : (
                    foodName && (
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800">Identified Foods:</h3>
                            <div className="mt-2 space-y-3">
                                {foodName.map((group, index) => (
                                    <div key={index} className="space-y-1">
                                        <h4 className="font-medium text-green-700 capitalize">
                                            {group.category}:
                                        </h4>
                                        <ul className="pl-4 space-y-1">
                                            {group.items.map((item, itemIndex) => (
                                                <li key={itemIndex} className="text-green-600 text-sm">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                )}

                {uploadedImage && (
                    <button
                        onClick={resetScanner}
                        className="w-full bg-gray-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700"
                    >
                        <X size={20} />
                        Upload New Photo
                    </button>
                )}
            </div>
        </div>
    );
};

export default FoodScanner;