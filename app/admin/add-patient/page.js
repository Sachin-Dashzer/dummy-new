"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import InputField from "@/components/InputField";
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

const StepHeader = ({ icon: Icon, title, description, color }) => (
  <div className="text-center mb-8">
    <Icon className={`mx-auto h-16 w-16 text-${color}-500 mb-4`} />
    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const MedicineManager = ({ medicines, onChange, onAdd, onRemove }) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-semibold text-gray-700 mb-3">
      Medicines
    </label>
    {medicines.map((medicine, index) => (
      <div key={index} className="flex items-center space-x-3 mb-3">
        <input
          type="text"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
          value={medicine}
          onChange={(e) => onChange(e.target.value, index)}
          placeholder="Medicine name"
        />
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          onClick={() => onRemove(index)}
        >
          <X size={16} />
        </button>
      </div>
    ))}
    <button
      type="button"
      className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
      onClick={onAdd}
    >
      + Add Medicine
    </button>
  </div>
);

const TransactionManager = ({ transactions, onChange, onAdd, onRemove }) => (
  <div className="md:col-span-2">
    <h4 className="text-lg font-semibold text-gray-700 mb-4">Transactions</h4>
    {transactions.map((transaction, index) => (
      <div key={index} className="bg-gray-50 p-6 rounded-lg mb-4 border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField
            label="Date"
            type="date"
            value={transaction.date || ""}
            onChange={(e) => onChange(index, "date", e.target.value)}
          />
          <InputField
            label="Payment Method"
            type="text"
            value={transaction.method || ""}
            onChange={(e) => onChange(index, "method", e.target.value)}
            placeholder="Payment method"
          />
          <InputField
            label="Service"
            type="select"
            value={transaction.service || ""}
            onChange={(e) => onChange(index, "service", e.target.value)}
            options={[
              { value: "Medicine", label: "Medicine" },
              { value: "transplant", label: "Transplant" },
              { value: "other", label: "Other" },
            ]}
          />
          <InputField
            label="Amount"
            type="number"
            value={transaction.amount || ""}
            onChange={(e) => onChange(index, "amount", e.target.value)}
            placeholder="Transaction amount"
          />
        </div>
        <button
          type="button"
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          onClick={() => onRemove(index)}
        >
          Remove Transaction
        </button>
      </div>
    ))}
    <button
      type="button"
      className="px-6 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium"
      onClick={onAdd}
    >
      + Add Transaction
    </button>
  </div>
);

