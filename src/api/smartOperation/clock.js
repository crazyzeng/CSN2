import request from '@/utils/request';

export function getServerTime() {
    return request.post('/server/time');
}
