"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"; // ✅ useRouter instead of notFound

const PatientProfile = () => {
  const params = useParams();
  const id = params.id;
  const [patientData, setPatientData] = useState(null);
  const router = useRouter(); // ✅ define router



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
        setPatientData(data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        router.push("/404"); // ✅ Redirect on network error
      }
    };

    fetchPatientData();
  }, [id]);

  // ✅ Dynamic import of html2pdf (browser only)
  const downloadPDF = async () => {
    const element = document.getElementById("patient-profile");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 10,
      filename: `patient_${patientData.personal.name.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (!patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header with action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Patient Medical Resume
            </h1>
            <p className="text-gray-600 text-sm">ID: {patientData._id}</p>
          </div>
          <button
            onClick={downloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-md"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </button>
        </div>

        {/* Existing Profile Layout */}
        <div
          id="patient-profile"
          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-4 md:mb-0 md:mr-6 overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={
                    patientData.documents.images[0] ||
                    "/api/placeholder/150/150"
                  }
                  alt={patientData.personal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold">
                  {patientData.personal.name}
                </h2>
                <p className="text-blue-100 mt-1">Hair Transplant Patient</p>
                <div className="flex flex-wrap justify-center md:justify-start mt-3">
                  <div className="bg-blue-500 bg-opacity-25 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2 backdrop-blur-sm">
                    Age: {patientData.personal.age}
                  </div>
                  <div className="bg-blue-500 bg-opacity-25 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2 backdrop-blur-sm">
                    {patientData.personal.gender}
                  </div>
                  <div className="bg-blue-500 bg-opacity-25 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2 backdrop-blur-sm">
                    Blood: {patientData.medical.bloodGroup}
                  </div>
                  <div className="bg-blue-500 bg-opacity-25 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2 backdrop-blur-sm">
                    {patientData.personal.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="px-6 pt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                patientData.ops.status === "NEW"
                  ? "bg-blue-100 text-blue-800"
                  : patientData.ops.status === "POST_OP"
                  ? "bg-green-100 text-green-800"
                  : patientData.ops.status === "SURGERY_SCHEDULED"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {patientData.ops.status.replace("_", " ")}
            </span>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="md:col-span-2">
              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Personal Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{patientData.personal.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{patientData.personal.email}</span>
                    </div>
                    <div className="flex items-start md:col-span-2">
                      <svg
                        className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{patientData.personal.address}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Visit Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600 text-sm">
                          Visit Date:
                        </span>
                        <p className="font-medium">
                          {formatDate(patientData.personal.visitDate)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">
                          Reference:
                        </span>
                        <p className="font-medium">
                          {patientData.personal.reference}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Package:</span>
                        <p className="font-medium">
                          {patientData.personal.package}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Medical Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Blood Group</span>
                      <p className="font-medium">
                        {patientData.medical.bloodGroup}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Allergies</span>
                      <p className="font-medium">
                        {patientData.medical.allergies}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Medical History
                      </span>
                      <p className="font-medium">
                        {patientData.medical.medicalHistory}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Vitals</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-gray-600 text-sm">Sugar</span>
                        <p className="font-medium">
                          {patientData.medical.sugar}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">BP</span>
                        <p className="font-medium">{patientData.medical.bp}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Pulse</span>
                        <p className="font-medium">
                          {patientData.medical.pulse}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Weight</span>
                        <p className="font-medium">
                          {patientData.medical.weight}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Surgery Information */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  Surgery Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">
                        Surgery Date
                      </span>
                      <p className="font-medium">
                        {formatDate(patientData.surgery.surgeryDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Technique</span>
                      <p className="font-medium">
                        {patientData.surgery.technique}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Grafts Planned
                      </span>
                      <p className="font-medium">
                        {patientData.surgery.graftsPlanned}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Grafts Implanted
                      </span>
                      <p className="font-medium">
                        {patientData.surgery.graftsImplanted}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-600 text-sm">
                        Donor Condition
                      </span>
                      <p className="font-medium">
                        {patientData.surgery.donorCondition}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Surgical Team
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600 text-sm">Doctor</span>
                        <p className="font-medium">
                          {patientData.surgery.doctor}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">
                          Senior Technician
                        </span>
                        <p className="font-medium">
                          {patientData.surgery.seniorTech}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">
                          Implanter (Right)
                        </span>
                        <p className="font-medium">
                          {patientData.surgery.implanterRight}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">
                          Implanter (Left)
                        </span>
                        <p className="font-medium">
                          {patientData.surgery.implanterLeft}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">
                          Grafting Person
                        </span>
                        <p className="font-medium">
                          {patientData.surgery.graftingPerson}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Helper</span>
                        <p className="font-medium">
                          {patientData.surgery.helper}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Counselling Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  Counselling Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Counsellor</span>
                      <p className="font-medium">
                        {patientData.counselling.counsellor}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Technique Suggested
                      </span>
                      <p className="font-medium">
                        {patientData.counselling.techniqueSuggested}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Grafts Suggested
                      </span>
                      <p className="font-medium">
                        {patientData.counselling.graftsSuggested}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Package Quoted
                      </span>
                      <p className="font-medium">
                        {formatCurrency(patientData.counselling.packageQuoted)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 text-sm mr-2">
                        Ready for Surgery:
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patientData.counselling.readyForSurgery
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {patientData.counselling.readyForSurgery ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Medicines
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {patientData.counselling.medicines.map(
                        (medicine, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                          >
                            {medicine}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                    <p className="text-gray-600 text-sm bg-white p-3 rounded border">
                      {patientData.counselling.notes}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Payment Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">
                        Total Quoted
                      </span>
                      <span className="font-medium">
                        {formatCurrency(patientData.payments.totalQuoted)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">
                        Amount Received
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(patientData.payments.amountReceived)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">
                        Pending Amount
                      </span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(patientData.payments.pendingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">
                        Medicine Amount
                      </span>
                      <span className="font-medium">
                        {formatCurrency(patientData.payments.medicineAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Transaction History
                    </h4>
                    <div className="space-y-2">
                      {patientData.payments.transactions.map(
                        (transaction, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <div>
                              <span className="text-gray-600">
                                {formatDate(transaction.date)}
                              </span>
                              <span className="text-gray-400 ml-2">
                                ({transaction.method})
                              </span>
                            </div>
                            <span className="font-medium">
                              {formatCurrency(transaction.amount)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                  Documents
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Patient Images
                  </h4>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {patientData.documents.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square border rounded overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Patient image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-blue-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm">Surgery Form</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        View
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm">Consultation Form</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
