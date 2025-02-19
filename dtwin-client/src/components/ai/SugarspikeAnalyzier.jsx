import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = "AIzaSyDK1ktNxAi5UPMZSSivCJcXxFjyxz483gA"; 
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "The AI should analyze the user's meal data and predict the expected glucose spike in mg/dL within 60 minutes.\n\nInput Data:\nThe AI will receive JSON input containing meal details, including:\n- Dish Name: The name of the food item consumed.\n- Quantity: The amount of the food item in grams or milliliters.\n- Glycemic Index (GI): The food’s GI value.\n- Glycemic Load (GL): The food’s GL value.\n- Pre-meal Glucose Level (Optional): The user’s glucose level before eating.\n\nOutput Format:\nThe AI must return a JSON response containing:\n- glucoseSpike: A numerical value representing the predicted glucose spike in mg/dL.\n\nProcessing Rules:\n- The prediction should be based on scientific research on GI, GL, and meal absorption rates.\n- If pre-meal glucose data is provided, adjust the prediction dynamically based on the expected body response.\n- The response must be a valid JSON object containing only the glucose spike value.\n\nExample JSON Response:\n{\n  \"glucoseSpike\": 45\n}\n\nIntegration Notes:\n- The AI should provide only the numerical glucose spike prediction, with no additional text or recommendations.\n- The response format should always be strictly JSON.\n- The model should use structured calculations based on meal data and past research.\n",
});

const generationConfig = {
    temperature: 0.15,
          topP: 0.95,
          maxOutputTokens: 8192,
};

const SugarSpikeAnalyzer = async (mealData) => {
    const chatSession = model.startChat({
        generationConfig,
        history: []
    });
    console.log(mealData)
    const result = await chatSession.sendMessage(JSON.stringify(mealData));
    console.log(result)
    return result.response.text;
};

export default SugarSpikeAnalyzer;
