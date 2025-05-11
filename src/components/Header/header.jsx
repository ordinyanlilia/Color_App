import React, { useEffect, useState } from "react";
import { fetchColors } from "../../api/api";
import { API_COLOR_URL } from "../../api/consts";
import { Button, Input, Space, Alert } from "antd";
import { useMediaQuery } from "react-responsive";
import "./header.css";

export const Header = () => {
  const [name, setName] = useState("");
  const [colors, setColors] = useState([]);
  const [assignedcolor, setAssignedColor] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    fetchColors().then((data) => {
      setColors(data);
    });

    const savedAssignedColor = localStorage.getItem("assignedColorData");
    const savedSubmitted = localStorage.getItem("submitted");

    if (savedAssignedColor) {
      setAssignedColor(JSON.parse(savedAssignedColor));
    }

    if (savedSubmitted === "true") {
      setSubmitted(true);
    }
  }, []);

  const handleChange = (e) => {
    setName(e.target.value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert("Enter your name։");

    fetchColors(name).then((data) => {
      console.log(data);
      if (!data || data.error) {
        setErrorMessage("Something went wrong. Please try again.");
        return;
      }

      if (data?.error === "Name already used") {
        setErrorMessage("This name is already used");
      } else {
        setAssignedColor(data);
        setSubmitted(true);
        localStorage.setItem("submitted", "true");
        localStorage.setItem("assignedColorData", JSON.stringify(data));
        setColors((prevColors) =>
          prevColors.filter((item) => item.color !== data.color)
        );
      }
    });
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleReset = async () => {
    const response = await fetch(API_COLOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "admin",
        action: "reset",
      }),
    });

    const isAdmin = name.trim().toLowerCase() === "admin";
    const result = await response.json();
    if (result.status === "reset complete") {
      const refreshedColors = await fetchColors();
      setColors(refreshedColors);
      localStorage.removeItem("assignedColorData");
      localStorage.removeItem("submitted");
      setAssignedColor(null);
      setSubmitted(false);
      setErrorMessage(null);
    }
  };

  return (
    <div>
      <h1>Color Assignment</h1>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
      {colors.map((item, index) => {
        return (
          <div key={index} className="color-item">
            <div
              className="color-block"
              style={{ backgroundColor: item.hex }}
            ></div>
            <div>
              <strong>{item.color}</strong>
            </div>
          </div>
        );
      })}
      {!submitted && (
        <>
          {isMobile ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Input
                type="text"
                value={name}
                onChange={handleChange}
                placeholder="Your name"
                defaultValue="https://ant.design"
              />
              <Button size="large" type="primary" onClick={handleSubmit} block>
                Submit
              </Button>
            </div>
          ) : (
            <Space.Compact block size="large">
              <Input
                type="text"
                value={name}
                onChange={handleChange}
                placeholder="Your name"
                style={{ width: "calc(100% - 200px)" }}
                defaultValue="https://ant.design"
              />
              <div className="App">
                <Button size="large" type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </Space.Compact>
          )}
        </>
      )}

      {submitted &&
        assignedcolor &&
        (isMobile ? (
          <div className="thank-you-message-mobile">
            <p>
              Your Color is <strong>{assignedcolor.color}</strong>: Thank you
            </p>
          </div>
        ) : (
          <div className="thank-you-message">
            <p>
              Your Color is <strong>{assignedcolor.color}</strong>: Thank you
            </p>
          </div>
        ))}
      {/* {isAdmin && (
        <div style={{ marginTop: 20 }}>
          <Button danger type="primary" onClick={handleReset}>
            Reset All Colors
          </Button>
        </div>
      )} */}
    </div>
  );
};
