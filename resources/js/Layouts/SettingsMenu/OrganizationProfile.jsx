  import React, { useState } from "react";
  import { useParams } from "react-router";
  import LogoUploader from "../../utils/constant/LogoUploader/LogoUploader";
  import { Button, Flex, Typography } from "antd";
  import OrganizationForm from "../../utils/constant/Settingform/Organizationform";
  import Fiscal from "../../utils/constant/Fiscal/Fiscal";
  const { Text } = Typography;


  const OrganizationProfile = () => {
      const { company } = useParams();

      return (
          <div>
              <Text>ID : {company}</Text>
              <h3>Organization Logo</h3>

              {/* <Flex align="center" gap="large"> */}
              <LogoUploader />
              <OrganizationForm />
              <Fiscal />
              {/* Save and Cancel Buttons */}
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                    <Button type="primary">Save</Button>
                    <Button type="default">Cancel</Button>
                </div>

              {/* </Flex> */}
          </div>
      );
  };

  export default OrganizationProfile;
