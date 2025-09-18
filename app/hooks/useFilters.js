import { useMemo } from "react";
import { usePatients } from "./usePatients";

export function useFilterPatients(date = null, branch = null) {
  const { patients, loading, error, refresh } = usePatients();

  const filteredPatients = useMemo(() => {
    if (!patients) return [];
    
    return patients.filter((item) => {
      // Handle null/undefined values safely
      const visitDate = item.personal?.visitDate;
      const location = item.personal?.location;
      
      // Check if both date and branch are provided, otherwise return all patients
      // if (date === null && branch === null) return true;
      // if (date === null) return location === branch;
      // if (branch === null) return visitDate === date;
      
      return location === branch;
    });
  }, [patients, date, branch]); // Added missing dependencies

  const filterFunction = useMemo(() => {
    if (!filteredPatients) return null;

    return {
      allpatients: patients,
      appointments: filteredPatients.length,
      visited: filteredPatients.filter((item) => 
        item?.counselling?.counsellor !== null
      ).length,
      surgeryConfirmations: filteredPatients.filter((item) => 
        item?.counselling?.readyForSurgery === true
      ).length, 
      surgeries: patients.filter((item) => 
        item.surgery?.surgeryDate === date
      ).length,
      amountReceived: filteredPatients.reduce((acc, item) => 
        acc + (item.payments?.amountReceived || 0), 0
      ),
    };
  }, [filteredPatients, patients, date]); // Added missing dependencies

  return { 
    patients: filterFunction, 
    loading, 
    error, 
    refresh 
  };
}