import React, { useEffect, useState } from "react";
import { Avatar, Divider, List, Skeleton, Input, Flex } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    SettingOutlined,
    EllipsisOutlined,
    BarsOutlined,
    AppstoreOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "../../utils/hooks/useAuth";
import FormModal from "../Modal/FormModal";
import Tags from "../Tags/Tags";
import Fuse from "fuse.js";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "../../utils/constant/Redux/reducers/User/UserSlice";

const { Search } = Input;

const App = (props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const { user } = useAuth();

    user && console.log(user);

    const loadData = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        const domanWithPort = import.meta.env.VITE_API_URL;
        await axios
            .get(`${domanWithPort}/${props.route}`)
            .then(function (response) {
                setData(response.data.data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, [props.parentState]);

    // Load Full Data & Initiate Request via UseEffect End

    // Fuse Search Logics Start
    const searchFuse = (value) => {
        const options = {
            includeScore: true,
            keys: props?.fieldsToRender || ["name"],
        };
        setLoading(true);

        const fuse = new Fuse(data, options);
        const result = fuse.search(value);
        const foramtedResult = result.map(({ item }) => item);

        value ? setFilteredData(foramtedResult) : setFilteredData(data);

        setLoading(false);

        return result;
    };

    useEffect(() => {
        searchFuse(searchValue);
    }, [data, searchValue]);

    // Check Image URL is Valid or not Start
    function checkImageLink(url) {
        const img = new Image();
        let isValid = false;
        img.onload = function () {
            isValid = true;
        };
        img.onerror = function () {
            isValid = false;
        };
        let randonNumber = Math.floor(Math.random() * 99) + 1;
        return isValid
            ? url
            : `https://api.dicebear.com/7.x/miniavs/svg?seed=1${randonNumber}`;
    }
    // Check Image URL is Valid or not End

    const dispatch = useDispatch();
    const users = useSelector((state) => state?.AllUsers?.AllUsers?.data);
    

    const getUser = async () => {
        const domanWithPort = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${domanWithPort}/${"checkUser"}`);
        const data = await response?.data;
        dispatch(getAllUser(data));
    };
    console.log(users);

    useEffect(() => {
        getUser();
    }, [dispatch]);

    return (
        <>
            <Flex
                align="center"
                justify="space-between"
                gap="middle"
                style={{ width: "100%" }}
            >
                <h2>{props.listTitle}</h2>
                {props.children}
            </Flex>
            <Search
                allowClear
                size="large"
                name="search"
                enterButton="Search"
                placeholder={`Search ${props.listTitle}`}
                onSearch={(searchValue) => setSearchValue(searchValue)}
            />
            <div
                id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: "auto",
                    padding: "12px 16px",
                    border: "1px solid rgba(140, 140, 140, 0.35)",
                    margin: "12px 0",
                }}
            >
                <InfiniteScroll
                    dataLength={filteredData.length}
                    loader={
                        <Skeleton
                            avatar
                            paragraph={{
                                rows: 1,
                            }}
                            active
                        />
                    }
                    endMessage={
                        <>
                            <Divider plain>It is all, nothing more 🤐</Divider>
                        </>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        dataSource={filteredData}
                        renderItem={(item) => {
                            console.log(item)

                            // const currentUser = item

                            const isOwner = item?.role_id === 1;
                            console.log(isOwner); // Agar Owner hai (Full Access)
                            // ); // Owner hai ya nahi

                            const IsInYice =
                                users?.company_name === "Inyice coorporation";
                            console.log(IsInYice); // Agar inyice hai (Full Access)
                            // );      // Inyice hai ya nahi

                            
                             // Kya ye same company ka hai?
                            const isSameCompany =
                                users?.company_name ===
                                item?.company_name;
                            console.log(isSameCompany);

                            // Apni company ka admin hai?
                            const isAdmin =
                                (item?.role_id === 2 && isSameCompany) || // Apni company ka admin
                                (item?.role_id === 2 && IsInYice); // InYice ka admin
                            // Admin hai ya nahi
                            console.log(isAdmin);

                         // Kya same ya chhota role hai?
                            const isSameRoleOrLower =
                                item?.role_id >= item?.role_id;
                            console.log(isSameRoleOrLower);

                            const canEditDelete =
                                // Inyice ka Owner/Admin ho to sab ko chher sakta hai
                                (IsInYice && (isOwner || isAdmin)) ||
                                // Non-Inyice Owner sirf apni company mein sab ko chher sakta hai
                                (!IsInYice && isOwner && isSameCompany) ||
                                // Non-Inyice Admin sirf lower roles aur same company ko chher sakta hai
                                (!IsInYice &&
                                    isAdmin &&
                                    isSameCompany &&
                                    isSameRoleOrLower);

                            // Current Logged-in User


                            return (
                                <List.Item
                                    key={item[props.fieldsToRender[0]]}
                                    actions={[
                                        props.route === "usersRoles" ||
                                        props.route === "usersPermissions" ||
                                        props.route === "usersCompanies" ||
                                        props.route === "usersTeams" ||
                                        props.route === "usersPermissions" ||
                                        props.route === "usersPermissions" ? (
                                            <>
                                                {props.editComponentEssentials ? (
                                                    <FormModal
                                                        workingFunction={
                                                            props
                                                                .editComponentEssentials
                                                                .func
                                                        }
                                                        buttonDetails={{
                                                            title: "",
                                                            icon: (
                                                                <EditOutlined key="edit" />
                                                            ),
                                                            variant: "link",
                                                        }}
                                                        title={props.listTitle}
                                                        route={props.route}
                                                        okText="Update"
                                                        frm={
                                                            props
                                                                .editComponentEssentials
                                                                .frm
                                                        }
                                                        initialValues={item}
                                                    />
                                                ) : null}
                                                {props.deleteComponentEssentials ? (
                                                    <FormModal
                                                        workingFunction={
                                                            props
                                                                .deleteComponentEssentials
                                                                .func
                                                        }
                                                        buttonDetails={{
                                                            title: "",
                                                            icon: (
                                                                <DeleteOutlined key="delete" />
                                                            ),
                                                            variant: "link",
                                                            danger: true,
                                                        }}
                                                        title={props.listTitle}
                                                        route={props.route}
                                                        okText="Delete"
                                                        okType="danger"
                                                        frm={[]}
                                                        initialValues={item}
                                                    />
                                                ) : null}
                                            </>
                                        ) : (
                                            canEditDelete && (
                                                <>
                                                    {props.editComponentEssentials ? (
                                                        <FormModal
                                                            workingFunction={
                                                                props
                                                                    .editComponentEssentials
                                                                    .func
                                                            }
                                                            buttonDetails={{
                                                                title: "",
                                                                icon: (
                                                                    <EditOutlined key="edit" />
                                                                ),
                                                                variant: "link",
                                                            }}
                                                            title={
                                                                props.listTitle
                                                            }
                                                            route={props.route}
                                                            okText="Update"
                                                            frm={
                                                                props
                                                                    .editComponentEssentials
                                                                    .frm
                                                            }
                                                            initialValues={item}
                                                        />
                                                    ) : null}
                                                    {props.deleteComponentEssentials ? (
                                                        <FormModal
                                                            workingFunction={
                                                                props
                                                                    .deleteComponentEssentials
                                                                    .func
                                                            }
                                                            buttonDetails={{
                                                                title: "",
                                                                icon: (
                                                                    <DeleteOutlined key="delete" />
                                                                ),
                                                                variant: "link",
                                                                danger: true,
                                                            }}
                                                            title={
                                                                props.listTitle
                                                            }
                                                            route={props.route}
                                                            okText="Delete"
                                                            okType="danger"
                                                            frm={[]}
                                                            initialValues={item}
                                                        />
                                                    ) : null}
                                                </>
                                            )
                                        ),
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            props.withPicture ? (
                                                <Avatar
                                                    src={checkImageLink(
                                                        `${props.withPicture}/${props.fieldsToRender[0]}`
                                                    )}
                                                    alt="Image or Avatar"
                                                />
                                            ) : null
                                        }
                                        title={
                                            props.withUri ? (
                                                <a
                                                    href={`${
                                                        props.withUri.length > 5
                                                            ? `/${props.withUri}/${item.uuid}/${props.fieldsToRender[5]}`
                                                            : ""
                                                    }`}
                                                >
                                                    {
                                                        item[
                                                            props
                                                                .fieldsToRender[2]
                                                        ]
                                                    }
                                                </a>
                                            ) : props.fieldsToRender[2] ? (
                                                <span
                                                    style={{
                                                        textTransform:
                                                            "capitalize",
                                                    }}
                                                >
                                                    {item[
                                                        props.fieldsToRender[2]
                                                    ]?.replace(/-/g, " ")}
                                                </span>
                                            ) : null
                                        }
                                        description={
                                            props.fieldsToRender[3] &&
                                            item[props.fieldsToRender[3]] !==
                                                null
                                                ? `${
                                                      item[
                                                          props
                                                              .fieldsToRender[3]
                                                      ]
                                                  }`
                                                : ""
                                        }
                                    />
                                    <div>
                                        {props.fieldsToRender[4] &&
                                        item[props.fieldsToRender[4]] !== null
                                            ? item[props.fieldsToRender[4]]
                                            : ""}
                                        {item?.role_display_name && (
                                            <Tags
                                                type="roles"
                                                dataTitle={
                                                    item?.role_display_name
                                                }
                                                dataValue={item?.role_name}
                                            />
                                        )}
                                        {item?.permission_display_name && (
                                            <Tags
                                                type="permissions"
                                                dataTitle={
                                                    item?.permission_display_name
                                                }
                                                dataValue={
                                                    item?.permission_name
                                                }
                                            />
                                        )}
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                </InfiniteScroll>
            </div>
        </>
    );
};
export default App;
