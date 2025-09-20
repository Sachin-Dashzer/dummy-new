"use client";

import { useState } from "react";
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
  Save,
  ArrowLeft,
  Edit3,
} from "lucide-react";

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  options = [],
}) {
  const baseClasses =
    "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm";

  if (type === "select") {
    return (
      <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          className={baseClasses}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          className={`${baseClasses} min-h-[120px] resize-vertical`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
        />
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <input
          type="checkbox"
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={value}
          onChange={onChange}
        />
        <label className="text-sm font-medium text-gray-700">
          {placeholder}
        </label>
      </div>
    );
  }

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        className={baseClasses}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default function PatientEditDetails() {
  const [step, setStep] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [formData, setFormData] = useState({
    personal: {
      name: "John Doe",
      phone: "+91-9876543210",
      email: "john.doe@email.com",
      age: "26-35",
      gender: "MALE",
      location: "Delhi",
      address: "123 Main Street, New Delhi",
      visitDate: "2024-01-15",
      reference: "Dr. Smith Referral",
      package: "FUE",
    },
    counselling: {
      counsellor: "Dr. Sonu Sharma",
      techniqueSuggested: "FUE",
      graftsSuggested: "2000-2500",
      packageQuoted: "150000",
      readyForSurgery: true,
      notes: "Patient is ready for procedure. Good donor area condition.",
      medicines: ["Finasteride 1mg", "Minoxidil 5%"],
    },
    payments: {
      totalQuoted: "150000",
      amountReceived: "75000",
      pendingAmount: "75000",
      medicineAmount: "5000",
      transactions: [
        { date: "2024-01-15", method: "UPI", amount: "25000" },
        { date: "2024-01-20", method: "Cash", amount: "50000" },
      ],
    },
    medical: {
      allergies: "No known allergies",
      medicalHistory: "NO",
      bloodGroup: "B+",
      sugar: "Normal",
      bp: "Normal",
      pulse: "Normal",
      weight: "Normal",
    },
    surgery: {
      surgeryDate: "2024-02-10",
      technique: "FUE",
      graftsPlanned: "2000-2500",
      graftsImplanted: "2300",
      donorCondition: "Good",
      doctor: "Dr. Sonu Sharma",
      seniorTech: "Tech-001",
      implanterRight: "Implanter-R01",
      implanterLeft: "Implanter-L01",
      graftingPerson: "Grafter-01",
      helper: "Helper-01",
    },
    documents: {
      images: [
        {
          name: "before_1.jpg",
          path: "documents/images/before_1.jpg",
          size: 2048000,
          uploadedAt: "2024-01-15",
        },
        {
          name: "after_1.jpg",
          path: "documents/images/after_1.jpg",
          size: 1856000,
          uploadedAt: "2024-02-10",
        },
      ],
      suregeryForm: [
        {
          name: "consent_form.pdf",
          path: "documents/surgery/consent_form.pdf",
          size: 512000,
          uploadedAt: "2024-01-15",
        },
      ],
      consultForm: [
        {
          name: "consultation_notes.pdf",
          path: "documents/consult/consultation_notes.pdf",
          size: 256000,
          uploadedAt: "2024-01-15",
        },
      ],
    },
    ops: {
      createdBy: "current_user_id",
      status: "COMPLETED",
      patientId: "PAT-001",
      lastUpdated: "2024-02-10",
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

  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateStatus(null);

    try {
      setFormData((prev) => ({
        ...prev,
        ops: {
          ...prev.ops,
          lastUpdated: new Date().toISOString(),
        },
      }));

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUpdateStatus({
        type: "success",
        message: "Patient details updated successfully!",
      });
    } catch (error) {
      setUpdateStatus({
        type: "error",
        message: "Failed to update patient details. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStep = () => setStep(Math.min(step + 1, 6));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  return (
    <section className="flex min-h-screen bg-gray-50">
      <main className="flex-1 px-12 py-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold flex items-center space-x-2">
                    <Edit3 size={28} />
                    <span>Edit Patient Details</span>
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Patient ID: {formData.ops.patientId} | Status:{" "}
                    {formData.ops.status}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Last Updated</p>
                <p className="font-medium">
                  {new Date(formData.ops.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {updateStatus && (
            <div
              className={`px-8 py-4 ${
                updateStatus.type === "success"
                  ? "bg-green-50 text-green-800 border-l-4 border-green-400"
                  : "bg-red-50 text-red-800 border-l-4 border-red-400"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {updateStatus.type === "success" ? "✓" : "⚠"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{updateStatus.message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {stepConfig.map((stepInfo) => {
                  const Icon = stepInfo.icon;
                  return (
                    <button
                      key={stepInfo.number}
                      onClick={() => setStep(stepInfo.number)}
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                        stepInfo.number === step
                          ? `bg-${stepInfo.color}-600 text-white shadow-lg scale-110`
                          : stepInfo.number < step
                          ? "bg-green-500 text-white shadow-md hover:scale-105"
                          : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                      }`}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Step {step} of {stepConfig.length}: {stepConfig[step - 1].title}
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <User className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Personal Information
                  </h3>
                  <p className="text-gray-600">Update basic personal details</p>
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

            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <FileText className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Counselling Details
                  </h3>
                  <p className="text-gray-600">
                    Update consultation information
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
                    onChange={createChangeHandler(
                      "counselling",
                      "graftsSuggested"
                    )}
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
                    onChange={createChangeHandler(
                      "counselling",
                      "packageQuoted"
                    )}
                    placeholder="Amount in rupees"
                  />

                  <div className="md:col-span-2">
                    <InputField
                      label="Ready for Surgery"
                      type="checkbox"
                      value={formData.counselling.readyForSurgery}
                      onChange={createChangeHandler(
                        "counselling",
                        "readyForSurgery"
                      )}
                      placeholder="Patient is ready for surgery"
                    />
                  </div>

                  <InputField
                    label="Notes"
                    type="textarea"
                    value={formData.counselling.notes}
                    onChange={createChangeHandler("counselling", "notes")}
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
                    Update financial information and transactions
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                  <InputField
                    label="Total Quoted (₹)"
                    type="number"
                    value={formData.payments.totalQuoted}
                    onChange={createChangeHandler("payments", "totalQuoted")}
                    placeholder="Total amount quoted"
                  />

                  <InputField
                    label="Amount Received (₹)"
                    type="number"
                    value={formData.payments.amountReceived}
                    onChange={createChangeHandler("payments", "amountReceived")}
                    placeholder="Amount received"
                  />

                  <InputField
                    label="Pending Amount (₹)"
                    type="number"
                    value={formData.payments.pendingAmount}
                    onChange={createChangeHandler("payments", "pendingAmount")}
                    placeholder="Pending amount"
                  />

                  <InputField
                    label="Medicine Amount (₹)"
                    type="number"
                    value={formData.payments.medicineAmount}
                    onChange={createChangeHandler("payments", "medicineAmount")}
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
                    onChange={createChangeHandler("medical", "allergies")}
                    placeholder="List any known allergies"
                    className="md:col-span-2"
                  />

                  <InputField
                    label="Medical History"
                    type="select"
                    value={formData.medical.medicalHistory}
                    onChange={createChangeHandler("medical", "medicalHistory")}
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
                    onChange={createChangeHandler("medical", "bloodGroup")}
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
                    onChange={createChangeHandler("medical", "sugar")}
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
                    onChange={createChangeHandler("medical", "bp")}
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
                    onChange={createChangeHandler("medical", "pulse")}
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
                    onChange={createChangeHandler("medical", "weight")}
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
                    Update surgical procedure information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                  <InputField
                    label="Surgery Date"
                    type="date"
                    value={formData.surgery.surgeryDate}
                    onChange={createChangeHandler("surgery", "surgeryDate")}
                  />

                  <InputField
                    label="Technique Used"
                    type="select"
                    value={formData.surgery.technique}
                    onChange={createChangeHandler("surgery", "technique")}
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
                    onChange={createChangeHandler("surgery", "graftsPlanned")}
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
                    onChange={createChangeHandler("surgery", "graftsImplanted")}
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
                    onChange={createChangeHandler("surgery", "donorCondition")}
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
                    onChange={createChangeHandler("surgery", "doctor")}
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
                    onChange={createChangeHandler("surgery", "seniorTech")}
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
                    onChange={createChangeHandler("surgery", "implanterRight")}
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
                    onChange={createChangeHandler("surgery", "implanterLeft")}
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
                    onChange={createChangeHandler("surgery", "graftingPerson")}
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
                    onChange={createChangeHandler("surgery", "helper")}
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
                    Document Management
                  </h3>
                  <p className="text-gray-600">
                    Manage patient images and forms
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
                        Add more before/after photos and progress images
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
                        Add More Images
                      </label>
                      {formData.documents.images.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Current Images:
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
                                      Uploaded:{" "}
                                      {new Date(
                                        file.uploadedAt
                                      ).toLocaleDateString()}{" "}
                                      | Size: {(file.size / 1024).toFixed(1)} KB
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
                        Manage consent forms and surgery documents
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
                        Add Surgery Forms
                      </label>
                      {formData.documents.suregeryForm.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Current Surgery Forms:
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
                                        Uploaded:{" "}
                                        {new Date(
                                          file.uploadedAt
                                        ).toLocaleDateString()}{" "}
                                        | Size: {(file.size / 1024).toFixed(1)}{" "}
                                        KB
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
                        Manage consultation notes and assessment forms
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
                        Add Consultation Forms
                      </label>
                      {formData.documents.consultForm.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Current Consultation Forms:
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
                                        Uploaded:{" "}
                                        {new Date(
                                          file.uploadedAt
                                        ).toLocaleDateString()}{" "}
                                        | Size: {(file.size / 1024).toFixed(1)}{" "}
                                        KB
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
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  onClick={prevStep}
                >
                  ← Previous
                </button>
              ) : (
                <div></div>
              )}

              <div className="flex space-x-4">
                {step < 6 && (
                  <button
                    type="button"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                    onClick={nextStep}
                  >
                    Next →
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleUpdate}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={20} />
                      Update Details
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
