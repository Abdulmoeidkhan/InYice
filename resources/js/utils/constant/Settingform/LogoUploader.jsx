// import React, { useState } from "react";
// import { Flex, Upload, Typography } from "antd";
// import ImgCrop from "antd-img-crop";

// const { Text } = Typography;

// const LogoUploader = () => {
//     const [fileList, setFileList] = useState([]);
//     // console.log(fileList)
//     const domain = import.meta.env.VITE_API_URL;

//     const onChange = ({ fileList: newFileList }) => {
//         setFileList(newFileList.slice(-1));
//     };

//     const onPreview = async (file) => {
//         let src = file.url;
//         if (!src) {
//             src = await new Promise((resolve) => {
//                 const reader = new FileReader();
//                 reader.readAsDataURL(file.originFileObj);
//                 reader.onload = () => resolve(reader.result);
//             });
//         }
//         const image = new Image();
//         image.src = src;
//         constimgWindow = window.open(src);
//         imgWindow?.document.write(image.outerHTML);
//     };

//     return (
//         <div style={{ width: "100%" }}>
//             <Flex align="center" gap="large" wrap="wrap">
//                 <ImgCrop rotationSlider>
//                     <Upload 
//                         name="file"
//                         action={`${domain}/foreignImages`}
//                         listType="picture-card"
//                         withCredentials={true}
//                         headers= {
//                             {'Content-Type': 'multipart/form-data'}
//                           }
//                         // fileList={fileList}
//                         onChange={onChange}
//                         onPreview={onPreview}
//                         maxCount={1}
//                     >
//                         {fileList.length < 1 && "+ Upload"}
//                     </Upload>
//                 </ImgCrop>

//                 <Text type="secondary" style={{ maxWidth: "300px" }}>
//                     This logo will be displayed in transaction PDFs and email
//                     notifications.
//                     <br />
//                     <strong>Preferred Image Dimensions:</strong> 240 x 240
//                     pixels @ 72 DPI
//                     <br />
//                     <strong>Maximum File Size:</strong> 1MB
//                 </Text>
//             </Flex>
//         </div>
//     );
// };

// export default LogoUploader;



import React, { useState } from "react";
import { Flex, Upload, Typography, Button } from "antd";
import ImgCrop from "antd-img-crop";
import axios from "axios";

const { Text } = Typography;

const LogoUploader = () => {
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
                            formData.append("uid", '739ad6f4-0aef-4836-9958-9bb7a8a9ecc0');
                            formData.append("path", "your-desired-path");
                            // console.log(formData.get("file"));
                            // console.log(file);
                            try {
                                const res = await axios.post(`${domain}/foreignImages`, formData, {
                                    withCredentials: true,
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                });
                                console.log(res)

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
