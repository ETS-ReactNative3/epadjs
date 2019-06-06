import React from "react";
import PropTypes from "prop-types";
import {
  FaDownload,
  FaUpload,
  FaLayerGroup,
  FaLocationArrow,
  FaRegTrashAlt,
  FaFilter,
  FaUndo
} from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import "../menuStyle.css";
import { isLite } from "../../../config.json";

const toolBar = props => {
  const {
    onDelete,
    onDownload,
    onUpload,
    onSelect,
    onType,
    onClear,
    onFilter
  } = props;
  const { selected, projects } = props;

  const options = [];
  for (let project of projects) {
    // console.log(user);
    options.push(
      <option key={project.id} value={project.id}>
        {project.name}
      </option>
    );
  }

  let name = React.createRef();
  let subject = React.createRef();
  let template = React.createRef();
  let createdStart = React.createRef();
  let createdEnd = React.createRef();

  function clearFilters() {
    name.current.value = "";
    subject.current.value = "";
    template.current.value = "";
    createdStart.current.value = "";
    createdEnd.current.value = "";
  }

  return (
    <div className="annotations-toolbar">
      <>
        <div onClick={onUpload}>
          <FaUpload className="tool-icon" data-tip data-for="upload-icon" />
        </div>
        <ReactTooltip
          id="upload-icon"
          place="right"
          type="info"
          delayShow={1500}
        >
          <span className="filter-label">Upload selections</span>
        </ReactTooltip>
      </>
      <>
        <div onClick={onDownload}>
          <FaDownload className="tool-icon" data-tip data-for="download-icon" />
        </div>
        <ReactTooltip
          id="download-icon"
          place="right"
          type="info"
          delayShow={1500}
        >
          <span className="filter-label">Download selections</span>
        </ReactTooltip>
      </>
      {!isLite && (
        <>
          <>
            <div className="annotation-toolbar__icon">
              <FaLayerGroup
                className="tool-icon"
                data-tip
                data-for="applyParalel-icon"
              />
            </div>
            <ReactTooltip
              id="applyParalel-icon"
              place="right"
              type="info"
              delayShow={1500}
            >
              <span className="filter-label">Apply (parallel)</span>
            </ReactTooltip>
          </>
          <>
            <div onClick={onDelete} className="annotation-toolbar__icon">
              <FaLocationArrow
                className="tool-icon"
                onClick={onDelete}
                data-tip
                data-for="applyAll-icon"
              />
            </div>
            <ReactTooltip
              id="applyAll-icon"
              place="right"
              type="info"
              delayShow={1500}
            >
              <span className="filter-label">Apply (all together)</span>
            </ReactTooltip>
          </>
        </>
      )}
      <>
        <div onClick={onDelete} className="annotation-toolbar__icon">
          <FaRegTrashAlt
            className="tool-icon"
            onClick={onDelete}
            data-tip
            data-for="trash-icon"
          />
        </div>
        <ReactTooltip
          id="trash-icon"
          place="right"
          type="info"
          delayShow={1500}
        >
          <span className="filter-label">Delete selections</span>
        </ReactTooltip>
      </>
      {!isLite && (
        <select
          className="annotations-projectSelect"
          name="project"
          onChange={onSelect}
          defaultValue="default"
        >
          {options}
        </select>
      )}
      <div className="filter-group">
        <div className="filter-container">
          <span className="filter-label">Name:</span>
          <input
            onMouseDown={e => e.stopPropagation()}
            onChange={onType}
            type="text"
            className="filter-text"
            name="name"
            ref={name}
          />
        </div>
        <div className="filter-container">
          <span className="filter-label">Subject:</span>
          <input
            onMouseDown={e => e.stopPropagation()}
            onChange={onType}
            type="text"
            className="filter-text"
            name="patientName"
            ref={subject}
          />
        </div>
        <div className="filter-container">
          <span className="filter-label">Template:</span>
          <input
            onMouseDown={e => e.stopPropagation()}
            onChange={onType}
            type="text"
            className="filter-text"
            name="template"
            ref={template}
          />
        </div>
        <div className="filter-container">
          <span className="filter-label">Created:</span>
          <input
            onMouseDown={e => e.stopPropagation()}
            onChange={onType}
            type="text"
            className="filter-text"
            name="createdStart"
            ref={createdStart}
          />
          <span>{" - "}</span>
          <input
            onMouseDown={e => e.stopPropagation()}
            onChange={onType}
            type="text"
            className="filter-text"
            name="createdEnd"
            ref={createdEnd}
          />
        </div>
      </div>
      <>
        <div
          className="annotation-toolbar__icon"
          onClick={() => {
            onFilter();
          }}
        >
          <FaFilter className="tool-icon" data-tip data-for="filter-icon" />
        </div>
        <ReactTooltip
          id="filter-icon"
          place="right"
          type="info"
          delayShow={1500}
        >
          <span className="filter-label">Filter annotations</span>
        </ReactTooltip>
      </>
      <>
        <div
          className="annotation-toolbar__icon"
          onClick={() => {
            clearFilters();
            onClear();
          }}
        >
          <FaUndo className="tool-icon" data-tip data-for="undo-icon" />
        </div>
        <ReactTooltip id="undo-icon" place="right" type="info" delayShow={1500}>
          <span className="filter-label">Clear filter</span>
        </ReactTooltip>
      </>
    </div>
  );
};

toolBar.propTypes = {
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  selected: PropTypes.bool
};
export default toolBar;
