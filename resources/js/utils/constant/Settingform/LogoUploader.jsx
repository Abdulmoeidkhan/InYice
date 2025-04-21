import React, { useState } from 'react';
import { Flex, Upload, Typography } from "antd";
import ImgCrop from "antd-img-crop";

const { Text } = Typography;

const LogoUploader = () => {
    const [fileList, setFileList] = useState([]);
    // console.log(fileList)
    
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1)); 
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        constimgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };


    return (
        <div style={{ width: "100%" }}>
            <Flex 
                align="center" 
                gap="large"
                wrap="wrap" 
            >
                <ImgCrop rotationSlider>
                    <Upload
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        listType="picture-card"
                        fileList={fileList}
                        
                        onChange={onChange}
                        onPreview={onPreview}
                        maxCount={1} 
                    >
                        
                        {fileList.length < 1 && "+ Upload"}
                    </Upload>
                </ImgCrop>

            
                <Text type="secondary" style={{  maxWidth: "300px" }}>
                    This logo will be displayed in transaction PDFs and email notifications.
                    <br />
                    <strong>Preferred Image Dimensions:</strong> 240 x 240 pixels @ 72 DPI
                    <br />
                    <strong>Maximum File Size:</strong> 1MB
                </Text>
            </Flex>

        
        </div>
    );
};

export default LogoUploader;
