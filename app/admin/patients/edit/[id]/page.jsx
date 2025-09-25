"use client";

import { useState , useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation"; // ✅ useRouter instead of notFound
import { useParams } from "next/navigation";


// SVG Icons as components
const Upload = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17,8 12,3 7,8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const X = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FileText = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14,2 L14,8 L20,8 M14,2 L14,8 L20,8 M20,8 L20,20 C20,21.1045695 19.1045695,22 18,22 L6,22 C4.8954305,22 4,21.1045695 4,20 L4,4 C4,2.8954305 4.8954305,2 6,2 L14,2 Z" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const Image = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </svg>
);

const Calendar = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const User = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Heart = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CreditCard = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const Scissors = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const FileUp = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14,2 L14,8 L20,8 M14,2 L14,8 L20,8 M20,8 L20,20 C20,21.1045695 19.1045695,22 18,22 L6,22 C4.8954305,22 4,21.1045695 4,20 L4,4 C4,2.8954305 4.8954305,2 6,2 L14,2 Z" />
    <polyline points="17,11 12,6 7,11" />
    <line x1="12" y1="6" x2="12" y2="18" />
  </svg>
);

const Save = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
);

const ArrowLeft = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
);

const Edit3 = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

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
            type="select"
            value={transaction.method || ""}
            onChange={(e) => onChange(index, "method", e.target.value)}
            options={[
              { value: "Cash", label: "Cash" },
              { value: "UPI", label: "UPI" },
              { value: "Credit Card", label: "Credit Card" },
              { value: "Debit Card", label: "Debit Card" },
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Cheque", label: "Cheque" },
              { value: "EMI", label: "EMI" },
            ]}
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
        Add More Files
      </label>
      {files.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            Current Files:
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

export default function PatientEditDetails() {
  const [step, setStep] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [updateStatus, setUpdateStatus] = useState(null);
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
      readyForSurgery: true,
      notes: "",
      medicines: ["", ""],
    },
    payments: {
      totalQuoted: "",
      amountReceived: "",
      pendingAmount: "",
      medicineAmount: "",
      transactions: [
        {
          date: "",
          method: "",
          service: "",
          amount: "",
        },
        {
          date: "",
          method: "",
          service: "",
          amount: "",
        },
      ],
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
      images: [""],
      suregeryForm: [""],
      consultForm: [""],
    },
    ops: {
      createdBy: "",
      status: "",
      patientId: "",
      lastUpdated: "",
    },
  });

    const params = useParams();
    const id = params.id;
    const router = useRouter();

    useEffect(() => {
      if (!id) return;
  
      const fetchPatientData = async () => {
        try {
          const res = await fetch(`/api/patients/patient-data?id=${id}`, {
            method: "GET",
          });
  
          if (!res.ok) {
            // ✅ Redirect to custom 404 route
            router.push("/404");
            return;
          }
  
          const data = await res.json();
          console.log(data)
          setFormData(data);
        } catch (err) {
          console.error("Error fetching patient data:", err);
          router.push("/404"); // ✅ Redirect on network error
        }
      };
  
      fetchPatientData();
    }, [id]);
  

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
    <section className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
                <StepHeader
                  icon={User}
                  title="Personal Information"
                  description="Update basic personal details"
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
                  description="Update consultation information"
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
                  description="Update financial information and transactions"
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
                  description="Update surgical procedure information"
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
                  title="Document Management"
                  description="Manage patient images and forms"
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
