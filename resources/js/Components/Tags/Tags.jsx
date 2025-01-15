import React from 'react';
import { Tag } from 'antd';

const Tags = (props) => {

    let data = [];
    let teamObjectArray = [
        {
            '1': 'purple',
            '2': 'magenta',
            '3': 'orange',
            '4': 'lime',
            '5': 'blue',
        },
        {
            '1': 'Main',
            '2': 'Branch A',
            '3': 'Branch B',
            '4': 'Branch C',
            '5': 'Branch Df',
        },
    ]
    switch (props.type) {
        case 'permissions':
            data = [
                {
                    'all-access': 'geekblue',
                    'create-access': 'green',
                    'udpate-access': 'cyan',
                    'delete-access': 'red',
                    'read-access': 'gold',
                },
                ...teamObjectArray

            ]
            break;
        case 'roles':
            data = [
                {
                    'owner': 'geekblue',
                    'admin': 'green',
                    'sales': 'cyan',
                    'accounts': 'volcano',
                    'team-lead': 'gold',
                },
                ...teamObjectArray
            ]
            break;
        default:
            break;
    }

    return (
        props.dataValue ? <>
            <Tag color={data[0][props.dataValue]}>{props.dataTitle}</Tag>
        </> : <>{console.log('No Data Given to The Component Tags')}N/A</>
    );
};

export default Tags;