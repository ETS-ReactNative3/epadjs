import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import {
  clearGrid,
  // getPatient,
  getWholeData,
  getSingleSerie,
  clearSelection,
  startLoading,
  loadCompleted,
  addToGrid,
  updatePatient
} from "./action";
import SerieSelect from "./containers/serieSelection";
import SelectionItem from "./containers/selectionItem";
import { FaRegCheckCircle, FaRegCheckSquare } from "react-icons/fa";
import { getSeries } from "../../services/seriesServices";
import { MAX_PORT } from "../../constants";

const message = {
  title: "Not enough ports to open series"
};
class selectSerieModal extends React.Component {
  _isMounted = false;
  state = {
    selectionType: "",
    selectionArr: [],
    // seriesList: [],
    selectedToDisplay: [],
    limit: 0
  };
  //get the serie list
  componentDidMount = async () => {
    this._isMounted = true;
    let selectionType = "";
    let { selectedStudies, selectedSeries, selectedAnnotations } = this.props;
    selectedStudies = Object.values(selectedStudies);
    selectedSeries = Object.values(selectedSeries);
    selectedAnnotations = Object.values(selectedAnnotations);
    if (selectedStudies.length > 0) {
      selectionType = "study";
    } else if (selectedSeries.length > 0) {
      selectionType = "series";
    } else {
      selectionType = "aim";
    }
    this.setState({ selectionType });
  };
  componentWillUnmount = () => {
    this._isMounted = false;
  };

  // getPatient = async study => {
  //   return this.props.dispatch(getPatient(study));
  // };

  getSerieListData = async (projectID, patientID, studyUID) => {
    const {
      data: {
        ResultSet: { Result: series }
      }
    } = await getSeries(projectID, patientID, studyUID);

    return series;
  };

  componentDidUpdate = prevProps => {
    if (this.props.openSeries.length !== prevProps.openSeries.length) {
      let limit = this.updateLimit();
      this.setState({ limit });
    }
  };

  updateLimit = () => {
    let selectCount = 0;
    this.state.selectedToDisplay.forEach(item => {
      if (item) {
        selectCount++;
      }
    });
    return this.props.openSeries.length + selectCount;
  };
  selectToDisplay = async e => {
    let arr = [...this.state.selectedToDisplay];
    arr[e.target.dataset.index] = e.target.checked;
    await this.setState({ selectedToDisplay: arr });
    let limit = this.updateLimit();
    this.setState({ limit });
  };

  displaySelection = async () => {
    let studies = Object.values(this.props.seriesPassed);
    let series = [];
    studies.forEach(arr => {
      series = series.concat(arr);
    });
    // let series = Object.values(this.props.seriesPassed)[0];
    //concatanete all arrays to getther
    for (let i = 0; i < this.state.selectedToDisplay.length; i++) {
      if (this.state.selectedToDisplay[i]) {
        this.props.dispatch(addToGrid(series[i], series[i].aimID));
        if (this.state.selectionType === "aim") {
          this.props.dispatch(getSingleSerie(series[i], series[i].aimID));
        } else {
          this.props.dispatch(getSingleSerie(series[i]));
        }
        if (!this.props.patients[series[i]]) {
          this.props.dispatch(getWholeData(series[i]));
        }
      }
    }

    //iterate over the open series and update patient with each one

    // let index = 0;
    // for (let serie of series) {
    //   if (this.state.selectedToDisplay[index] && this._isMounted) {
    //     console.log("000000000000000000", index);
    //     console.log(this.props.patients);
    //     if (!this.props.patients[serie.patientID]) {
    //       console.log("should be once");
    //       await this.props.dispatch(getWholeData(serie));
    //     } else {
    //       this.props.dispatch(
    //         updatePatient(
    //           "serie",
    //           true,
    //           serie.patientID,
    //           serie.studyUID,
    //           serie.seriesUID
    //         )
    //       );
    //     }
    //   }
    //   index++;
    // }
    console.log("here before cancel");
    this.handleCancel();
  };

  groupUnderPatient = objArr => {
    let groupedObj = {};
    for (let item of objArr) {
      groupedObj[item.patientID] = item;
    }
    return groupedObj;
  };

  handleCancel = () => {
    this.setState({
      selectionType: "",
      selectionArr: [],
      seriesList: [],
      selectedToDisplay: [],
      limit: 0
    });
    this.props.dispatch(clearSelection());
    this.props.onCancel();
  };

  renderSelection = () => {
    let selectionList = [];
    let item;
    let series = Object.values(this.props.seriesPassed);
    let keys = Object.keys(this.props.seriesPassed);
    let count = 0;
    let openSeriesUIDList = [];
    this.props.openSeries.forEach(port => {
      openSeriesUIDList.push(port.seriesUID);
    });
    for (let i = 0; i < series.length; i++) {
      let innerList = [];
      let title = series[i][0].bodyPart || series[i][0].studyDescription;
      title = !title ? "Unnamed Study" : title;
      for (let k = 0; k < series[i].length; k++) {
        let alreadyOpen = openSeriesUIDList.includes(series[i][k].seriesUID);
        let disabled =
          !this.state.selectedToDisplay[count + k] &&
          this.state.limit >= MAX_PORT;
        let desc = series[i][k].seriesDescription || "Unnamed Serie";
        // desc = alreadyOpen ? `${desc} - already open` : desc;
        item = alreadyOpen ? (
          <div key={series[i][k].seriesUID} className="alreadyOpen-disabled">
            <FaRegCheckSquare />
            <div className="selectionItem-text">{desc}</div>
          </div>
        ) : (
          <SelectionItem
            desc={desc}
            onSelect={this.selectToDisplay}
            index={count + k}
            disabled={disabled}
            key={series[i][k].seriesUID}
          />
        );
        innerList.push(item);
      }
      selectionList.push(
        <div key={keys[i]}>
          <div className="serieSelection-title">{title}</div>
          <div>{innerList}</div>
        </div>
      );
      count += series[i].length;
    }
    return selectionList;
  };

  render = () => {
    const list = this.renderSelection();

    return (
      <Modal.Dialog dialogClassName="alert-selectSerie">
        <Modal.Header>
          <Modal.Title className="selectSerie__header">
            {message.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="selectSerie-container">
          <div>Maximum 6 series can be viewed at a time.</div>
          <button
            size="lg"
            className="selectSerie-clearButton"
            onClick={() => this.props.dispatch(clearGrid())}
          >
            Close all views
          </button>
          {this.state.limit >= MAX_PORT && (
            <div>You reached Max number of series</div>
          )}
          <div>{list}</div>
        </Modal.Body>
        <Modal.Footer className="modal-footer__buttons">
          <button onClick={this.displaySelection}>Display selection</button>
          <button onClick={this.handleCancel}>Cancel</button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  };
}

const mapStateToProps = state => {
  return {
    selectedStudies: state.annotationsListReducer.selectedStudies,
    selectedSeries: state.annotationsListReducer.selectedSeries,
    selectedAnnotations: state.annotationsListReducer.selectedAnnotations,
    patients: state.annotationsListReducer.patients,
    openSeries: state.annotationsListReducer.openSeries
  };
};

export default connect(mapStateToProps)(selectSerieModal);
