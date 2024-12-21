import React, { useEffect, useState } from 'react';
import { Avatar, Divider, List, Skeleton, Space, Input, Card, Flex, Segmented } from 'antd';
import { EditOutlined, SettingOutlined, EllipsisOutlined, BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
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
                setData(response.data.data);
                setLoading(false);
            })
            .catch(function (error) {
                setLoading(false);
            });
    };


    useEffect(() => {
        loadData();
    }, []);

    // Load Full Data & Initiate Request via UseEffect End


    // Fuse Search Logics Start
    const searchFuse = (value) => {
        const options = {
            includeScore: true,
            keys: [...props.searchKeys],
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
    const actions = [
        <EditOutlined key="edit" />,
        <SettingOutlined key="setting" />,
        <EllipsisOutlined key="ellipsis" />,
    ];
    // List InterFace (Action Button) End




    return (
        <>
            <Flex align='center' justify='space-between' gap='middle' style={{ width: '100%' }}>
                <h2>{props.listTitle}</h2></Flex>
            <Search allowClear placeholder="Search User" onSearch={(searchValue) => setSearchValue(searchValue)} enterButton="Search" size="large"  />
            <div
                id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '12px 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
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
                        renderItem={(item) => (
                            <List.Item key={item.email} actions={actions}>
                                <List.Item.Meta
                                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`} />}
                                    title={<a href="https://ant.design">{item.name}</a>}
                                    description={item.email} />
                                <div>Content</div>
                            </List.Item>
                        )} />
                </InfiniteScroll>
            </div>
        </>
    );
};
export default App;