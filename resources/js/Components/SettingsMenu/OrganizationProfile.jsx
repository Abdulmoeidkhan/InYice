    import React, {lazy, useEffect, useState } from "react";
    import { useParams } from "react-router";
    import { Button, Typography, Modal } from "antd";
    import { useDispatch } from "react-redux";
    import axios from "axios"; 
    import LogoUploader from "../ImageUploader/ImageUploader";
    import DynamicForm from "../DynamicForm/DynamicForm";
    import { useSelector} from "react-redux";
    import { useAuth } from "../../utils/hooks/useAuth";
    import { getAllUser } from "../../utils/constant/Redux/reducers/User/UserSlice";

    const { Text } = Typography;
    const OrganizationProfile = ({ userData,setMatchedCompanyName }) => {

        const { company } = useParams();
        const [formData, setFormData] = useState({});
        const [isModalVisible, setIsModalVisible] = useState(false);
        const [companyLogoId, setCompanyLogoId] = useState(null);
        
        const { user } = useAuth();

        // user && console.log(user);   

        const dispatch = useDispatch();
        const users = useSelector((state) => state?.AllUsers?.AllUsers?.data );
        console.log(users)

        const getUser = async () => {
            const domanWithPort = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${domanWithPort}/${"checkUser"}`);
            const data = await response?.data;
            dispatch(getAllUser(data));
        };



        useEffect(() => {
            const fetchCompany = async () => {
                try {
                    const domain = import.meta.env.VITE_API_URL;
                    const response = await axios.get(`${domain}/usersCompanies`);
                    const allCompanies = response.data?.data || [];
                    console.log(allCompanies)
                    const matchedCompany = allCompanies.find((item) => item.uuid?.toString() === company);
                    
                    if (matchedCompany) {
                        setFormData({
                            orgName: matchedCompany.name || "",
                            industry: matchedCompany.industry || "",
                            businessType: matchedCompany.business_type || "",
                            location: matchedCompany.location || "",
                            orgAddress: matchedCompany.address || "",
                            city: matchedCompany.city || "",
                            zip: matchedCompany.zip || "",
                            phone: matchedCompany.contact || "",
                            website: matchedCompany.website || "",
                            currency: matchedCompany.currency || "",
                        });

                        setCompanyLogoId(matchedCompany.uuid);
                        setMatchedCompanyName?.(matchedCompany.name || "");
                    }
                } catch (error) {
                    console.error("Error fetching company data", error);
                }
            };

            fetchCompany();
            getUser();
            
        }, [company]);



        const handleFormSubmit = (values) => {
            setFormData(values);
            setIsModalVisible(true);
        };

        const handleModalOk = async () => {
            try {
                const domain = import.meta.env.VITE_API_URL;
                const payload = {
                    contact: formData.phone,
                    industry: formData.industry,
                    address: formData.orgAddress,
                    city: formData.city
                };
                console.log(payload)

                const response = await axios.put(`${domain}/usersCompanies/${company}`, payload);
                console.log(response) 

                console.log("Update success:", response.data);
                setIsModalVisible(false);
            } catch (error) {
                console.error("Error updating company:", error);
            }
        };

        const handleModalCancel = () => {
            setIsModalVisible(false);
        };

    

        const formFields = [
            { label: "Organization Name", name: "orgName", type: "text", rule: { required: true, message: "Please enter organization name!" }, placeholder: "Enter Organization Name"  },
            { label: "Industry", name: "industry", type: "select", rule: { required: true, message: "Please select industry!" }, placeholder: "Select Industry", options: ["Information Tech", "Finance", "Healthcare", "Education"] },
            { label: "Business Type", name: "businessType", type: "select", rule: { required: true, message: "Please select business type!" }, placeholder: "Select Business Type", options: ["Private", "Public", "NGO"] },
            { label: "Location", name: "location", type: "select", rule: { required: true, message: "Please select location!" }, placeholder: "Select Location", options: ["USA", "UK", "India", "Pakistan"] },
            { label: "Address", name: "orgAddress", type: "text", rule: { required: true, message: "Please enter address!" }, placeholder: "Enter Address" },
            { label: "City", name: "city", type: "text", placeholder: "Enter City" },
            { label: "Zip Code", name: "zip", type: "number", placeholder: "Enter Zip Code" },
            { label: "Phone", name: "phone", type: "text", placeholder: "Enter Phone Number" },
            { label: "Website URL", name: "website", type: "text", rule: { required: true, message: "Please enter website URL!" }, placeholder: "Enter Website URL" },
            { label: "Base Currency", name: "currency", type: "select", rule: { required: true, message: "Please select a currency!" }, placeholder: "Select Currency", options: ["USD", "EUR", "GBP", "JPY", "INR", "PKR"] },
        ];

        return (
            <div>
                <Text>Org Name : {userData?.company_name}</Text>
                <h3>Organization Logo</h3>

                {/* {users && <LogoUploader path='organization' imageId={users.uuid} />} */}

                {users && <LogoUploader path='organization'  imageId={companyLogoId} />}

                <DynamicForm formFields={formFields} onSubmit={handleFormSubmit} initialValues={formData} />

                <Modal
                    title="Confirm Submission"
                    open={isModalVisible}
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
