import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, X, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

const medicationData = [
  { name: "Abilify", category: "Antipsychotic" },
  { name: "Abiraterone", category: "Cancer Treatment" },
  { name: "Acetaminophen", category: "Pain Reliever" },
  { name: "Actemra", category: "Immunosuppressant" },
  { name: "Alprazolam", category: "Anti-Anxiety" },
  { name: "Amitriptyline", category: "Antidepressant" },
  { name: "Aspirin", category: "Pain Reliever" },
  { name: "Atorvastatin", category: "Cholesterol Medication" },
  { name: "Azithromycin", category: "Antibiotic" },
  { name: "Benadryl", category: "Antihistamine" },
];

export default function ScrollableMedicationSelection({
  nextStep,
  prevStep,
  setUserData,
}) {
  const [medications] = useState(medicationData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [alphabetFilter, setAlphabetFilter] = useState("");

  const alphabetButtons = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleNext = () => {
    setUserData((prev) => ({ ...prev, medications: selectedMedications }));
    nextStep();
  };

  const filteredMedications = useMemo(() => {
    return medications.filter(
      (med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (alphabetFilter
          ? med.name.toLowerCase().startsWith(alphabetFilter.toLowerCase())
          : true)
    );
  }, [medications, searchTerm, alphabetFilter]);

  const toggleMedication = (medication) => {
    setSelectedMedications((prev) =>
      prev.some((m) => m.name === medication.name)
        ? prev.filter((m) => m.name !== medication.name)
        : [...prev, medication]
    );
  };

  const removeSelectedMedication = (medication) => {
    setSelectedMedications((prev) =>
      prev.filter((m) => m.name !== medication.name)
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl border-gray-200"
          onClick={prevStep}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Progress value={33} className="h-2 w-32" />
        <Button variant="ghost" className="text-sm text-gray-600">
          Skip
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold">What medications do you take?</h1>

      {/* Alphabet Scroll */}
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {alphabetButtons.map((letter) => (
            <button
              key={letter}
              onClick={() =>
                setAlphabetFilter(letter === alphabetFilter ? "" : letter)
              }
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors 
                                ${
                                  alphabetFilter === letter
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search medications"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border rounded-lg focus:outline-blue-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Medication List */}
      <div className="flex-grow overflow-y-auto space-y-2">
        {filteredMedications.map((medication) => (
          <div
            key={medication.name}
            onClick={() => toggleMedication(medication)}
            className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors 
                            ${
                              selectedMedications.some(
                                (m) => m.name === medication.name
                              )
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-50 hover:bg-gray-100"
                            }`}
          >
            <div>
              <div className="font-medium">{medication.name}</div>
              <div className="text-xs text-gray-500">{medication.category}</div>
            </div>
            {selectedMedications.some((m) => m.name === medication.name) && (
              <Check className="h-5 w-5 text-blue-600" />
            )}
          </div>
        ))}
      </div>

      {/* Selected Medications */}
      {selectedMedications.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedMedications.map((medication) => (
              <Badge
                key={medication.name}
                variant="secondary"
                className="flex items-center"
              >
                {medication.name}
                <button
                  onClick={() => removeSelectedMedication(medication)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        className="w-full bg-[#0066FF] text-white rounded-xl py-4 flex items-center justify-center gap-2 text-[16px] font-medium"
        onClick={handleNext}
      >
        Continue
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
