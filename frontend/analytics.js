/**
 * HelloWorld 前端埋点 SDK
 * 版本：v1.0.0
 * 创建时间：2026-04-16
 * 
 * 使用方式:
 * 1. 在页面头部引入此脚本
 * 2. 配置 window.helloworldAnalytics 对象
 * 3. 自动采集页面访问和用户行为
 */

(function(global) {
    'use strict';
    
    // SDK 版本
    const VERSION = '1.0.0';
    
    // 默认配置
    const DEFAULT_CONFIG = {
        projectId: 'helloworld',
        endpoint: 'https://analytics.helloworld.com/collect',
        autoTrack: true,          // 自动追踪页面访问
        enableDebug: false,       // 调试模式
        batchEvents: true,        // 批量上报
        batchInterval: 5000,      // 批量上报间隔 (ms)
        maxBatchSize: 10,         // 最大批量大小
        retryCount: 3,            // 失败重试次数
        sessionTimeout: 30 * 60 * 1000  // 会话超时 (30 分钟)
    };
    
    // 内部状态
    let config = {};
    let sessionId = null;
    let userId = null;
    let eventQueue = [];
    let batchTimer = null;
    let pageViewId = null;
    
    /**
     * 生成唯一 ID
     */
    function generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    /**
     * 获取或创建会话 ID
     */
    function getSessionId() {
        if (!sessionId) {
            sessionId = sessionStorage.getItem('hw_session_id');
            if (!sessionId) {
                sessionId = generateId();
                sessionStorage.setItem('hw_session_id', sessionId);
            }
        }
        return sessionId;
    }
    
    /**
     * 获取或创建用户 ID
     */
    function getUserId() {
        if (!userId) {
            userId = localStorage.getItem('hw_user_id');
            if (!userId) {
                userId = generateId();
                localStorage.setItem('hw_user_id', userId);
            }
        }
        return userId;
    }
    
    /**
     * 日志输出 (调试模式)
     */
    function log(message, data) {
        if (config.enableDebug) {
            console.log('[HelloWorld Analytics]', message, data || '');
        }
    }
    
    /**
     * 批量上报事件
     */
    function flushEvents() {
        if (eventQueue.length === 0) return;
        
        const events = eventQueue.splice(0, config.maxBatchSize);
        
        fetch(config.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId: config.projectId,
                sessionId: getSessionId(),
                userId: getUserId(),
                events: events,
                timestamp: Date.now()
            })
        })
        .then(response => {
            if (response.ok) {
                log('Events flushed successfully', events);
            } else {
                log('Failed to flush events', response.status);
                // 失败时重新加入队列
                eventQueue.unshift(...events);
            }
        })
        .catch(error => {
            log('Error flushing events', error);
            eventQueue.unshift(...events);
        });
    }
    
    /**
     * 调度批量上报
     */
    function scheduleFlush() {
        if (batchTimer) clearTimeout(batchTimer);
        batchTimer = setTimeout(flushEvents, config.batchInterval);
    }
    
    /**
     * 追踪事件
     * @param {string} eventType - 事件类型
     * @param {object} properties - 事件属性
     */
    function track(eventType, properties = {}) {
        const event = {
            eventId: generateId(),
            eventType: eventType,
            pageViewId: pageViewId,
            timestamp: Date.now(),
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            referrer: document.referrer,
            properties: properties,
            userAgent: navigator.userAgent,
            screen: {
                width: screen.width,
                height: screen.height
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        eventQueue.push(event);
        log('Event tracked', event);
        
        if (config.batchEvents) {
            scheduleFlush();
            // 达到批量大小时立即上报
            if (eventQueue.length >= config.maxBatchSize) {
                flushEvents();
            }
        } else {
            flushEvents();
        }
    }
    
    /**
     * 自动追踪页面访问
     */
    function trackPageView() {
        pageViewId = generateId();
        track('page_view', {
            page: window.location.pathname,
            title: document.title,
            referrer: document.referrer
        });
    }
    
    /**
     * 追踪用户点击
     */
    function setupClickTracking() {
        document.addEventListener('click', function(e) {
            const target = e.target;
            const element = target.closest('button, a, [data-track="click"]');
            
            if (element) {
                track('click', {
                    element: element.tagName.toLowerCase(),
                    id: element.id || null,
                    class: element.className || null,
                    text: element.textContent?.trim().substring(0, 100) || null,
                    href: element.href || null
                });
            }
        }, true);
    }
    
    /**
     * 追踪表单提交
     */
    function setupFormTracking() {
        document.addEventListener('submit', function(e) {
            const form = e.target;
            if (form.tagName === 'FORM') {
                track('form_submit', {
                    formId: form.id || null,
                    formClass: form.className || null,
                    action: form.action || null,
                    method: form.method || 'GET'
                });
            }
        }, true);
    }
    
    /**
     * 追踪页面停留时间
     */
    function setupSessionTracking() {
        let startTime = Date.now();
        
        window.addEventListener('beforeunload', function() {
            const duration = Date.now() - startTime;
            track('page_leave', {
                duration: duration,
                page: window.location.pathname
            });
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                startTime = Date.now();
            } else {
                const duration = Date.now() - startTime;
                track('page_hidden', {
                    duration: duration
                });
            }
        });
    }
    
    /**
     * 追踪性能指标
     */
    function trackPerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const navigationStart = timing.navigationStart;
            
            track('performance', {
                pageLoadTime: timing.loadEventEnd - navigationStart,
                domReadyTime: timing.domComplete - navigationStart,
                firstPaint: performance.getEntriesByType('paint')
                    .find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                resourceCount: performance.getEntriesByType('resource').length
            });
        }
    }
    
    /**
     * 追踪 JavaScript 错误
     */
    function setupErrorTracking() {
        window.addEventListener('error', function(e) {
            track('js_error', {
                message: e.message,
                source: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack
            });
        });
        
        window.addEventListener('unhandledrejection', function(e) {
            track('unhandled_rejection', {
                reason: e.reason?.toString() || 'Unknown',
                promise: e.promise
            });
        });
    }
    
    /**
     * 初始化 SDK
     * @param {object} userConfig - 用户配置
     */
    function init(userConfig = {}) {
        config = { ...DEFAULT_CONFIG, ...userConfig };
        
        log('SDK initialized', config);
        
        // 获取用户和会话 ID
        getUserId();
        getSessionId();
        
        // 自动追踪
        if (config.autoTrack) {
            trackPageView();
            setupClickTracking();
            setupFormTracking();
            setupSessionTracking();
            setupErrorTracking();
            
            // 性能追踪 (延迟执行以确保页面加载完成)
            window.addEventListener('load', function() {
                setTimeout(trackPerformance, 1000);
            });
        }
        
        // 暴露公共 API
        global.helloworldAnalytics = {
            track: track,
            identify: function(newUserId) {
                userId = newUserId;
                localStorage.setItem('hw_user_id', newUserId);
                track('identify', { userId: newUserId });
            },
            reset: function() {
                userId = null;
                sessionId = null;
                localStorage.removeItem('hw_user_id');
                sessionStorage.removeItem('hw_session_id');
            },
            flush: flushEvents,
            getConfig: function() { return { ...config }; },
            getVersion: function() { return VERSION; }
        };
        
        log('SDK ready');
    }
    
    // 自动初始化 (如果已配置)
    if (global.helloworldAnalytics && global.helloworldAnalytics.projectId) {
        init(global.helloworldAnalytics);
    }
    
    // 导出初始化函数
    global.HelloWorldAnalytics = {
        init: init,
        VERSION: VERSION
    };
    
})(typeof window !== 'undefined' ? window : this);
