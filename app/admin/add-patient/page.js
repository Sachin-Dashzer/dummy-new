"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import InputField from "@/components/InputField"; // Move InputField to separate file
import {
  Upload,
  X,
  FileText,
  Image,
  Calendar,
  User,
  Heart,
  CreditCard,
  Scissors,
  FileUp,
} from "lucide-react";

export default function PatientRegistration() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [formData, setFormData] = useState({
    personal: {
      name: "",
      phone: "",
      email: "",
      age: "",
      gender: "",
      location: "",
      address: "",
      visitDate: "",
      reference: "",
      package: "",
    },
    counselling: {
      counsellor: "",
      techniqueSuggested: "",
      graftsSuggested: "",
      packageQuoted: "",
      readyForSurgery: false,
      notes: "",
      medicines: [],
    },
    payments: {
      totalQuoted: "",
      amountReceived: "",
      pendingAmount: "",
      medicineAmount: "",
      transactions: [],
    },
    medical: {
      allergies: "",
      medicalHistory: "",
      bloodGroup: "",
      sugar: "",
      bp: "",
      pulse: "",
      weight: "",
    },
    surgery: {
      surgeryDate: "",
      technique: "",
      graftsPlanned: "",
      graftsImplanted: "",
      donorCondition: "",
      doctor: "",
      seniorTech: "",
      implanterRight: "",
      implanterLeft: "",
      graftingPerson: "",
      helper: "",
    },
    documents: {
      images: [],
      suregeryForm: [],
      consultForm: [],
    },
    ops: {
      createdBy: "current_user_id",
      status: "NEW",
    },
  });

  const stepConfig = [
    { number: 1, title: "Personal Details", icon: User, color: "blue" },
    { number: 2, title: "Counsellor Details", icon: FileText, color: "green" },
    { number: 3, title: "Payment Details", icon: CreditCard, color: "purple" },
    { number: 4, title: "Medical Information", icon: Heart, color: "red" },
    { number: 5, title: "Surgery Details", icon: Scissors, color: "orange" },
    { number: 6, title: "Document Upload", icon: FileUp, color: "indigo" },
  ];

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Create change handler for easier usage
  const createChangeHandler = (section, field) => {
    return (e) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      handleChange(section, field, value);
    };
  };

  const handleArrayChange = (section, field, value, index) => {
    const newArray = [...formData[section][field]];
    newArray[index] = value;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newArray,
      },
    }));
  };

  const addArrayItem = (section, field) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], ""],
      },
    }));
  };

  const removeArrayItem = (section, field, index) => {
    const newArray = formData[section][field].filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newArray,
      },
    }));
  };

  const handleFileUpload = (section, files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: e.target.result,
          path: `documents/${section}/${Date.now()}_${file.name}`,
          uploadedAt: new Date().toISOString(),
        };

        setFormData((prev) => ({
          ...prev,
          documents: {
            ...prev.documents,
            [section]: [...prev.documents[section], fileData],
          },
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [section]: prev.documents[section].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitStatus({
        type: "success",
        message: "Patient registered successfully! Data stored offline.",
      });

      setFormData({
        personal: {
          name: "",
          phone: "",
          email: "",
          age: "",
          gender: "",
          location: "",
          address: "",
          visitDate: "",
          reference: "",
          package: "",
        },
        counselling: {
          counsellor: "",
          techniqueSuggested: "",
          graftsSuggested: "",
          packageQuoted: "",
          readyForSurgery: false,
          notes: "",
          medicines: [],
        },
        payments: {
          totalQuoted: "",
          amountReceived: "",
          pendingAmount: "",
          medicineAmount: "",
          transactions: [],
        },
        medical: {
          allergies: "",
          medicalHistory: "",
          bloodGroup: "",
          sugar: "",
          bp: "",
          pulse: "",
          weight: "",
        },
        surgery: {
          surgeryDate: "",
          technique: "",
          graftsPlanned: "",
          graftsImplanted: "",
          donorCondition: "",
          doctor: "",
          seniorTech: "",
          implanterRight: "",
          implanterLeft: "",
          graftingPerson: "",
          helper: "",
        },
        documents: { images: [], suregeryForm: [], consultForm: [] },
        ops: { createdBy: "current_user_id", status: "NEW" },
      });
      setStep(1);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to save patient data. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(Math.min(step + 1, 6));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  // REMOVED InputField component definition from here

  return (
    <section className="flex min-h-screen ">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 px-12 py-4">
        <div className="bg-white  overflow-hidden">
          {submitStatus && (
            <div
              className={`px-8 py-4 ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800 border-l-4 border-green-400"
                  : "bg-red-50 text-red-800 border-l-4 border-red-400"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {submitStatus.type === "success" ? "✓" : "⚠"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="px-8 py-6 border-b border-gray-200 ">
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
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-gray-200 text-gray-500"
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

          <form onSubmit={handleSubmit} className="px-8 py-8">
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <User className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Personal Information
                  </h3>
                  <p className="text-gray-600">
                    Let's start with basic details
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                  <InputField
                    label="Full Name"
                    required
                    value={formData.personal.name}
                    onChange={createChangeHandler("personal", "name")}
                    placeholder="Enter full name"
                  />

                  <InputField
                    label="Phone Number"
                    type="tel"
                    required
                    value={formData.personal.phone}
                    onChange={createChangeHandler("personal", "phone")}
                    placeholder="Enter phone number"
                  />

                  <InputField
                    label="Email Address"
                    type="email"
                    value={formData.personal.email}
                    onChange={createChangeHandler("personal", "email")}
                    placeholder="Enter email address"
                  />

                  <InputField
                    label="Age Group"
                    type="select"
                    value={formData.personal.age}
                    onChange={createChangeHandler("personal", "age")}
                    options={[
                      { value: "18-25", label: "18-25 years" },
                      { value: "26-35", label: "26-35 years" },
                      { value: "36-45", label: "36-45 years" },
                      { value: "46-55", label: "46-55 years" },
                      { value: "56-65", label: "56-65 years" },
                      { value: "65+", label: "65+ years" },
                    ]}
                  />

                  <InputField
                    label="Gender"
                    type="select"
                    value={formData.personal.gender}
                    onChange={createChangeHandler("personal", "gender")}
                    options={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                      { value: "OTHERS", label: "Others" },
                    ]}
                  />

                  <InputField
                    label="Location"
                    type="select"
                    value={formData.personal.location}
                    onChange={createChangeHandler("personal", "location")}
                    options={[
                      { value: "Delhi", label: "Delhi" },
                      { value: "Mumbai", label: "Mumbai" },
                      { value: "Hyderabad", label: "Hyderabad" },
                    ]}
                  />

                  <InputField
                    label="Visit Date"
                    type="date"
                    value={formData.personal.visitDate}
                    onChange={createChangeHandler("personal", "visitDate")}
                  />

                  <InputField
                    label="Reference Source"
                    type="text"
                    value={formData.personal.reference}
                    onChange={createChangeHandler("personal", "reference")}
                    placeholder="Enter Referance Name"
                  />

                  <InputField
                    label="Package Type"
                    type="select"
                    value={formData.personal.package}
                    onChange={createChangeHandler("personal", "package")}
                    options={[
                      { value: "FUE", label: "FUE" },
                      { value: "Indian DHI", label: "Indian DHI" },
                      { value: "Turkish DHI", label: "Turkish DHI" },
                      { value: "PRP", label: "PRP" },
                      { value: "GFC", label: "GFC" },
                      { value: "Other", label: "Other" },
                    ]}
                  />

                  <InputField
                    label="Address"
                    type="textarea"
                    value={formData.personal.address}
                    onChange={createChangeHandler("personal", "address")}
                    placeholder="Complete address"
                    className="md:col-span-2"
                  />
                </div>
              </div>
            )}

            {/* Rest of your form steps remain the same, just update the onChange handlers */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <FileText className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Counselling Details
                  </h3>
                  <p className="text-gray-600">
                    Professional consultation information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                  <InputField
                    label="Counsellor"
                    type="select"
                    value={formData.counselling.counsellor}
                    onChange={createChangeHandler("counselling", "counsellor")}
                    options={[
                      { value: "Dr. Sonu Sharma", label: "Dr. Sonu Sharma" },
                      {
                        value: "Dr. Pranendra singh",
                        label: "Dr. Pranendra singh",
                      },
                      { value: "Dr. Mukul Tyagi", label: "Dr. Mukul Tyagi" },
                      {
                        value: "Dr. Gulnaaz Salmani",
                        label: "Dr. Gulnaaz Salmani",
                      },
                      { value: "Dr. Suraksha", label: "Dr. Suraksha" },
                      { value: "Dr. Amar", label: "Dr. Amar" },
                      { value: "Dr. Avinash", label: "Dr. Avinash" },
                      { value: "Dr. Subareddy", label: "Dr. Subareddy" },
                      { value: "Dr. Ali", label: "Dr. Ali" },
                    ]}
                  />

                  <InputField
                    label="Technique Suggested"
                    type="select"
                    value={formData.counselling.techniqueSuggested}
                    onChange={createChangeHandler(
                      "counselling",
                      "techniqueSuggested"
                    )}
                    options={[
                      {
                        value: "FUE",
                        label: "FUE (Follicular Unit Extraction)",
                      },
                      { value: "INDIAN DHI", label: "INDIAN DHI" },
                      { value: "DHI", label: "DHI (Direct Hair Implantation)" },
                      { value: "HYBRID", label: "HYBRID Technique" },
                      { value: "FUT", label: "FUT (Strip Method)" },
                      { value: "AFUE", label: "Advanced FUE" },
                    ]}
                  />

                  <InputField
                    label="Grafts Suggested"
                    type="select"
                    value={formData.counselling.graftsSuggested}
                    onChange={(e) =>
                      handleChange(
                        "counselling",
                        "graftsSuggested",
                        e.target.value
                      )
                    }
                    options={[
                      { value: "500-1000", label: "500-1000 grafts" },
                      { value: "1000-1500", label: "1000-1500 grafts" },
                      { value: "1500-2000", label: "1500-2000 grafts" },
                      { value: "2000-2500", label: "2000-2500 grafts" },
                      { value: "2500-3000", label: "2500-3000 grafts" },
                      { value: "3000-3500", label: "3000-3500 grafts" },
                      { value: "3500+", label: "3500+ grafts" },
                    ]}
                  />

                  <InputField
                    label="Package Quoted (₹)"
                    type="number"
                    value={formData.counselling.packageQuoted}
                    onChange={(e) =>
                      handleChange(
                        "counselling",
                        "packageQuoted",
                        e.target.value
                      )
                    }
                    placeholder="Amount in rupees"
                  />

                  <div className="md:col-span-2">
                    <InputField
                      label="Ready for Surgery"
                      type="checkbox"
                      value={formData.counselling.readyForSurgery}
                      onChange={(e) =>
                        handleChange(
                          "counselling",
                          "readyForSurgery",
                          e.target.checked
                        )
                      }
                      placeholder="Patient is ready for surgery"
                    />
                  </div>

                  <InputField
                    label="Notes"
                    type="textarea"
                    value={formData.counselling.notes}
                    onChange={(e) =>
                      handleChange("counselling", "notes", e.target.value)
                    }
                    placeholder="Additional counselling notes"
                    className="md:col-span-2"
                  />

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Medicines
                    </label>
                    {formData.counselling.medicines.map((medicine, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 mb-3"
                      >
                        <input
                          type="text"
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                          value={medicine}
                          onChange={(e) =>
                            handleArrayChange(
                              "counselling",
                              "medicines",
                              e.target.value,
                              index
                            )
                          }
                          placeholder="Medicine name"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                          onClick={() =>
                            removeArrayItem("counselling", "medicines", index)
                          }
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
                      onClick={() => addArrayItem("counselling", "medicines")}
                    >
                      + Add Medicine
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <CreditCard className="mx-auto h-16 w-16 text-purple-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Payment Details
                  </h3>
                  <p className="text-gray-600">
                    Financial information and transactions
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                  <InputField
                    label="Total Quoted (₹)"
                    type="number"
                    value={formData.payments.totalQuoted}
                    onChange={(e) =>
                      handleChange("payments", "totalQuoted", e.target.value)
                    }
                    placeholder="Total amount quoted"
                  />

                  <InputField
                    label="Amount Received (₹)"
                    type="number"
                    value={formData.payments.amountReceived}
                    onChange={(e) =>
                      handleChange("payments", "amountReceived", e.target.value)
                    }
                    placeholder="Amount received"
                  />

                  <InputField
                    label="Pending Amount (₹)"
                    type="number"
                    value={formData.payments.pendingAmount}
                    onChange={(e) =>
                      handleChange("payments", "pendingAmount", e.target.value)
                    }
                    placeholder="Pending amount"
                  />

                  <InputField
                    label="Medicine Amount (₹)"
                    type="number"
                    value={formData.payments.medicineAmount}
                    onChange={(e) =>
                      handleChange("payments", "medicineAmount", e.target.value)
                    }
                    placeholder="Medicine cost"
                  />

                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">
                      Transactions
                    </h4>
                    {formData.payments.transactions.map(
                      (transaction, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-6 rounded-lg mb-4 border"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField
                              label="Date"
                              type="date"
                              value={transaction.date || ""}
                              onChange={(e) => {
                                const newTransactions = [
                                  ...formData.payments.transactions,
                                ];
                                newTransactions[index] = {
                                  ...newTransactions[index],
                                  date: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  payments: {
                                    ...prev.payments,
                                    transactions: newTransactions,
                                  },
                                }));
                              }}
                            />
                            <InputField
                              label="Payment Method"
                              type="select"
                              value={transaction.method || ""}
                              onChange={(e) => {
                                const newTransactions = [
                                  ...formData.payments.transactions,
                                ];
                                newTransactions[index] = {
                                  ...newTransactions[index],
                                  method: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  payments: {
                                    ...prev.payments,
                                    transactions: newTransactions,
                                  },
                                }));
                              }}
                              options={[
                                { value: "Cash", label: "Cash" },
                                { value: "UPI", label: "UPI" },
                                { value: "Credit Card", label: "Credit Card" },
                                { value: "Debit Card", label: "Debit Card" },
                                {
                                  value: "Bank Transfer",
                                  label: "Bank Transfer",
                                },
                                { value: "Cheque", label: "Cheque" },
                                { value: "EMI", label: "EMI" },
                              ]}
                            />
                            <InputField
                              label="Amount"
                              type="number"
                              value={transaction.amount || ""}
                              onChange={(e) => {
                                const newTransactions = [
                                  ...formData.payments.transactions,
                                ];
                                newTransactions[index] = {
                                  ...newTransactions[index],
                                  amount: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  payments: {
                                    ...prev.payments,
                                    transactions: newTransactions,
                                  },
                                }));
                              }}
                              placeholder="Transaction amount"
                            />
                          </div>
                          <button
                            type="button"
                            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                            onClick={() => {
                              const newTransactions =
                                formData.payments.transactions.filter(
                                  (_, i) => i !== index
                                );
                              setFormData((prev) => ({
                                ...prev,
                                payments: {
                                  ...prev.payments,
                                  transactions: newTransactions,
                                },
                              }));
                            }}
                          >
                            Remove Transaction
                          </button>
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          payments: {
                            ...prev.payments,
                            transactions: [
                              ...prev.payments.transactions,
                              { date: "", method: "", amount: "" },
                            ],
                          },
                        }));
                      }}
                    >
                      + Add Transaction
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <Heart className="mx-auto h-16 w-16 text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Medical Information
                  </h3>
                  <p className="text-gray-600">
                    Health history and vital signs
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                  <InputField
                    label="Allergies"
                    type="textarea"
                    value={formData.medical.allergies}
                    onChange={(e) =>
                      handleChange("medical", "allergies", e.target.value)
                    }
                    placeholder="List any known allergies"
                    className="md:col-span-2"
                  />

                  <InputField
                    label="Medical History"
                    type="select"
                    value={formData.medical.medicalHistory}
                    onChange={(e) =>
                      handleChange("medical", "medicalHistory", e.target.value)
                    }
                    options={[
                      { value: "YES", label: "Yes - Has Medical History" },
                      { value: "NO", label: "No - No Medical History" },
                      { value: "DIABETES", label: "Diabetes" },
                      { value: "HYPERTENSION", label: "Hypertension" },
                      { value: "HEART_DISEASE", label: "Heart Disease" },
                      { value: "THYROID", label: "Thyroid Issues" },
                      { value: "OTHER", label: "Other Conditions" },
                    ]}
                  />

                  <InputField
                    label="Blood Group"
                    type="select"
                    value={formData.medical.bloodGroup}
                    onChange={(e) =>
                      handleChange("medical", "bloodGroup", e.target.value)
                    }
                    options={[
                      { value: "A+", label: "A+" },
                      { value: "A-", label: "A-" },
                      { value: "B+", label: "B+" },
                      { value: "B-", label: "B-" },
                      { value: "AB+", label: "AB+" },
                      { value: "AB-", label: "AB-" },
                      { value: "O+", label: "O+" },
                      { value: "O-", label: "O-" },
                    ]}
                  />

                  <InputField
                    label="Sugar Level Status"
                    type="select"
                    value={formData.medical.sugar}
                    onChange={(e) =>
                      handleChange("medical", "sugar", e.target.value)
                    }
                    options={[
                      { value: "Normal", label: "Normal (70-140 mg/dL)" },
                      {
                        value: "Borderline",
                        label: "Borderline (140-200 mg/dL)",
                      },
                      { value: "High", label: "High (>200 mg/dL)" },
                      { value: "Low", label: "Low (<70 mg/dL)" },
                      { value: "Not Tested", label: "Not Tested" },
                    ]}
                  />

                  <InputField
                    label="Blood Pressure"
                    type="select"
                    value={formData.medical.bp}
                    onChange={(e) =>
                      handleChange("medical", "bp", e.target.value)
                    }
                    options={[
                      { value: "Normal", label: "Normal (<120/80)" },
                      { value: "Elevated", label: "Elevated (120-129/<80)" },
                      {
                        value: "Stage 1",
                        label: "Stage 1 High (130-139/80-89)",
                      },
                      { value: "Stage 2", label: "Stage 2 High (≥140/≥90)" },
                      { value: "Low", label: "Low Blood Pressure" },
                      { value: "Not Measured", label: "Not Measured" },
                    ]}
                  />

                  <InputField
                    label="Pulse Rate"
                    type="select"
                    value={formData.medical.pulse}
                    onChange={(e) =>
                      handleChange("medical", "pulse", e.target.value)
                    }
                    options={[
                      { value: "Normal", label: "Normal (60-100 bpm)" },
                      { value: "Bradycardia", label: "Slow (<60 bpm)" },
                      { value: "Tachycardia", label: "Fast (>100 bpm)" },
                      { value: "Irregular", label: "Irregular Rhythm" },
                      { value: "Not Checked", label: "Not Checked" },
                    ]}
                  />

                  <InputField
                    label="Weight Category"
                    type="select"
                    value={formData.medical.weight}
                    onChange={(e) =>
                      handleChange("medical", "weight", e.target.value)
                    }
                    options={[
                      { value: "Underweight", label: "Underweight (<50 kg)" },
                      { value: "Normal", label: "Normal (50-70 kg)" },
                      { value: "Overweight", label: "Overweight (70-90 kg)" },
                      { value: "Obese", label: "Obese (>90 kg)" },
                    ]}
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <Scissors className="mx-auto h-16 w-16 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Surgery Details
                  </h3>
                  <p className="text-gray-600">
                    Surgical procedure information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                  <InputField
                    label="Surgery Date"
                    type="date"
                    value={formData.surgery.surgeryDate}
                    onChange={(e) =>
                      handleChange("surgery", "surgeryDate", e.target.value)
                    }
                  />

                  <InputField
                    label="Technique Used"
                    type="select"
                    value={formData.surgery.technique}
                    onChange={(e) =>
                      handleChange("surgery", "technique", e.target.value)
                    }
                    options={[
                      {
                        value: "FUE",
                        label: "FUE (Follicular Unit Extraction)",
                      },
                      { value: "DHI", label: "DHI (Direct Hair Implantation)" },
                      { value: "INDIAN DHI", label: "INDIAN DHI" },
                      { value: "HYBRID", label: "HYBRID Technique" },
                      { value: "FUT", label: "FUT (Strip Method)" },
                      { value: "AFUE", label: "Advanced FUE" },
                    ]}
                  />

                  <InputField
                    label="Grafts Planned"
                    type="select"
                    value={formData.surgery.graftsPlanned}
                    onChange={(e) =>
                      handleChange("surgery", "graftsPlanned", e.target.value)
                    }
                    options={[
                      { value: "500-1000", label: "500-1000 grafts" },
                      { value: "1000-1500", label: "1000-1500 grafts" },
                      { value: "1500-2000", label: "1500-2000 grafts" },
                      { value: "2000-2500", label: "2000-2500 grafts" },
                      { value: "2500-3000", label: "2500-3000 grafts" },
                      { value: "3000-3500", label: "3000-3500 grafts" },
                      { value: "3500+", label: "3500+ grafts" },
                    ]}
                  />

                  <InputField
                    label="Grafts Implanted"
                    type="select"
                    value={formData.surgery.graftsImplanted}
                    onChange={(e) =>
                      handleChange("surgery", "graftsImplanted", e.target.value)
                    }
                    options={[
                      { value: "500-1000", label: "500-1000 grafts" },
                      { value: "1000-1500", label: "1000-1500 grafts" },
                      { value: "1500-2000", label: "1500-2000 grafts" },
                      { value: "2000-2500", label: "2000-2500 grafts" },
                      { value: "2500-3000", label: "2500-3000 grafts" },
                      { value: "3000-3500", label: "3000-3500 grafts" },
                      { value: "3500+", label: "3500+ grafts" },
                    ]}
                  />

                  <InputField
                    label="Donor Area Condition"
                    type="select"
                    value={formData.surgery.donorCondition}
                    onChange={(e) =>
                      handleChange("surgery", "donorCondition", e.target.value)
                    }
                    options={[
                      { value: "Excellent", label: "Excellent" },
                      { value: "Good", label: "Good" },
                      { value: "Average", label: "Average" },
                      { value: "Poor", label: "Poor" },
                      { value: "Limited", label: "Limited Donor Area" },
                    ]}
                  />

                  <InputField
                    label="Operating Doctor"
                    type="select"
                    value={formData.surgery.doctor}
                    onChange={(e) =>
                      handleChange("surgery", "doctor", e.target.value)
                    }
                    options={[
                      { value: "Dr. Sonu Sharma", label: "Dr. Sonu Sharma" },
                      {
                        value: "Dr. Pranendra singh",
                        label: "Dr. Pranendra singh",
                      },
                      { value: "Dr. Mukul Tyagi", label: "Dr. Mukul Tyagi" },
                      {
                        value: "Dr. Gulnaaz Salmani",
                        label: "Dr. Gulnaaz Salmani",
                      },
                      { value: "Dr. Suraksha", label: "Dr. Suraksha" },
                      { value: "Dr. Amar", label: "Dr. Amar" },
                      { value: "Dr. Avinash", label: "Dr. Avinash" },
                      { value: "Dr. Subareddy", label: "Dr. Subareddy" },
                    ]}
                  />

                  <InputField
                    label="Senior Technician"
                    type="select"
                    value={formData.surgery.seniorTech}
                    onChange={(e) =>
                      handleChange("surgery", "seniorTech", e.target.value)
                    }
                    options={[
                      { value: "Tech-001", label: "Senior Tech - Rajesh" },
                      { value: "Tech-002", label: "Senior Tech - Priya" },
                      { value: "Tech-003", label: "Senior Tech - Amit" },
                      { value: "Tech-004", label: "Senior Tech - Kavita" },
                      { value: "Tech-005", label: "Senior Tech - Rohit" },
                    ]}
                  />

                  <InputField
                    label="Right Side Implanter"
                    type="select"
                    value={formData.surgery.implanterRight}
                    onChange={(e) =>
                      handleChange("surgery", "implanterRight", e.target.value)
                    }
                    options={[
                      { value: "Implanter-R01", label: "Implanter - Suresh" },
                      { value: "Implanter-R02", label: "Implanter - Meera" },
                      { value: "Implanter-R03", label: "Implanter - Vikash" },
                      { value: "Implanter-R04", label: "Implanter - Sunita" },
                    ]}
                  />

                  <InputField
                    label="Left Side Implanter"
                    type="select"
                    value={formData.surgery.implanterLeft}
                    onChange={(e) =>
                      handleChange("surgery", "implanterLeft", e.target.value)
                    }
                    options={[
                      { value: "Implanter-L01", label: "Implanter - Ravi" },
                      { value: "Implanter-L02", label: "Implanter - Pooja" },
                      { value: "Implanter-L03", label: "Implanter - Deepak" },
                      { value: "Implanter-L04", label: "Implanter - Anita" },
                    ]}
                  />

                  <InputField
                    label="Grafting Specialist"
                    type="select"
                    value={formData.surgery.graftingPerson}
                    onChange={(e) =>
                      handleChange("surgery", "graftingPerson", e.target.value)
                    }
                    options={[
                      { value: "Grafter-01", label: "Grafter - Manoj" },
                      { value: "Grafter-02", label: "Grafter - Geeta" },
                      { value: "Grafter-03", label: "Grafter - Arjun" },
                      { value: "Grafter-04", label: "Grafter - Lata" },
                    ]}
                  />

                  <InputField
                    label="Surgery Helper"
                    type="select"
                    value={formData.surgery.helper}
                    onChange={(e) =>
                      handleChange("surgery", "helper", e.target.value)
                    }
                    options={[
                      { value: "Helper-01", label: "Helper - Ramesh" },
                      { value: "Helper-02", label: "Helper - Sita" },
                      { value: "Helper-03", label: "Helper - Kiran" },
                      { value: "Helper-04", label: "Helper - Mohan" },
                    ]}
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <FileUp className="mx-auto h-16 w-16 text-indigo-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Document Upload
                  </h3>
                  <p className="text-gray-600">
                    Upload patient images and forms (stored offline)
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Patient Images
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload before/after photos and progress images
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          handleFileUpload("images", e.target.files)
                        }
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
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Uploaded Images:
                          </h5>
                          <div className="space-y-2">
                            {formData.documents.images.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-white px-4 py-3 rounded-md border"
                              >
                                <div className="flex items-center space-x-3">
                                  <Image size={16} className="text-blue-500" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-700">
                                      {file.name}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                      Path: {file.path} | Size:{" "}
                                      {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile("images", index)}
                                  className="text-red-500 hover:text-red-700 p-1"
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

                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Surgery Forms
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload consent forms and surgery documents
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          handleFileUpload("suregeryForm", e.target.files)
                        }
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
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Uploaded Forms:
                          </h5>
                          <div className="space-y-2">
                            {formData.documents.suregeryForm.map(
                              (file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-white px-4 py-3 rounded-md border"
                                >
                                  <div className="flex items-center space-x-3">
                                    <FileText
                                      size={16}
                                      className="text-green-500"
                                    />
                                    <div>
                                      <span className="text-sm font-medium text-gray-700">
                                        {file.name}
                                      </span>
                                      <p className="text-xs text-gray-500">
                                        Path: {file.path} | Size:{" "}
                                        {(file.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeFile("suregeryForm", index)
                                    }
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Consultation Forms
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload consultation notes and assessment forms
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          handleFileUpload("consultForm", e.target.files)
                        }
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
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Uploaded Forms:
                          </h5>
                          <div className="space-y-2">
                            {formData.documents.consultForm.map(
                              (file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-white px-4 py-3 rounded-md border"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Calendar
                                      size={16}
                                      className="text-purple-500"
                                    />
                                    <div>
                                      <span className="text-sm font-medium text-gray-700">
                                        {file.name}
                                      </span>
                                      <p className="text-xs text-gray-500">
                                        Path: {file.path} | Size:{" "}
                                        {(file.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeFile("consultForm", index)
                                    }
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  type="button" // ✅ prevents auto form submission
                  onClick={handleSubmit} // ✅ call your custom function
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
             5.291A7.962 7.962 0 014 12H0c0 3.042 
             1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </section>
  );
}
