import { Button, Typography, Modal } from 'antd';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import LogoUploader from '../../utils/constant/Settingform/LogoUploader';
import DynamicForm from '../DynamicForm/DynamicForm';

const { Text } = Typography;

const UserProfile = ({ userData }) => {
  const { company } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);  
  const [formData, setFormData] = useState(null); 

  const formFields = [
    { label: "User Name", name: "userName", type: "text", rule: { required: true, message: "Please enter user name!" }, placeholder: "Enter Organization Name" },
    { label: "Father Name", name: "Father Name", type: "text", rule: { required: true, message: "Please enter father name!" }, placeholder: "Enter father name" },
    { label: "NIC", name: "NIC", type: "text", rule: { required: true, message: "Please enter NIC!" }, placeholder: "Enter NIC" },
    { label: "Business Type", name: "businessType", type: "select", rule: { required: true, message: "Please select business type!" }, placeholder: "Select Business Type", options: ["Private", "Public", "NGO"] },
    { label: "Address", name: "orgAddress", type: "text", rule: { required: true, message: "Please enter address!" }, placeholder: "Enter Address" },
    { label: "City", name: "city", type: "text", placeholder: "Enter City" },
    { label: "Zip Code", name: "zip", type: "number", placeholder: "Enter Zip Code" },
    { label: "Phone", name: "phone", type: "number", placeholder: "Enter Phone Number" },
  ];

  // Handle form submission
  const handleSubmit = (values) => {
    setFormData(values);  
    setIsModalVisible(true);  
  };

  // Handle confirm action in the modal
  const handleOk = () => {
    console.log("Form Submitted:", formData);
    setIsModalVisible(false); 
  };

  // Handle cancel action in the modal
  const handleCancel = () => {
    setIsModalVisible(false);  
  };

  return (
    <div>
      <Text>Username :   
         { userData?.name}</Text>
      <h3>User Logo</h3>
      <LogoUploader />
      <DynamicForm formFields={formFields} onSubmit={handleSubmit} />

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" onClick={() => handleSubmit(formData)}>Save</Button>
        <Button type="default">Cancel</Button>
      </div>

      {/* Modal for confirmation */}
      <Modal
        title="Confirm Submission"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <p>Are you sure you want to submit the form with the provided details?</p>
      </Modal>
    </div>
  );
};

export default UserProfile;