const DocumentUpload = ({
  title,
  icon: Icon,
  color,
  files,
  onUpload,
  onRemove,
  accept,
  uploadId,
}) => (
  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
    <div className="text-center">
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <input
        type="file"
        multiple
        accept={accept}
        onChange={(e) => onUpload(e.target.files)}
        className="hidden"
        id={uploadId}
      />
      <label
        htmlFor={uploadId}
        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-${color}-600 hover:bg-${color}-700 cursor-pointer transition-colors duration-200`}
      >
        <Upload className="mr-2" size={20} />
        Choose Files
      </label>
      {files.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Files:
          </h5>
          <div className="space-y-2">
            {files.map((filePath, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white px-4 py-3 rounded-md border"
              >
                <div className="flex items-center space-x-3">
                  <Icon size={16} className={`text-${color}-500`} />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      {filePath.split("/").pop()}
                    </span>
                    <p className="text-xs text-gray-500">Path: {filePath}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
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
);

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
    documents: { images: [], suregeryForm: [], consultForm: [] },
    ops: { createdBy: "current_user_id", status: "NEW" },
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
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const createChangeHandler = (section, field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    handleChange(section, field, value);
  };

  const handleArrayChange = (section, field, value, index) => {
    const newArray = [...formData[section][field]];
    newArray[index] = value;
    handleChange(section, field, newArray);
  };

  const addArrayItem = (section, field) => {
    handleChange(section, field, [...formData[section][field], ""]);
  };

  const removeArrayItem = (section, field, index) => {
    const newArray = formData[section][field].filter((_, i) => i !== index);
    handleChange(section, field, newArray);
  };

  const handleFileUpload = (section, files) => {
    Array.from(files).forEach((file) => {
      const filePath = `documents/${section}/${Date.now()}_${file.name}`;
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [section]: [...prev.documents[section], filePath],
        },
      }));
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

  const handleTransactionChange = (index, field, value) => {
    const newTransactions = [...formData.payments.transactions];
    newTransactions[index] = { ...newTransactions[index], [field]: value };
    handleChange("payments", "transactions", newTransactions);
  };

  const addTransaction = () => {
    handleChange("payments", "transactions", [
      ...formData.payments.transactions,
      { date: "", method: "", service: "", amount: "" },
    ]);
  };

  const removeTransaction = (index) => {
    const newTransactions = formData.payments.transactions.filter(
      (_, i) => i !== index
    );
    handleChange("payments", "transactions", newTransactions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/patients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSubmitStatus({
        type: "success",
        message: "Patient registered successfully!",
      });

      // Reset form data
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
      console.error("Error submitting patient data:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.message || "Failed to save patient data. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(Math.min(step + 1, 6));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  return (
    <section className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 px-12 py-4">
        <div className="bg-white overflow-hidden">
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

          <div className="px-8 py-6 border-b border-gray-200">
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
                <StepHeader
                  icon={User}
                  title="Personal Information"
                  description="Let's start with basic details"
                  color="blue"
                />
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
                    label="Age"
                    type="number"
                    value={formData.personal.age}
                    onChange={createChangeHandler("personal", "age")}
                    placeholder="Enter age"
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
                    type="select"
                    value={formData.personal.reference}
                    onChange={createChangeHandler("personal", "reference")}
                    options={[
                      { value: "Nandani", label: "Nandani" },
                      { value: "Anam", label: "Anam" },
                      { value: "Nikita yadav", label: "Nikita yadav" },
                      { value: "Anjali", label: "Anjali" },
                      { value: "Ryan", label: "Ryan" },
                      { value: "Muskan", label: "Muskan" },
                      { value: "Rinky", label: "Rinky" },
                      { value: "Aisha", label: "Aisha" },
                      { value: "Sushma", label: "Sushma" },
                      { value: "Nishi", label: "Nishi" },
                      { value: "aniska", label: "aniska" },
                    ]}
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

            {step === 2 && (
              <div className="space-y-8">
                <StepHeader
                  icon={FileText}
                  title="Counselling Details"
                  description="Professional consultation information"
                  color="green"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                  <InputField
                    label="Counsellor"
                    type="select"
                    value={formData.counselling.counsellor}
                    onChange={createChangeHandler("counselling", "counsellor")}
                    options={[
                      { value: "Ali", label: "Ali" },
                      { value: "Sonu sharma", label: "Sonu sharma" },
                      { value: "Pranendra singh", label: "Pranendra singh" },
                      { value: "Gulnaaz salmani", label: "Gulnaaz salmani" },
                      { value: "Mukul Tyagi", label: "Mukul Tyagi" },
                      { value: "Srishti", label: "Srishti" },
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
                    ]}
                  />
                  <InputField
                    label="Grafts Suggested"
                    type="number"
                    value={formData.counselling.graftsSuggested}
                    onChange={createChangeHandler(
                      "counselling",
                      "graftsSuggested"
                    )}
                    placeholder="Number of grafts"
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
                  <MedicineManager
                    medicines={formData.counselling.medicines}
                    onChange={(value, index) =>
                      handleArrayChange(
                        "counselling",
                        "medicines",
                        value,
                        index
                      )
                    }
                    onAdd={() => addArrayItem("counselling", "medicines")}
                    onRemove={(index) =>
                      removeArrayItem("counselling", "medicines", index)
                    }
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <StepHeader
                  icon={CreditCard}
                  title="Payment Details"
                  description="Financial information and transactions"
                  color="purple"
                />
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
                  <TransactionManager
                    transactions={formData.payments.transactions}
                    onChange={handleTransactionChange}
                    onAdd={addTransaction}
                    onRemove={removeTransaction}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <StepHeader
                  icon={Heart}
                  title="Medical Information"
                  description="Health history and vital signs"
                  color="red"
                />
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
                      { value: "YES", label: "Yes" },
                      { value: "NO", label: "No" },
                      { value: "UNKNOWN", label: "Unknown" },
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
                    type="text"
                    value={formData.medical.sugar}
                    onChange={createChangeHandler("medical", "sugar")}
                    placeholder="Sugar level status"
                  />
                  <InputField
                    label="Blood Pressure"
                    type="text"
                    value={formData.medical.bp}
                    onChange={createChangeHandler("medical", "bp")}
                    placeholder="Blood pressure reading"
                  />
                  <InputField
                    label="Pulse Rate"
                    type="text"
                    value={formData.medical.pulse}
                    onChange={createChangeHandler("medical", "pulse")}
                    placeholder="Pulse rate"
                  />
                  <InputField
                    label="Weight"
                    type="text"
                    value={formData.medical.weight}
                    onChange={createChangeHandler("medical", "weight")}
                    placeholder="Weight"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                <StepHeader
                  icon={Scissors}
                  title="Surgery Details"
                  description="Surgical procedure information"
                  color="orange"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-12">
                  <InputField
                    label="Surgery Date"
                    type="date"
                    value={formData.surgery.surgeryDate}
                    onChange={createChangeHandler("surgery", "surgeryDate")}
                  />
                  <InputField
                    label="Technique Used"
                    type="text"
                    value={formData.surgery.technique}
                    onChange={createChangeHandler("surgery", "technique")}
                    placeholder="Surgical technique"
                  />
                  <InputField
                    label="Grafts Planned"
                    type="number"
                    value={formData.surgery.graftsPlanned}
                    onChange={createChangeHandler("surgery", "graftsPlanned")}
                    placeholder="Number of grafts planned"
                  />
                  <InputField
                    label="Grafts Implanted"
                    type="number"
                    value={formData.surgery.graftsImplanted}
                    onChange={createChangeHandler("surgery", "graftsImplanted")}
                    placeholder="Number of grafts implanted"
                  />
                  <InputField
                    label="Donor Area Condition"
                    type="text"
                    value={formData.surgery.donorCondition}
                    onChange={createChangeHandler("surgery", "donorCondition")}
                    placeholder="Donor area condition"
                  />
                  <InputField
                    label="Operating Doctor"
                    type="select"
                    value={formData.surgery.doctor}
                    onChange={createChangeHandler("surgery", "doctor")}
                    options={[
                      { value: "Pranendra singh", label: "Pranendra singh" },
                      { value: "Pranav", label: "Pranav" },
                      { value: "Srishti", label: "Srishti" },
                    ]}
                  />

                  <InputField
                    label="Senior Technician"
                    type="select"
                    value={formData.surgery.seniorTech}
                    onChange={createChangeHandler("surgery", "seniorTech")}
                    options={[
                      { value: "Aarav Sharma", label: "Aarav Sharma" },
                      { value: "Vihaan Patel", label: "Vihaan Patel" },
                      { value: "Advait Joshi", label: "Advait Joshi" },
                      { value: "Rajesh Kumar", label: "Rajesh Kumar" },
                    ]}
                  />

                  <InputField
                    label="Right Side Implanter"
                    type="select"
                    value={formData.surgery.implanterRight}
                    onChange={createChangeHandler("surgery", "implanterRight")}
                    options={[
                      { value: "Karthik Iyer", label: "Karthik Iyer" },
                      { value: "Rohan Mehta", label: "Rohan Mehta" },
                      { value: "Anika Desai", label: "Anika Desai" },
                      { value: "Priya Singh", label: "Priya Singh" },
                    ]}
                  />

                  <InputField
                    label="Left Side Implanter"
                    type="select"
                    value={formData.surgery.implanterLeft}
                    onChange={createChangeHandler("surgery", "implanterLeft")}
                    options={[
                      { value: "Neha Reddy", label: "Neha Reddy" },
                      { value: "Deepika Nair", label: "Deepika Nair" },
                      { value: "Sneha Gupta", label: "Sneha Gupta" },
                    ]}
                  />

                  <InputField
                    label="Grafting Specialist"
                    type="select"
                    value={formData.surgery.graftingPerson}
                    onChange={createChangeHandler("surgery", "graftingPerson")}
                    options={[
                      { value: "Zara Ahmed", label: "Zara Ahmed" },
                      { value: "Arjun Kapoor", label: "Arjun Kapoor" },
                      { value: "Sameer Ali", label: "Sameer Ali" },
                      { value: "Kavya Srinivasan", label: "Kavya Srinivasan" },
                      { value: "Ritu Choudhary", label: "Ritu Choudhary" },
                    ]}
                  />

                  <InputField
                    label="Surgery Helper"
                    type="text"
                    value={formData.surgery.helper}
                    onChange={createChangeHandler("surgery", "helper")}
                    placeholder="Helper name"
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-8">
                <StepHeader
                  icon={FileUp}
                  title="Document Upload"
                  description="Upload patient images and forms (stored offline)"
                  color="indigo"
                />
                <div className="space-y-8">
                  <DocumentUpload
                    title="Patient Images"
                    icon={Image}
                    color="indigo"
                    files={formData.documents.images}
                    onUpload={(files) => handleFileUpload("images", files)}
                    onRemove={(index) => removeFile("images", index)}
                    accept="image/*"
                    uploadId="images-upload"
                  />
                  <DocumentUpload
                    title="Surgery Forms"
                    icon={FileText}
                    color="green"
                    files={formData.documents.suregeryForm}
                    onUpload={(files) =>
                      handleFileUpload("suregeryForm", files)
                    }
                    onRemove={(index) => removeFile("suregeryForm", index)}
                    accept=".pdf,.doc,.docx"
                    uploadId="surgery-upload"
                  />
                  <DocumentUpload
                    title="Consultation Forms"
                    icon={Calendar}
                    color="purple"
                    files={formData.documents.consultForm}
                    onUpload={(files) => handleFileUpload("consultForm", files)}
                    onRemove={(index) => removeFile("consultForm", index)}
                    accept=".pdf,.doc,.docx"
                    uploadId="consult-upload"
                  />
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
                  type="button"
                  onClick={handleSubmit}
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
