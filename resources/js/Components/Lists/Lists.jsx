import React, { useEffect, useState } from 'react';
import { Avatar, Divider, List, Skeleton, Input, Flex, } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined, EllipsisOutlined, BarsOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import FormModal from '../Modal/FormModal';
import Tags from '../Tags/Tags';
import Fuse from 'fuse.js';

const { Search } = Input;


const App = (props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState('');


    // Load Full Data & Initiate Request via UseEffect Start
    const loadData = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        const domanWithPort = import.meta.env.VITE_API_URL;
        await axios.get(`${domanWithPort}/${props.route}`)
            .then(function (response) {
                // console.log(response.data.data)
                setData(response.data.data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error)
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
            keys: props?.fieldsToRender || ['name'],
        }
        setLoading(true);

        const fuse = new Fuse(data, options)
        const result = fuse.search(value)
        const foramtedResult = result.map(({ item }) => item);
        // console.log(data)
        value ? setFilteredData(foramtedResult) : setFilteredData(data);

        setLoading(false);

        return result;
    }
    // Fuse Search Logics End


    // This Function is not in Use right now but it can be used for loading more data in Future
    // const showMoreData = async () => {
    //     if (loading) {
    //         return;
    //     }
    //     setLoading(true);
    //     console.log('loading more data');
    //     setLoading(false);
    // }



    // Rerender for data Storing And Searching Start
    useEffect(() => {
        searchFuse(searchValue);
        // console.log(data, searchValue);
    }, [data, searchValue]);
    // Rerender for data Storing And Searching End

    // List InterFace (Action Button) Start
    // const actions = [
    // <EditOutlined key="edit" />,
    // <SettingOutlined key="setting" />,
    // <EllipsisOutlined key="ellipsis" />,
    // <DeleteOutlined key="delete" />
    // ];
    // List InterFace (Action Button) End

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
        return isValid ? url : `https://api.dicebear.com/7.x/miniavs/svg?seed=1${randonNumber}`;
    }
    // Check Image URL is Valid or not End

    return (
        <>
            <Flex
                align='center'
                justify='space-between'
                gap='middle'
                style={{ width: '100%' }}
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
                    overflow: 'auto',
                    padding: '12px 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                    margin: '12px 0',
                }}
            >
                <InfiniteScroll
                    dataLength={filteredData.length}
                    // next={showMoreData}
                    // hasMore={filteredData.length < 5}
                    loader={
                        <Skeleton
                            avatar
                            paragraph={{
                                rows: 1,
                            }}
                            active
                        />
                    }
                    endMessage={<>
                        <Divider plain>It is all, nothing more 🤐</Divider>
                        {/* <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{
                                height: 60,
                            }}
                            description={
                                <Typography.Text>
                                    Customize <a href="#API">Description</a>
                                </Typography.Text>
                            }
                        >
                            {props.children}
                        </Empty> */}
                    </>}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        dataSource={filteredData}
                        renderItem={(item) => {
                            // console.log(props)
                            return (<List.Item key={item[props.fieldsToRender[0]]} actions={[
                                props.editComponentEssentials ? <FormModal
                                    workingFunction={props.editComponentEssentials.func}
                                    buttonDetails={{ title: '', icon: <EditOutlined key="edit" />, variant: 'link' }}
                                    title={props.listTitle}
                                    route={props.route}
                                    okText='Update'
                                    frm={props.editComponentEssentials.frm}
                                    initialValues={item}
                                /> : '',
                                props.deleteComponentEssentials ? <FormModal
                                    workingFunction={props.deleteComponentEssentials.func}
                                    buttonDetails={{ title: '', icon: <DeleteOutlined key="delete" />, variant: 'link', danger: true }}
                                    title={props.listTitle}
                                    route={props.route}
                                    okText='Delete'
                                    okType='danger'
                                    frm={[]}
                                    initialValues={item}
                                /> : ''
                            ]}>
                                <List.Item.Meta
                                    avatar={
                                        props.withPicture ? <Avatar src={checkImageLink(`${props.withPicture}/${props.fieldsToRender[0]}`)} alt='Image or Avatar' /> : ''
                                    }
                                    title={
                                        props.withUri
                                            ? <a href={`${props.withUri.length > 5 ? `/${props.withUri}/${item.uuid}/${props.fieldsToRender[5]}` : ''}`}>{item[props.fieldsToRender[2]]}</a>
                                            : (props.fieldsToRender[2]
                                                ? <><span style={{ textTransform: 'capitalize' }}> {item[props.fieldsToRender[2]]?.replace(/-/g, ' ')}</span></>
                                                : '')
                                    }
                                    description={props.fieldsToRender[3] && item[props.fieldsToRender[3]] !== null ? `${item[props.fieldsToRender[3]]}` : ''}
                                />
                                <div>
                                    {`${props.fieldsToRender[4] && item[props.fieldsToRender[4]] !== null ? item[props.fieldsToRender[4]] : ''}`}
                                    {item?.role_display_name && <Tags type="roles" dataTitle={item?.role_display_name} dataValue={item?.role_name} />}
                                    {item?.permission_display_name && <Tags type="permissions" dataTitle={item?.permission_display_name} dataValue={item?.permission_name} />}
                                </div>
                            </List.Item>)
                        }} />
                </InfiniteScroll>
            </div>
        </>
    );
};
export default App;