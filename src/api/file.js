/**
 * node 上传文件服务
 */
import request from "@/utils/request";
import Axios from 'axios';

export const uploadFile = (path, fileName, file) => {
  const formData = new FormData();
  formData.append('path', path);
  formData.append('fileName', fileName);
  formData.append('file', file);
  return request({
    url: `node/files/uploadFiles`,
    method: 'post',
    data:formData
  })
  // return Axios
  //     .post("http://192.168.2.15:8220/node/files/uploadFiles", formData)
};

export const deleteFile = pathArr => {
  const data = {
    type: 'files',
    list: pathArr.map(e => ({ type: 'file', path: e }))
  };
  console.log('data: ', data);
  return request({
    url: `node/utils/delFolderOrFile`,
    method: 'delete',
    data
  })
};


/**
 *
 * @param file 上传临时文件夹
 */
export const uploadTempFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    method:'post',
    url: '/file',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8',
    },
  })
}

export const getUploadFile = (str)=>{
  let ids
  if (Array.isArray(str))
    ids = str.join
  else
    ids = str
  return request({
    method:'get',
    url:'/file',
    params:{ids}
  })
}
