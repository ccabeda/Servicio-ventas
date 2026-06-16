export const businessHoursMethods = {
  getBusinessWeekTemplate() {
    return [
      { key: "lunes", label: "Lunes", open: false, ranges: [{ from: "09:00", to: "18:00" }] },
      { key: "martes", label: "Martes", open: false, ranges: [{ from: "09:00", to: "18:00" }] },
      { key: "miercoles", label: "Miércoles", open: false, ranges: [{ from: "09:00", to: "18:00" }] },
      { key: "jueves", label: "Jueves", open: false, ranges: [{ from: "09:00", to: "18:00" }] },
      { key: "viernes", label: "Viernes", open: false, ranges: [{ from: "09:00", to: "18:00" }] },
      { key: "sabado", label: "Sábado", open: false, ranges: [{ from: "09:00", to: "13:00" }] },
      { key: "domingo", label: "Domingo", open: false, ranges: [{ from: "09:00", to: "13:00" }] }
    ];
  },

  getBusinessTimeOptions(selectedValue = "") {
    const options = [`<option value="">--:--</option>`];
    for (let hour = 0; hour < 24; hour += 1) {
      for (const minute of [0, 30]) {
        const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        options.push(`<option value="${value}" ${value === selectedValue ? "selected" : ""}>${value}</option>`);
      }
    }
    return options.join("");
  }
};
