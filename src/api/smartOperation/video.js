import request from '@/utils/request'

export function getAllCamera() {
    return request.get('/videoController/getAllCamera')
}
