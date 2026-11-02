import { Loading } from 'element-ui';
import { debounce } from 'lodash-es';

let needLoadingRequestCount = 0;
let loading;

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)',
    });
}

function endLoading() {
    loading.close();
}

const tryCloseLoading = () => {
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
};

export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
}

export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        debounce(tryCloseLoading, 300)();
    }
}
