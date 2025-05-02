import React, { useEffect, useState } from "react";
import { Flex, Upload, Typography, Button } from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";

const { Text } = Typography;

const LogoUploader = (props) => {
    const [fileList, setFileList] = useState([]);
    const domain = import.meta.env.VITE_API_URL;

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
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
 

    useEffect(() => {
        if (props.imageId) {
            setFileList([
                {
                    uid: "1",
                    name: props.imageId,
                    status: "done",
                    url: `https://res.cloudinary.com/doluaubbn/image/upload/v${Date.now()}/${props.path}/${props.imageId}.jpg`, // Check the URL format
                },
            ]);
        }
    }, [props.imageId, props.path])

    return (
        <div style={{ width: "100%" }}>
            <Flex align="center" gap="large" wrap="wrap">
                <ImgCrop rotationSlider>
                    <Upload
                        name="file"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        maxCount={1}
                        customRequest={async ({ file, onSuccess, onError }) => {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("uid", props.imageId);
                            formData.append("path", props.path);
                            console.log(formData.get("file"));
                            // console.log(file);
                            try {
                                const res = await axios.post(
                                    `${domain}/foreignImages`,
                                    formData,
                                    {
                                        withCredentials: true,
                                        headers: {
                                            "Content-Type":
                                                "multipart/form-data",
                                        },
                                    }
                                );
                                console.log(res);

                                onSuccess(res.data);
                            } catch (err) {
                                onError(err);
                            }
                        }}
                    >
                        {fileList.length < 1 && "+ Upload"}
                    </Upload>
                </ImgCrop>

                <Text type="secondary" style={{ maxWidth: "300px" }}>
                    This logo will be displayed in transaction PDFs and email
                    notifications.
                    <br />
                    <strong>Preferred Image Dimensions:</strong> 240 x 240
                    pixels @ 72 DPI
                    <br />
                    <strong>Maximum File Size:</strong> 1MB
                </Text>
            </Flex>
        </div>
    );
};

export default LogoUploader;
