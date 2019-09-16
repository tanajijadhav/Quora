import React from 'react'
import { Typography } from 'antd';

const { Text } = Typography;

export default function FollowerCount({followers}) {
  return (
    <div>
      <Text type="secondary">{followers} Followers</Text>
    </div>
  )
}
