import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import COS from 'cos-js-sdk-v5';
import { uniqueId } from 'lodash';
const Bucket = 'blog-images-1302031947'; /* 存储桶 */
const Region = 'ap-guangzhou'; /* 存储桶所在地域，必须字段 */
const cos = new COS({
  SecretId: 'AKIDe7KHyPaU6RVJq53kAJCpBKFA7azB9sMC',
  SecretKey: 'mJabMwGK8gy0mIYZKq66pIuHNCl35pLb',
});

interface Props {
  values?: string[];
  onChange?: (values: string[]) => void;
  max?: number;
}
const TencentOssUpload: React.FC<Props> = ({
  values = [],
  onChange = () => {},
  max = 1,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(
    values.map(url => ({
      url,
      uid: uniqueId(),
      name: url.slice(url.lastIndexOf('/') + 1),
    }))
  );
  const handleChange: UploadProps['onChange'] = ({ file, fileList }) => {
    if (file.url) {
      setFileList(fileList);
      onChange(fileList.map(i => i.url!));
    }
  };
  const handleRequest: UploadProps['customRequest'] = ops => {
    const file = ops.file as File;
    console.log('file.name: ', file.name);
    cos.uploadFile({
      Bucket,
      Region,
      Key: 'images/' + file.name,
      Body: file,
      SliceSize: 1024 * 1024 * 10 /* 设置大于10MB采用分块上传 */,
      onProgress: function (info) {
        var percent = parseInt(info.percent * 10000 + '') / 100;
        var speed = parseInt((info.speed / 1024 / 1024) * 100 + '') / 100;
        console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
      },
      onFileFinish: function (err, data, options) {
        if (err) {
          console.log(err);
        }
        const _file = {
          url: 'http://' + data.Location,
          uid: data.ETag,
          name: file.name,
        };
        handleChange({
          file: _file,
          fileList: [...fileList, _file],
        });
      },
    });
  };
  const handleRemove: UploadProps['onRemove'] = file => {
    cos
      .deleteObject({
        Bucket,
        Region,
        Key: 'images/' + file.name,
      })
      .then(res => {
        console.log('删除成功');
      })
      .catch(err => {
        console.log('删除成功', err);
      });
  };
  return (
    <Upload
      listType="picture-card"
      onChange={handleChange}
      onRemove={handleRemove}
      customRequest={handleRequest}
      fileList={fileList}
    >
      {fileList.length >= max ? null : (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
      )}
    </Upload>
  );
};

export default TencentOssUpload;
