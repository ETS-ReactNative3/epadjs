import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ManualEditForm from "./manualEditForm";
import "../searchView/searchView.css";
import "react-tabs/style/react-tabs.css";

class TagEditor extends React.Component {
  render = () => {
    return (
      <Tabs>
        <TabList>
          <Tab>Manual Edit</Tab>
          <Tab>Import</Tab>
          <Tab>ePad</Tab>
        </TabList>
        <TabPanel>
          <ManualEditForm
            requirements={this.props.requirements}
            treeData={this.props.treeData}
            path={this.props.path}
          />
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 3</h2>
        </TabPanel>
      </Tabs>
    );
  };
}

export default TagEditor;
