import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    personal: {
      name: String,
      phone: String,
      email: String,
      age: Number,
      gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHERS"],
      },
      location: {
        type: String,
        enum: ["Delhi", "Mumbai", "Hyderabad"],
      },
      address: String,
      visitDate: Date,
      reference: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      package: String,
    },
    medical: {
      allergies: String,
      medicalHistory: {
        type: String,
        enum: ["YES", "NO", "UNKNOWN"],
      },
      
      bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      sugar: String,
      bp: String,
      pulse: String,
      weight: String,
    },
    counselling: {
      counsellor: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      techniqueSuggested: {
        type: String,
        enum: ["FUE", "INDIAN DHI", "DHI", "HYBRID"],
      },
      graftsSuggested: Number,
      packageQuoted: Number,
      readyForSurgery: { type: Boolean, default: false },
      notes: String,
      medicines : [String]
    },
    surgery: {
      surgeryDate: Date,
      technique: {
        type: String,
      },
      graftsPlanned: Number,
      graftsImplanted: Number,
      donorCondition: String,
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      seniorTech: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      implanterRight: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      implanterLeft: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      graftingPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      helper: String,
    },
    payments: {
      totalQuoted: Number,
      amountReceived: Number,
      pendingAmount: Number,
      medicineAmount: Number,
      transactions: [
        {
          date: Date,
          method: String,
          amount: Number,
        },
      ],
    },
    documents: {
      images : [String],
      suregeryForm: [String],
      consultForm: [String],
    },
    ops: {
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: [
          "NEW",
          "COUNSELLING",
          "READY",
          "SURGERY_SCHEDULED",
          "POST_OP",
          "CLOSED",
        ],
        default: "NEW",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Patient ||
  mongoose.model("Patient", patientSchema);
