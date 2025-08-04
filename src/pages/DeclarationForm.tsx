import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createDeclaration } from '../services/api';
import type { CreateDeclarationRequest } from '../types';

const DeclarationForm = () => {
  const [formData, setFormData] = useState<CreateDeclarationRequest>({
    name: '',
    temperature: 0,
    hasSymptoms: false,
    contactWithCovid: false
  });

  const [step, setStep] = useState(1);
  const [temperatureInput, setTemperatureInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!temperatureInput) {
        newErrors.temperature = 'Temperature is required';
      } else {
        const temp = parseFloat(temperatureInput);
        if (isNaN(temp)) {
          newErrors.temperature = 'Temperature must be a valid number';
        } else if (temp < 35 || temp > 42) {
          newErrors.temperature = 'Temperature must be between 35°C and 42°C';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      const boolValue = value === 'true';
      setFormData({
        ...formData,
        [name]: boolValue
      });
    } else if (name === 'temperature') {
      const regex = /^(\d*\.?\d{0,1})?$/;

      if (regex.test(value)) {
        setTemperatureInput(value);

        if (value) {
          const parsedValue = parseFloat(value);
          if (!isNaN(parsedValue)) {
            setFormData({
              ...formData,
              temperature: parsedValue
            });
          }
        } else {
          setFormData({
            ...formData,
            temperature: 0
          });
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      await createDeclaration(formData)
      setSubmitResult({
        success: true,
        message: 'Declaration submitted successfully.'
      })

      setFormData({
        name: '',
        temperature: 0,
        hasSymptoms: false,
        contactWithCovid: false
      })
      setTemperatureInput('')
      setStep(1)
    } catch (error) {
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit declaration'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="mb-5">
              <label htmlFor="name" className="block text-md font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-black border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-md text-red-600">{errors.name}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="temperature" className="block text-md font-medium text-gray-700 mb-1">
                Body Temperature (°C)
              </label>
              <input
                type="text"
                id="temperature"
                name="temperature"
                value={temperatureInput}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border text-black rounded-md ${errors.temperature ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter body temperature (e.g., 36.5)"
              />
              {errors.temperature && <p className="mt-1 text-md text-red-600">{errors.temperature}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )

      case 2:
        return (
          <div className="mb-6">
            <p className="text-md font-medium text-gray-700 mb-3">
              Do you have any of the following symptoms now or within the last 14 days (even if your symptoms are mild):
            </p>
            <p className="text-md font-medium text-gray-700 mb-6">
              Cough, smell/taste impairment, fever, breathing difficulties, body aches,
              headaches, fatigue, sore throat, diarrhea, runny nose?
            </p>

            <div className="flex flex-col space-y-3 mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasSymptoms: true })}
                className={`w-full py-3 px-4 border rounded-md text-left flex items-center cursor-pointer ${formData.hasSymptoms
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className="h-4 w-4 mr-2 rounded-full border border-gray-400 flex-shrink-0 flex items-center justify-center">
                  {formData.hasSymptoms && <span className="h-2 w-2 bg-blue-600 rounded-full"></span>}
                </span>
                <span>Yes</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasSymptoms: false })}
                className={`w-full py-3 px-4 border rounded-md text-left flex items-center cursor-pointer ${!formData.hasSymptoms
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className="h-4 w-4 mr-2 rounded-full border border-gray-400 flex-shrink-0 flex items-center justify-center">
                  {!formData.hasSymptoms && <span className="h-2 w-2 bg-blue-600 rounded-full"></span>}
                </span>
                <span>No</span>
              </button>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="mb-6">
            <p className="text-md font-medium text-gray-700 mb-6">
              Have you been in contact with anyone suspected or diagnosed with Covid-19
              within the last 14 days?
            </p>

            <div className="flex flex-col space-y-3 mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactWithCovid: true })}
                className={`w-full py-3 px-4 border rounded-md text-left flex items-center cursor-pointer ${formData.contactWithCovid
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className="h-4 w-4 mr-2 rounded-full border border-gray-400 flex-shrink-0 flex items-center justify-center">
                  {formData.contactWithCovid && <span className="h-2 w-2 bg-blue-600 rounded-full"></span>}
                </span>
                <span>Yes</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactWithCovid: false })}
                className={`w-full py-3 px-4 border rounded-md text-left flex items-center cursor-pointer ${!formData.contactWithCovid
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className="h-4 w-4 mr-2 rounded-full border border-gray-400 flex-shrink-0 flex items-center justify-center">
                  {!formData.contactWithCovid && <span className="h-2 w-2 bg-blue-600 rounded-full"></span>}
                </span>
                <span>No</span>
              </button>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Review
              </button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Your Declaration</h3>
            <p className="text-md text-gray-500 mb-6">Please ensure all information is accurate before submitting the form. Select "Submit Declaration" if all information is correct.</p>

            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="text-md font-medium text-gray-500">Full Name</h4>
                  <p className="mt-1 text-md text-gray-900">{formData.name}</p>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-500">Body Temperature</h4>
                  <p className="mt-1 text-md text-gray-900">{formData.temperature}°C</p>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-500">Do you have any symptoms?</h4>
                  <p className="mt-1 text-md">
                    {formData.hasSymptoms ? "Yes" : "No"}
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-500">Contact with Covid-19 case?</h4>
                  <p className="mt-1 text-md">
                    {formData.contactWithCovid ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Declaration'}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderProgressBar = () => {
    return (
      <div className="my-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              1
            </div>
          </div>

          <div className={`flex-grow h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              2
            </div>
          </div>

          <div className={`flex-grow h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              3
            </div>
          </div>

          <div className={`flex-grow h-1 mx-2 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

          <div className="flex flex-col items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
              4
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSuccessScreen = () => {
    return (
      <div className="text-center py-6">
        <p className="text-lg text-gray-800 mb-6">Declaration submitted successfully.</p>
        <button
          type="button"
          onClick={() => setSubmitResult(null)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Submit Another Declaration
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-center text-gray-800">Submit New Declaration</h2>

        {submitResult && submitResult.success ? (
          renderSuccessScreen()
        ) : submitResult && !submitResult.success ? (
          <>
            <div className="mb-6 mt-6 p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
              <p className="font-medium">Oops! Something went wrong.</p>
              <p>{submitResult.message}</p>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setSubmitResult(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            {renderProgressBar()}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeclarationForm;