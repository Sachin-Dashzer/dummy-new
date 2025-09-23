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
        type : String,
        enum : ["Nandani" , "Anam" , "Nikita yadav" ,  "Anjali" , "Ryan" , "Muskan" , "Rinky" , "Aisha" ,"Sushma" , "Nishi" , "aniska"]
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
        type: String,
        enum : ["Ali" , "Sonu sharma" , "Pranendra singh" , "Gulnaaz salmani" , "Mukul Tyagi" , "Srishti" ]
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
         type: String,
        enum : ["Pranendra singh" , "Pranav" , "Srishti" ]
      },
      seniorTech: {
        type: String,
        enum : ["Aarav Sharma", "Vihaan Patel", "Advait Joshi", "Rajesh Kumar"]
      },
      implanterRight: {
        type: String,
        enum : ["Karthik Iyer", "Rohan Mehta", "Anika Desai", "Priya Singh"]
      },
      implanterLeft: {
        type: String,
        enum : [ "Neha Reddy", "Deepika Nair", "Sneha Gupta"]
      },
      graftingPerson: {
        type: String,
        enum : ["Zara Ahmed", "Arjun Kapoor", "Sameer Ali", "Kavya Srinivasan", "Ritu Choudhary"]
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
          service: {
            type: String,
          },
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
