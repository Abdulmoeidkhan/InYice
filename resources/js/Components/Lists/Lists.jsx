import React, { useEffect, useState } from 'react';
import { Avatar, Divider, List, Skeleton, Space, Input } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import Fuse from 'fuse.js';

const { Search } = Input;


const App = (props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);



    // Fuse Search Logics Start
    const searchFuse = (value) => {
        console.log(value, data)
        const options = {
            includeScore: false,
            keys: ['gender']
        }

        const fuse = new Fuse(data, options)

        const result = fuse.search(value)

        // setFilteredData(result)
        console.log(result);
    }
    // Fuse Search Logics End


    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
            .then((res) => res.json())
            .then((body) => {
                setData([...data, ...body.results]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        loadMoreData();
    }, []);
    return (
        <Space
            direction="vertical"
            size="middle"
            style={{
                display: 'flex',
                width: '100%',
            }}>
            <h2>{props.listTitle}</h2>
            <Search placeholder="Search User" onSearch={searchFuse} enterButton="Search" size="large" loading={false} />
            <div
                id="scrollableDiv"
                style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < 50}
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
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item key={item.email}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.picture.large} />}
                                    title={<a href="https://ant.design">{item.name.last}</a>}
                                    description={item.email}
                                />
                                <div>Content</div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </Space>
    );
};
export default App;