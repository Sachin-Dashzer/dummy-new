'use client';

import { useState } from 'react';
import { Upload, X, FileText, Image, Calendar, User, Heart, CreditCard, Scissors, FileUp } from 'lucide-react';

export default function PatientRegistration() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    personal: {
      name: '',
      phone: '',
      email: '',
      age: '',
      gender: '',
      location: '',
      address: '',
      visitDate: '',
      reference: '',
      package: ''
    },
    counselling: {
      counsellor: '',
      techniqueSuggested: '',
      graftsSuggested: '',
      packageQuoted: '',
      readyForSurgery: false,
      notes: '',
      medicines: []
    },
    payments: {
      totalQuoted: '',
      amountReceived: '',
      pendingAmount: '',
      medicineAmount: '',
      transactions: []
    },
    medical: {
      allergies: '',
      medicalHistory: '',
      bloodGroup: '',
      sugar: '',
      bp: '',
      pulse: '',
      weight: ''
    },
    surgery: {
      surgeryDate: '',
      technique: '',
      graftsPlanned: '',
      graftsImplanted: '',
      donorCondition: '',
      doctor: '',
      seniorTech: '',
      implanterRight: '',
      implanterLeft: '',
      graftingPerson: '',
      helper: ''
    },
    documents: {
      images: [],
      suregeryForm: [],
      consultForm: []
    },
    ops: {
      createdBy: 'current_user_id',
      status: 'NEW'
    }
  });

  const stepConfig = [
    { number: 1, title: "Personal Details", icon: User, color: "blue" },
    { number: 2, title: "Counsellor Details", icon: FileText, color: "green" },
    { number: 3, title: "Payment Details", icon: CreditCard, color: "purple" },
    { number: 4, title: "Medical Information", icon: Heart, color: "red" },
    { number: 5, title: "Surgery Details", icon: Scissors, color: "orange" },
    { number: 6, title: "Document Upload", icon: FileUp, color: "indigo" }
  ];

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, field, value, index) => {
    const newArray = [...formData[section][field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newArray
      }
    }));
  };

  const addArrayItem = (section, field) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], '']
      }
    }));
  };

  const removeArrayItem = (section, field, index) => {
    const newArray = formData[section][field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newArray
      }
    }));
  };

  const handleFileUpload = (section, files) => {
    const fileNames = Array.from(files).map(file => file.name);
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [section]: [...prev.documents[section], ...fileNames]
      }
    }));
  };

  const removeFile = (section, index) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [section]: prev.documents[section].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Patient registered successfully!' });
        // Reset form after successful submission
        setFormData({
          personal: { name: '', phone: '', email: '', age: '', gender: '', location: '', address: '', visitDate: '', reference: '', package: '' },
          counselling: { counsellor: '', techniqueSuggested: '', graftsSuggested: '', packageQuoted: '', readyForSurgery: false, notes: '', medicines: [] },
          payments: { totalQuoted: '', amountReceived: '', pendingAmount: '', medicineAmount: '', transactions: [] },
          medical: { allergies: '', medicalHistory: '', bloodGroup: '', sugar: '', bp: '', pulse: '', weight: '' },
          surgery: { surgeryDate: '', technique: '', graftsPlanned: '', graftsImplanted: '', donorCondition: '', doctor: '', seniorTech: '', implanterRight: '', implanterLeft: '', graftingPerson: '', helper: '' },
          documents: { images: [], suregeryForm: [], consultForm: [] },
          ops: { createdBy: 'current_user_id', status: 'NEW' }
        });
        setStep(1);
      } else {
        const errorData = await response.json();
        setSubmitStatus({ type: 'error', message: errorData.message || 'Failed to create patient' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(Math.min(step + 1, 6));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const InputField = ({ label, type = "text", required = false, value, onChange, placeholder, options, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'select' ? (
        <select
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm resize-none"
          rows="4"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      ) : type === 'checkbox' ? (
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={value}
            onChange={onChange}
          />
          <span className="text-sm text-gray-700">{placeholder}</span>
        </div>
      ) : (
        <input
          type={type}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold">Patient Registration</h1>
            <p className="text-blue-100 mt-1">Complete patient information form</p>
          </div>

          {/* Progress Steps */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {stepConfig.map((stepInfo) => {
                  const Icon = stepInfo.icon;
                  return (
                    <div
                      key={stepInfo.number}
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                        stepInfo.number === step
                          ? `bg-${stepInfo.color}-600 text-white shadow-lg scale-110`
                          : stepInfo.number < step
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                  );
                })}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Step {step} of {stepConfig.length}: {stepConfig[step - 1].title}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus && (
            <div className={`px-8 py-4 ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-400' : 'bg-red-50 text-red-800 border-l-4 border-red-400'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {submitStatus.type === 'success' ? '✓' : '⚠'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-8 py-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <User className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                  <p className="text-gray-600">Let's start with basic details</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    required
                    value={formData.personal.name}
                    onChange={(e) => handleChange('personal', 'name', e.target.value)}
                    placeholder="Enter full name"
                  />
                  
                  <InputField
                    label="Phone Number"
                    type="tel"
                    required
                    value={formData.personal.phone}
                    onChange={(e) => handleChange('personal', 'phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                  
                  <InputField
                    label="Email Address"
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) => handleChange('personal', 'email', e.target.value)}
                    placeholder="Enter email address"
                  />
                  
                  <InputField
                    label="Age"
                    type="number"
                    value={formData.personal.age}
                    onChange={(e) => handleChange('personal', 'age', e.target.value)}
                    placeholder="Enter age"
                  />
                  
                  <InputField
                    label="Gender"
                    type="select"
                    value={formData.personal.gender}
                    onChange={(e) => handleChange('personal', 'gender', e.target.value)}
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'OTHERS', label: 'Others' }
                    ]}
                  />
                  
                  <InputField
                    label="Location"
                    type="select"
                    value={formData.personal.location}
                    onChange={(e) => handleChange('personal', 'location', e.target.value)}
                    options={[
                      { value: 'Delhi', label: 'Delhi' },
                      { value: 'Mumbai', label: 'Mumbai' },
                      { value: 'Hyderabad', label: 'Hyderabad' }
                    ]}
                  />
                  
                  <InputField
                    label="Visit Date"
                    type="date"
                    value={formData.personal.visitDate}
                    onChange={(e) => handleChange('personal', 'visitDate', e.target.value)}
                  />
                  
                  <InputField
                    label="Reference"
                    value={formData.personal.reference}
                    onChange={(e) => handleChange('personal', 'reference', e.target.value)}
                    placeholder="Reference source"
                  />
                  
                  <InputField
                    label="Package"
                    value={formData.personal.package}
                    onChange={(e) => handleChange('personal', 'package', e.target.value)}
                    placeholder="Package details"
                    className="md:col-span-2"
                  />
                  
                  <InputField
                    label="Address"
                    type="textarea"
                    value={formData.personal.address}
                    onChange={(e) => handleChange('personal', 'address', e.target.value)}
                    placeholder="Complete address"
                    className="md:col-span-2"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Counselling Information */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <FileText className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Counselling Details</h3>
                  <p className="text-gray-600">Professional consultation information</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Counsellor"
                    type="select"
                    value={formData.counselling.counsellor}
                    onChange={(e) => handleChange('counselling', 'counsellor', e.target.value)}
                    options={[
                      { value: 'Dr. Sonu Sharma', label: 'Dr. Sonu Sharma' },
                      { value: 'Dr. Pranendra singh', label: 'Dr. Pranendra singh' },
                      { value: 'Dr. Mukul Tyagi', label: 'Dr. Mukul Tyagi' },
                      { value: 'Dr. Gulnaaz Salmani', label: 'Dr. Gulnaaz Salmani' },
                      { value: 'Dr. Suraksha', label: 'Dr. Suraksha' },
                      { value: 'Dr. Amar', label: 'Dr. Amar' },
                      { value: 'Dr. Avinash', label: 'Dr. Avinash' },
                      { value: 'Dr. Subareddy', label: 'Dr. Subareddy' },
                      { value: 'Dr. Ali', label: 'Dr. Ali' }
                    ]}
                  />
                  
                  <InputField
                    label="Technique Suggested"
                    type="select"
                    value={formData.counselling.techniqueSuggested}
                    onChange={(e) => handleChange('counselling', 'techniqueSuggested', e.target.value)}
                    options={[
                      { value: 'FUE', label: 'FUE' },
                      { value: 'INDIAN DHI', label: 'INDIAN DHI' },
                      { value: 'DHI', label: 'DHI' },
                      { value: 'HYBRID', label: 'HYBRID' }
                    ]}
                  />
                  
                  <InputField
                    label="Grafts Suggested"
                    type="number"
                    value={formData.counselling.graftsSuggested}
                    onChange={(e) => handleChange('counselling', 'graftsSuggested', e.target.value)}
                    placeholder="Number of grafts"
                  />
                  
                  <InputField
                    label="Package Quoted (₹)"
                    type="number"
                    value={formData.counselling.packageQuoted}
                    onChange={(e) => handleChange('counselling', 'packageQuoted', e.target.value)}
                    placeholder="Amount in rupees"
                  />
                  
                  <div className="md:col-span-2">
                    <InputField
                      label="Ready for Surgery"
                      type="checkbox"
                      value={formData.counselling.readyForSurgery}
                      onChange={(e) => handleChange('counselling', 'readyForSurgery', e.target.checked)}
                      placeholder="Patient is ready for surgery"
                    />
                  </div>
                  
                  <InputField
                    label="Notes"
                    type="textarea"
                    value={formData.counselling.notes}
                    onChange={(e) => handleChange('counselling', 'notes', e.target.value)}
                    placeholder="Additional counselling notes"
                    className="md:col-span-2"
                  />
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Medicines</label>
                    {formData.counselling.medicines.map((medicine, index) => (
                      <div key={index} className="flex items-center space-x-3 mb-3">
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                          value={medicine}
                          onChange={(e) => handleArrayChange('counselling', 'medicines', e.target.value, index)}
                          placeholder="Medicine name"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                          onClick={() => removeArrayItem('counselling', 'medicines', index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
                      onClick={() => addArrayItem('counselling', 'medicines')}
                    >
                      + Add Medicine
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <CreditCard className="mx-auto h-16 w-16 text-purple-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Payment Details</h3>
                  <p className="text-gray-600">Financial information and transactions</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Total Quoted (₹)"
                    type="number"
                    value={formData.payments.totalQuoted}
                    onChange={(e) => handleChange('payments', 'totalQuoted', e.target.value)}
                    placeholder="Total amount quoted"
                  />
                  
                  <InputField
                    label="Amount Received (₹)"
                    type="number"
                    value={formData.payments.amountReceived}
                    onChange={(e) => handleChange('payments', 'amountReceived', e.target.value)}
                    placeholder="Amount received"
                  />
                  
                  <InputField
                    label="Pending Amount (₹)"
                    type="number"
                    value={formData.payments.pendingAmount}
                    onChange={(e) => handleChange('payments', 'pendingAmount', e.target.value)}
                    placeholder="Pending amount"
                  />
                  
                  <InputField
                    label="Medicine Amount (₹)"
                    type="number"
                    value={formData.payments.medicineAmount}
                    onChange={(e) => handleChange('payments', 'medicineAmount', e.target.value)}
                    placeholder="Medicine cost"
                  />
                  
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Transactions</h4>
                    {formData.payments.transactions.map((transaction, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg mb-4 border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Date"
                            type="date"
                            value={transaction.date || ''}
                            onChange={(e) => {
                              const newTransactions = [...formData.payments.transactions];
                              newTransactions[index] = { ...newTransactions[index], date: e.target.value };
                              setFormData(prev => ({
                                ...prev,
                                payments: { ...prev.payments, transactions: newTransactions }
                              }));
                            }}
                          />
                          <InputField
                            label="Method"
                            value={transaction.method || ''}
                            onChange={(e) => {
                              const newTransactions = [...formData.payments.transactions];
                              newTransactions[index] = { ...newTransactions[index], method: e.target.value };
                              setFormData(prev => ({
                                ...prev,
                                payments: { ...prev.payments, transactions: newTransactions }
                              }));
                            }}
                            placeholder="Payment method"
                          />
                          <InputField
                            label="Amount"
                            type="number"
                            value={transaction.amount || ''}
                            onChange={(e) => {
                              const newTransactions = [...formData.payments.transactions];
                              newTransactions[index] = { ...newTransactions[index], amount: e.target.value };
                              setFormData(prev => ({
                                ...prev,
                                payments: { ...prev.payments, transactions: newTransactions }
                              }));
                            }}
                            placeholder="Transaction amount"
                          />
                        </div>
                        <button
                          type="button"
                          className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                          onClick={() => {
                            const newTransactions = formData.payments.transactions.filter((_, i) => i !== index);
                            setFormData(prev => ({
                              ...prev,
                              payments: { ...prev.payments, transactions: newTransactions }
                            }));
                          }}
                        >
                          Remove Transaction
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          payments: {
                            ...prev.payments,
                            transactions: [...prev.payments.transactions, { date: '', method: '', amount: '' }]
                          }
                        }));
                      }}
                    >
                      + Add Transaction
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Medical Information */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <Heart className="mx-auto h-16 w-16 text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Medical Information</h3>
                  <p className="text-gray-600">Health history and vital signs</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Allergies"
                    type="textarea"
                    value={formData.medical.allergies}
                    onChange={(e) => handleChange('medical', 'allergies', e.target.value)}
                    placeholder="List any known allergies"
                    className="md:col-span-2"
                  />
                  
                  <InputField
                    label="Medical History"
                    type="select"
                    value={formData.medical.medicalHistory}
                    onChange={(e) => handleChange('medical', 'medicalHistory', e.target.value)}
                    options={[
                      { value: 'YES', label: 'Yes' },
                      { value: 'NO', label: 'No' },
                      { value: 'UNKNOWN', label: 'Unknown' }
                    ]}
                  />
                  
                  <InputField
                    label="Blood Group"
                    type="select"
                    value={formData.medical.bloodGroup}
                    onChange={(e) => handleChange('medical', 'bloodGroup', e.target.value)}
                    options={[
                      { value: 'A+', label: 'A+' },
                      { value: 'A-', label: 'A-' },
                      { value: 'B+', label: 'B+' },
                      { value: 'B-', label: 'B-' },
                      { value: 'AB+', label: 'AB+' },
                      { value: 'AB-', label: 'AB-' },
                      { value: 'O+', label: 'O+' },
                      { value: 'O-', label: 'O-' }
                    ]}
                  />
                  
                  <InputField
                    label="Sugar Level"
                    value={formData.medical.sugar}
                    onChange={(e) => handleChange('medical', 'sugar', e.target.value)}
                    placeholder="Blood sugar level"
                  />
                  
                  <InputField
                    label="Blood Pressure"
                    value={formData.medical.bp}
                    onChange={(e) => handleChange('medical', 'bp', e.target.value)}
                    placeholder="Blood pressure reading"
                  />
                  
                  <InputField
                    label="Pulse Rate"
                    value={formData.medical.pulse}
                    onChange={(e) => handleChange('medical', 'pulse', e.target.value)}
                    placeholder="Pulse rate (bpm)"
                  />
                  
                  <InputField
                    label="Weight (kg)"
                    value={formData.medical.weight}
                    onChange={(e) => handleChange('medical', 'weight', e.target.value)}
                    placeholder="Weight in kilograms"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Surgery Information */}
            {step === 5 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <Scissors className="mx-auto h-16 w-16 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Surgery Details</h3>
                  <p className="text-gray-600">Surgical procedure information</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Surgery Date"
                    type="date"
                    value={formData.surgery.surgeryDate}
                    onChange={(e) => handleChange('surgery', 'surgeryDate', e.target.value)}
                  />
                  
                  <InputField
                    label="Technique"
                    value={formData.surgery.technique}
                    onChange={(e) => handleChange('surgery', 'technique', e.target.value)}
                    placeholder="Surgical technique used"
                  />
                  
                  <InputField
                    label="Grafts Planned"
                    type="number"
                    value={formData.surgery.graftsPlanned}
                    onChange={(e) => handleChange('surgery', 'graftsPlanned', e.target.value)}
                    placeholder="Number of grafts planned"
                  />
                  
                  <InputField
                    label="Grafts Implanted"
                    type="number"
                    value={formData.surgery.graftsImplanted}
                    onChange={(e) => handleChange('surgery', 'graftsImplanted', e.target.value)}
                    placeholder="Actual grafts implanted"
                  />
                  
                  <InputField
                    label="Donor Condition"
                    value={formData.surgery.donorCondition}
                    onChange={(e) => handleChange('surgery', 'donorCondition', e.target.value)}
                    placeholder="Donor area condition"
                  />
                  
                  <InputField
                    label="Doctor"
                    value={formData.surgery.doctor}
                    onChange={(e) => handleChange('surgery', 'doctor', e.target.value)}
                    placeholder="Operating doctor name"
                  />
                  
                  <InputField
                    label="Senior Technician"
                    value={formData.surgery.seniorTech}
                    onChange={(e) => handleChange('surgery', 'seniorTech', e.target.value)}
                    placeholder="Senior technician name"
                  />
                  
                  <InputField
                    label="Implanter (Right)"
                    value={formData.surgery.implanterRight}
                    onChange={(e) => handleChange('surgery', 'implanterRight', e.target.value)}
                    placeholder="Right side implanter"
                  />
                  
                  <InputField
                    label="Implanter (Left)"
                    value={formData.surgery.implanterLeft}
                    onChange={(e) => handleChange('surgery', 'implanterLeft', e.target.value)}
                    placeholder="Left side implanter"
                  />
                  
                  <InputField
                    label="Grafting Person"
                    value={formData.surgery.graftingPerson}
                    onChange={(e) => handleChange('surgery', 'graftingPerson', e.target.value)}
                    placeholder="Person handling grafting"
                  />
                  
                  <InputField
                    label="Helper"
                    value={formData.surgery.helper}
                    onChange={(e) => handleChange('surgery', 'helper', e.target.value)}
                    placeholder="Surgery helper name"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Document Upload */}
            {step === 6 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <FileUp className="mx-auto h-16 w-16 text-indigo-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">Document Upload</h3>
                  <p className="text-gray-600">Upload patient images and forms</p>
                </div>
                
                <div className="space-y-8">
                  {/* Patient Images */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Patient Images</h4>
                      <p className="text-sm text-gray-600 mb-4">Upload before/after photos and progress images</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload('images', e.target.files)}
                        className="hidden"
                        id="images-upload"
                      />
                      <label
                        htmlFor="images-upload"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer transition-colors duration-200"
                      >
                        <Upload className="mr-2" size={20} />
                        Choose Images
                      </label>
                      {formData.documents.images.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h5>
                          <div className="flex flex-wrap gap-2">
                            {formData.documents.images.map((file, index) => (
                              <div key={index} className="flex items-center bg-white px-3 py-2 rounded-md border">
                                <span className="text-sm text-gray-700 mr-2">{file}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('images', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Surgery Forms */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Surgery Forms</h4>
                      <p className="text-sm text-gray-600 mb-4">Upload consent forms and surgery documents</p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload('suregeryForm', e.target.files)}
                        className="hidden"
                        id="surgery-upload"
                      />
                      <label
                        htmlFor="surgery-upload"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 cursor-pointer transition-colors duration-200"
                      >
                        <Upload className="mr-2" size={20} />
                        Choose Surgery Forms
                      </label>
                      {formData.documents.suregeryForm.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Uploaded Forms:</h5>
                          <div className="flex flex-wrap gap-2">
                            {formData.documents.suregeryForm.map((file, index) => (
                              <div key={index} className="flex items-center bg-white px-3 py-2 rounded-md border">
                                <span className="text-sm text-gray-700 mr-2">{file}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('suregeryForm', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Consultation Forms */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Consultation Forms</h4>
                      <p className="text-sm text-gray-600 mb-4">Upload consultation notes and assessment forms</p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload('consultForm', e.target.files)}
                        className="hidden"
                        id="consult-upload"
                      />
                      <label
                        htmlFor="consult-upload"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 cursor-pointer transition-colors duration-200"
                      >
                        <Upload className="mr-2" size={20} />
                        Choose Consultation Forms
                      </label>
                      {formData.documents.consultForm.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Uploaded Forms:</h5>
                          <div className="flex flex-wrap gap-2">
                            {formData.documents.consultForm.map((file, index) => (
                              <div key={index} className="flex items-center bg-white px-3 py-2 rounded-md border">
                                <span className="text-sm text-gray-700 mr-2">{file}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile('consultForm', index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  onClick={prevStep}
                >
                  ← Previous
                </button>
              ) : (
                <div></div>
              )}

              {step < 6 ? (
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  onClick={nextStep}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}