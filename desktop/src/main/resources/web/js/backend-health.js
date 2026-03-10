(function () {
    let timerId = null;
    let stopped = false;
    let isOnline = null;

    async function fetchWithTimeout(url, options, timeoutMs) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            return await fetch(url, {
                ...options,
                signal: controller.signal,
                cache: "no-store"
            });
        } finally {
            clearTimeout(timeoutId);
        }
    }

    function startBackendHealthCheck(config) {
        const settings = {
            url: "http://localhost:8080/api/health",
            onlineInterval: 20000,
            offlineInterval: 2000,
            timeout: 3000,
            onOnline: function () {},
            onOffline: function () {},
            onStatusChange: function () {},
            ...config
        };

        stopped = false;

        async function check() {
            try {
                const response = await fetchWithTimeout(
                    settings.url,
                    { method: "GET" },
                    settings.timeout
                );

                const nextStatus = response.ok;

                if (isOnline !== nextStatus) {
                    isOnline = nextStatus;
                    settings.onStatusChange(isOnline);

                    if (isOnline) {
                        settings.onOnline();
                    } else {
                        settings.onOffline();
                    }
                }
            } catch (error) {
                if (isOnline !== false) {
                    isOnline = false;
                    settings.onStatusChange(false);
                    settings.onOffline();
                }
            } finally {
                if (!stopped) {
                    const delay = isOnline ? settings.onlineInterval : settings.offlineInterval;
                    timerId = setTimeout(check, delay);
                }
            }
        }

        check();

        return {
            stop: function () {
                stopped = true;
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
            },
            checkNow: function () {
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                check();
            },
            getStatus: function () {
                return isOnline;
            }
        };
    }

    window.startBackendHealthCheck = startBackendHealthCheck;
})();