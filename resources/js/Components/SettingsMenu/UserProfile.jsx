import { Button, Typography, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import LogoUploader from "../ImageUploader/ImageUploader";
import DynamicForm from "../DynamicForm/DynamicForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "../../utils/constant/Redux/reducers/User/UserSlice";

const { Text } = Typography;


const UserProfile = ({ userData,setMatchedUserName }) => {
    // console.log(userData)
    const { company } = useParams();    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState(null);
    const [UserImageId, setUserImageId] = useState(null);
    
    console.log(UserImageId)



    // const dispatch = useDispatch();
    // const users = useSelector((state) => state?.AllUsers?.AllUsers?.data);
    // console.log(users)

    // const getUser = async () => {
    //     const domanWithPort = import.meta.env.VITE_API_URL;
    //     const response = await axios.get(`${domanWithPort}/${"checkUser"}`);
    //     const data = await response?.data;
    //     dispatch(getAllUser(data));
    // };
    
    // // console.log(users);

    // useEffect(() => {
        
    //     getUser();
        
    // }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const domainWithPort = import.meta.env.VITE_API_URL;
                const response = await axios.get(
                    `${domainWithPort}/{company}/users`
                );
                const allUsers = response.data?.data || [];
                console.log(allUsers)

                const matchedUser = allUsers.find(
                    (item) => item.company_uuid?.toString() === company
                );

                console.log(matchedUser)

                if (matchedUser) {
                  setFormData({
                    userName: matchedUser?.name || "",
                    email: matchedUser?.email || "",  // Use the email field here
                    NIC: matchedUser?.nic || "",
                    businessType: matchedUser?.business_type || "",
                    orgAddress: matchedUser?.address || "",
                    city: matchedUser?.city || "",
                    zip: matchedUser?.zip || "",
                    phone: matchedUser?.contact || "",
                });
                setUserImageId(matchedUser.uuid);
                setMatchedUserName?.(matchedUser.name || "");
                } else {
                    console.warn("Company not found with ID:", company);
                }
            } catch (error) {
                console.error("Error fetching company data", error);
            }
        };

        fetchUser();
    }, []);


    const handleOk = async () => {
        try {
            const domainWithPort = import.meta.env.VITE_API_URL;
            const payload = {
                contact: formData.phone,
                industry: formData.industry,
                address: formData.orgAddress,
                city: formData.city
            };
            console.log(payload)

            const response = await axios.get(
                `${domainWithPort}/{company}/users`
            );
            console.log(response) 

            console.log("Update success:", response.data);
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error updating company:", error);
        }
    };


    const formFields = [
      {
          label: "User Name",
          name: "userName",
          type: "text",
          rule: { required: true, message: "Please enter user name!" },
          placeholder: "Enter Organization Name",
      },
      {
          label: "Email", 
          name: "email", 
          type: "email", 
          rule: { required: true, message: "Please enter your email!" },
          placeholder: "Enter email address",
      },
      {
          label: "NIC",
          name: "NIC",
          type: "text",
          rule: { required: true, message: "Please enter NIC!" },
          placeholder: "Enter NIC",
      },
      {
          label: "Business Type",
          name: "businessType",
          type: "select",
          rule: { required: true, message: "Please select business type!" },
          placeholder: "Select Business Type",
          options: ["Private", "Public", "NGO"],
      },
      {
          label: "Address",
          name: "orgAddress",
          type: "text",
          rule: { required: true, message: "Please enter address!" },
          placeholder: "Enter Address",
      },
      {
          label: "City",
          name: "city",
          type: "text",
          placeholder: "Enter City",
      },
      {
          label: "Zip Code",
          name: "zip",
          type: "number",
          placeholder: "Enter Zip Code",
      },
      {
          label: "Phone",
          name: "phone",
          type: "number",
          placeholder: "Enter Phone Number",
      },
  ];
  

    // Handle form submission
    const handleSubmit = (values) => {
        setFormData(values);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            {/* <Text>User Name : {userData?.name}</Text> */}
            <h3>User Logo</h3>
            {/* <LogoUploader /> */}

            {/* {users && <LogoUploader path='userprofile' imageId={UserImageId} />} */}
             <LogoUploader path='userprofile' imageId={UserImageId} />

            
            <DynamicForm
                formFields={formFields}
                onSubmit={handleSubmit}
                initialValues={formData}
            />

            <div
                style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >

            </div>

            {/* Modal for confirmation */}
            <Modal
                title="Confirm Submission"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Submit"
                cancelText="Cancel"
            >
                <p>
                    Are you sure you want to submit the form with the provided
                    details?
                </p>
            </Modal>
        </div>
    );
};

export default UserProfile;
