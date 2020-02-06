import React from "react";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { makeDeIdentifiedValue } from "../../Utils/aid";

const manualUpdateForm = ({
  requirements,
  treeData,
  seriesIndex,
  onTagInput,
  onSave
}) => {
  try {
    const { seriesUID, missingTags, data } = treeData[seriesIndex];
    const fields = [];
    // const series = treeData[patientID].studies[studyUID].series[seriesUID];

    requirements.forEach((el, i) => {
      const tag = el.substring(0, el.length - 2);
      const vr = el.substring(el.length - 2);
      const missing = missingTags.includes(tag);
      const value = missing ? makeDeIdentifiedValue(null, vr) : data[tag];
      // if (missing) onTagInput(null, tag, value);
      fields.push(
        <div key={`${seriesUID}-${i}`} className="tagEditForm__el">
          <div className="--exp">{`${tag}:`}</div>
          <input
            onMouseDown={e => e.stopPropagation()}
            type="text"
            className={missing ? "--textFilled" : "--text"}
            defaultValue={value}
            name={tag}
            onChange={onTagInput}
          />
          {missing ? (
            <FaExclamationTriangle className="--warnning" />
          ) : (
            <FaCheck className="--check" />
          )}
        </div>
      );
    });
    return (
      <div className="tagEditForm-wrapper">
        <div className="tagEditForm">{fields}</div>
        <input
          className="tagEditForm-save"
          onClick={onSave}
          value="Save tags"
          type="button"
        />
      </div>
    );
  } catch (err) {
    console.log(err);
    return (
      <div style={{ fontSize: "1.4rem", color: "#5bc0de", textAlign: "left" }}>
        Select requirements and series to edit tags
      </div>
    );
  }
};

export default manualUpdateForm;
