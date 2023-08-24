"use client";
import { useEffect, useState } from "react";
import { Survey } from "./models/survey.model";
import DatePicker from "react-datepicker";

export default function Home() {
  const surveyTemplateId = 1;
  const [data, setData] = useState<Survey>(null!);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://localhost:7099/api/v1/surveyTemplate/${surveyTemplateId}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = {
      surveyTemplateId,
      social: 'Website',
      surveyForms:  data.surveyTemplateForms.map(f => ({
        type: f.type,
        keyName: f.keyName,
        label: f.label,
        value: f.type === 'Date' ? new Date().toISOString() : String(f.value),
        sequence: f.sequence
      }))
    };
    const res = await fetch("https://localhost:7099/api/v1/survey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  };

  const handleFormChange = (index, e) => {
    let change = data;
    if (change.surveyTemplateForms[index]) {
      change.surveyTemplateForms[index].value = e.target.value;
      setData(change);
    }
  };

  const handleFormDateChange = (index, date) => {
    let change = data;
    if (change.surveyTemplateForms[index]) {
      change.surveyTemplateForms[index].value = date;
      setData(change);
    }
  };

  return (
    <main>
      <div className="row">
        <div className="col-md-4 col-sm-6">
          <form onSubmit={handleSubmit}>
            <h1 className="title">Survey Title: {data?.name}</h1>
            {data?.surveyTemplateForms.map((input, index) => {
              if (input.type === "Date") {
                return (
                  <div className="form-group" key={index}>
                    <label htmlFor={input.keyName}>{input.label}</label>
                    <div>
                      <DatePicker
                        name={input.keyName}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        onChange={(e) => handleFormDateChange(index, e)}
                      />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="form-group" key={index}>
                    <label htmlFor={input.keyName}>{input.label}</label>
                    <input
                      type={input.type.toLowerCase()}
                      name={input.keyName}
                      onChange={(e) => handleFormChange(index, e)}
                      className="form-control"
                    />
                  </div>
                );
              }
            })}
            <div className="mt-3">
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
