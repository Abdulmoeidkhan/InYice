import React, { useEffect, useState } from 'react';
import { Avatar, Divider, List, Skeleton, Space, Input, Button, Flex, Segmented } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined, EllipsisOutlined, BarsOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import FormModal from '../Modal/FormModal';
import Fuse from 'fuse.js';

const { Search } = Input;


const App = (props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState('');


    const dataRestructuring = (dataArrayOfObject, identifier) => {
        let convertedDataArrayOfArray = [];
        dataArrayOfObject.map((valueOfObj) => {
            switch (identifier) {
                case 'usersRoles':
                case 'usersPermissions':
                    convertedDataArrayOfArray.push([valueOfObj.id, valueOfObj.name, valueOfObj.display_name, valueOfObj.description])
                    break;
                case 'users':
                    convertedDataArrayOfArray.push([valueOfObj.id, valueOfObj.name, valueOfObj.email])
                    break;
                // case 'usersPermissions':
                //     convertedDataArrayOfObject.push({
                //         id: valueOfObj.id,
                //         firstItem: valueOfObj.name,
                //         secondItem: valueOfObj.display_name,
                //         thirdItem: valueOfObj.description
                //     })
                //     break;
                default:
                    break;
            }
        })
        return convertedDataArrayOfArray;
    }


    // Load Full Data & Initiate Request via UseEffect Start
    const loadData = async () => {
        if (loading) {
            return;
        }
        setLoading(true);
        const domanWithPort = import.meta.env.VITE_API_URL;
        await axios.get(`${domanWithPort}/${props.route}`)
            .then(function (response) {
                let convertedData = dataRestructuring(response.data.data, props.route)
                // console.log(response.data.data)
                setData(convertedData);
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
            // keys: [...props.searchKeys],
            // keys: ['firstItem', 'secondItem'],
        }
        setLoading(true);

        const fuse = new Fuse(data, options)
        const result = fuse.search(value)
        const foramtedResult = result.map(({ item }) => item);

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



    // // Rerender for filter data Start
    // useEffect(() => {
    //     console.log(filteredData, searchValue);
    // }, [filteredData]);
    // // Rerender for filter data  End




    // List InterFace (Action Button) Start
    // const actions = [
    // <EditOutlined key="edit" />,
    // <SettingOutlined key="setting" />,
    // <EllipsisOutlined key="ellipsis" />,
    // <DeleteOutlined key="delete" />
    // ];
    // List InterFace (Action Button) End

    // console.log(props.editComponent.props.initialData)
    // console.log(filteredData)

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
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        dataSource={filteredData}
                        renderItem={(item) => {
                            // console.log(item)
                            return (
                                <List.Item key={item[0]} actions={[
                                    props.editComponentEssentials ? <FormModal
                                        workingFunction={props.editComponentEssentials.func}
                                        buttonDetails={{ title: '', icon: <EditOutlined key="edit" />, variant: 'link' }}
                                        title={props.listTitle}
                                        route={props.route}
                                        okText='Update'
                                        parentState={props.parentState}
                                        setParentState={props.setParentState}
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
                                        parentState={props.parentState}
                                        setParentState={props.setParentState}
                                        frm={[]}
                                        initialValues={item}
                                    /> : ''
                                ]}>
                                    <List.Item.Meta
                                        avatar={props.withPicture ? <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item[0]}`} /> : ''}
                                        title={props.withUri ? <a href="https://ant.design">{item[1]}</a> : item[1]}
                                        description={item[2]}
                                    />
                                    {/* <div>{`${item.thirdItem}`}</div> */}
                                </List.Item>
                            )
                        }} />
                </InfiniteScroll>
            </div>
        </>
    );
};
export default App;