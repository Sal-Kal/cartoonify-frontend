import React from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UploadImage() {
  // All States
  const [dragActive, setDragActive] = React.useState(false);
  const [boxState, setBoxState] = React.useState("upload");
  const [cartoon, setCartoon] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Axios Post Request to the Backend
  const handleFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    let url = "http://127.0.0.1:8000/cartoonify";
    try {
      await axios.post(url, formData).then((res) => {
        setBoxState("result");
        setCartoon(res.data.response);
        console.log(res.data.response);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const inputRef = React.useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const resetUploadBox = () => {
    setBoxState("upload");
    setLoading(false);
    setCartoon("");
  };

  const setToUpload = () => {
    setBoxState("upload");
    setLoading(false);
  };

  switch (boxState) {
    case "upload":
      return (
        <div className="upload-box">
          {loading ? (
            <div className="loader">
              <Spinner animation="border" />
            </div>
          ) : (
            <form
              id="form-file-upload"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                ref={inputRef}
                type="file"
                id="input-file-upload"
                onChange={handleChange}
              />
              <label
                id="label-file-upload"
                htmlFor="input-file-upload"
                className={dragActive ? "drag-active" : ""}
              >
                <p>Drag and drop your image here</p>
                <button className="upload-button" onClick={onButtonClick}>
                  Upload
                </button>
              </label>
            </form>
          )}
        </div>
      );
    case "result":
      return (
        <div className="upload-box">
          <div className="result-row">
            <img src={`data:image/png;base64,${cartoon}`} alt="" id="cartoon" />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button className="upload-button" onClick={setToUpload}>
                Upload Another
              </button>
            </div>
          </div>
        </div>
      );
    default:
      return <div>You shouldn't be seeing this</div>;
  }
}
