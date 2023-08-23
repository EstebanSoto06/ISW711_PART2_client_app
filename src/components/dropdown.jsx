import React from "react";

export default function Dropdown({options, onSelect, selectedOption}) {

    const handleSelectChange = (event) => {
        onSelect(event.target.value);
      };

  return (
    <select className="form-select form-select-m" aria-label=".form-select-lg example"  value={selectedOption} onChange={handleSelectChange}>
    {options.map((item, index)  => (
        <option key={index} value={item}>{item}</option>
    ))}
    </select>
  );
}