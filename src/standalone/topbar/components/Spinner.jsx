import React from "react"
import { ClipLoader } from "react-spinners"

function Spinner(props) {
  const spinnerEnabled = props.currentStateF()
  return spinnerEnabled ? (
    //
    <div className="spinner-container">
    <ClipLoader color="#36d7b7" loading={true} size={70} />
    </div>
  ) : null
}

export default Spinner;
