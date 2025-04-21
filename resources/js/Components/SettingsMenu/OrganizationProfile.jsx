import React, { useState } from "react";
import { useParams } from "react-router";
import { Button, Typography, Modal } from "antd";
// import LogoUploader from "../../../utils/constant/Settingform/LogoUploader";
// import DynamicForm from "../../../Components/DynamicForm/DynamicForm";
// import Fiscal from "../../../utils/constant/Settingform/Fiscal";
// import { setDateFormat, setLanguage, setTimezone, setFiscalYear } from "../../../Components/Redux/reducers/User/FiscalSlice";
import { useDispatch } from "react-redux";
import LogoUploader from "../../utils/constant/Settingform/LogoUploader";
import DynamicForm from "../DynamicForm/DynamicForm";
// import Fiscal from "../../utils/constant/Settingform/Fiscal";
// import { setDateFormat, setFiscalYear } from "../../utils/constant/Redux/reducers/User/FiscalSlice";
// import { setDateFormat, setFiscalYear} from "../Redux/reducers/User/FiscalSlice";

const { Text } = Typography;

const OrganizationProfile = ({ userData }) => {
    // console.log(userData)
    
    const { company } = useParams();
    const [formData, setFormData] = useState({});
    const [fiscalData, setFiscalData] = useState({}); 
    const [isModalVisible, setIsModalVisible] = useState(false);

    const dispatch = useDispatch();  

    const formFields = [
        { label: "Organization Name", name: "orgName", type: "text", rule: { required: true, message: "Please enter organization name!" }, placeholder: "Enter Organization Name" },
        { label: "Industry", name: "industry", type: "select", rule: { required: true, message: "Please select industry!" }, placeholder: "Select Industry", options: ["IT", "Finance", "Healthcare", "Education"] },
        { label: "Business Type", name: "businessType", type: "select", rule: { required: true, message: "Please select business type!" }, placeholder: "Select Business Type", options: ["Private", "Public", "NGO"] },
        { label: "Location", name: "location", type: "select", rule: { required: true, message: "Please select location!" }, placeholder: "Select Location", options: ["USA", "UK", "India", "Pakistan"] },
        { label: "Address", name: "orgAddress", type: "text", rule: { required: true, message: "Please enter address!" }, placeholder: "Enter Address" },
        { label: "City", name: "city", type: "text", placeholder: "Enter City" },
        { label: "Zip Code", name: "zip", type: "number", placeholder: "Enter Zip Code" },
        { label: "Phone", name: "phone", type: "text", placeholder: "Enter Phone Number" },
        { label: "Website URL", name: "website", type: "text", rule: { required: true, message: "Please enter website URL!" }, placeholder: "Enter Website URL" },
        { label: "Base Currency", name: "currency", type: "select", rule: { required: true, message: "Please select a currency!" }, placeholder: "Select Currency", options: ["USD", "EUR", "GBP", "JPY", "INR", "PKR"] },
    ];

    // const handleFiscalSubmit = () => {
    //     console.log("Fiscal Data: ", fiscalData);  
    //     dispatch(setFiscalYear(fiscalData));  
    // };

    // const handleSettingsSubmit = (settingsValues) => {
    //     const { language, timezone, dateFormat } = settingsValues;
    //     dispatch(setLanguage(language));
    //     dispatch(setTimezone(timezone));
    //     dispatch(setDateFormat(dateFormat));
    // };

    const handleFormSubmit = (values) => {
        setFormData(values);
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        console.log("Form Submitted:", formData);
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

   
    return (
        <div>
            <Text>Company Name : {userData?.company_name}</Text>
            <h3>Organization Logo</h3>

            <LogoUploader />

            <DynamicForm formFields={formFields} onSubmit={handleFormSubmit} />

            {/* <Fiscal setFiscalData={setFiscalData} />  */}

            {/* <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                <Button type="primary" onClick={handleFiscalSubmit}>Save</Button> 
                <Button type="default">Cancel</Button>
            </div>   */}

            {/* Modal for confirmation */}
            <Modal
                title="Confirm Submission"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Submit"
                cancelText="Cancel"
            >
                <p>Are you sure you want to submit the form with the provided details?</p>
            </Modal>
        </div>
    );
};

export default OrganizationProfile;
